#!/usr/bin/env python3
"""Decode YouTube iOS protobuf from HAR files.

Supports ad vs normal video classification, protobuf field decoding,
and video playback session analysis.
"""

import base64
import json
import re
import struct
import sys
from collections import OrderedDict
from urllib.parse import parse_qs, urlparse

KNOWN_FIELDS = {
    ("context", i): f"client.{name}"
    for i, name in {
        1: "hl",
        2: "gl",
        12: "device_make",
        13: "device_model",
        16: "client_name",
        17: "client_version",
        18: "os_name",
        19: "os_version",
        25: "device_id",
        37: "screen_width",
        38: "screen_height",
        41: "viewport_flag",
        46: "viewport_flag2",
        55: "screen_width_hint",
        56: "screen_height_hint",
        61: "form_factor",
        62: "onboarding_token",
        65: "float_field",
        67: "unknown_67",
        76: "accessibility_size_category",
        78: "form_factor_detail",
        80: "timezone",
        84: "device_capability",
        95: "feature_flags",
        97: "utc_offset_info",
        99: "country_code_3",
        100: "experiment_trigger",
        105: "connection_type",
        108: "delegation_token",
        111: "capability_descriptor",
    }.items()
}

KNOWN_CONTEXT_WRAPPER_FIELDS = {
    1: "client",
    3: "user",
    5: "click_tracking",
    6: "request_data",
    9: "client_flow",
    11: "visitor_id",
    12: "client_settings",
}

KNOWN_RESPONSE_FIELDS = {
    ("response", i): name
    for i, name in {
        1: "response_context",
        2: "contents",
        3: "video_data",
        4: "actions",
        5: "continuation_data",
        6: "guide_data",
        7: "att_data",
        8: "notification_data",
        9: "feed_data",
        10: "setting_data",
        12: "client_field_12",
        13: "ad_break_data",
        14: "ad_slot_data",
        15: "shorts_data",
        16: "unknown_16",
        17: "reel_sequence",
        19: "header_data",
        25: "unknown_25",
        26: "channel_data",
        29: "field_29",
        30: "tracking_data",
        31: "unknown_31",
        33: "field_33",
        37: "unknown_37",
        40: "notification_config",
        42: "short_form_data",
        44: "timestamp",
        47: "setting_config",
        53: "element_data",
        777: "eml_data",
    }.items()
}

KNOWN_HASH_FIELDS = {
    139970731: "reel_item",
    150475697: "timestamp_metadata",
    113762946: "action_menu",
    65153809: "button_config",
    77875886: "player_config",
    75730170: "tracking_payload",
    303209365: "playback_state",
    60091038: "engagement_panel",
    84996305: "navigation_endpoint",
    76818770: "player_layout",
    328964737: "layout_config",
    111079109: "report_reason",
    60487319: "comments_continuation",
    99: "country_info",
    100: "experiment_trigger",
    97: "utc_offset",
    48687626: "channel_handle",
    48687709: "subscription_info",
    49399797: "section_identifier",
    50195462: "section_item",
    50236216: "app_branding",
    58173949: "feed_header",
    58174010: "tab_renderer",
    62960614: "ad_slot_renderer",
    84813246: "shelf_renderer",
    95143705: "topbar_menu",
    117501096: "pivot_entry",
    117866661: "pivot_bar_renderer",
    123267149: "topbar_renderer",
    138681066: "engagement_panel_section",
    138681548: "panel_header",
    138681778: "unknown_138681778",
    139608561: "navigation_endpoint_v2",
    146179543: "unknown_146179543",
    153515154: "flexible_actions_renderer",
    168777401: "unknown_168777401",
    169768054: "tracking_params_renderer",
    172035250: "unknown_172035250",
    172660663: "element_renderer",
    179103219: "tap_action_endpoint",
    183314536: "impression_tracking",
    196886555: "template_registry",
    204158123: "unknown_204158123",
    253885845: "unknown_253885845",
    278463287: "unknown_278463287",
    322055134: "notification_endpoint",
    325110794: "unknown_325110794",
    350496818: "tracking_data",
    357104971: "unknown_357104971",
    361256913: "unknown_361256913",
    361588638: "video_card_renderer",
    370727981: "age_restriction_renderer",
    371022207: "unknown_371022207",
    379568079: "unknown_379568079",
    386334485: "unknown_386334485",
    386334486: "unknown_386334486",
    386334487: "unknown_386334487",
    407180959: "app_install_endpoint",
    413471385: "unknown_413471385",
    421320458: "theme_config",
    423179876: "capabilities_config",
    426171393: "element_config",
    426171394: "resource_registry",
    436517566: "channel_renderer",
    525000123: "unknown_525000123",
    62975126: "unknown_62975126",
    79857908: "unknown_79857908",
    84818269: "unknown_84818269",
    84897255: "unknown_84897255",
    90650344: "unknown_90650344",
    98150882: "unknown_98150882",
    66439850: "unknown_66439850",
    36263367: "unknown_36263367",
    10319340: "unknown_10319340",
    213904: "unknown_213904",
    227517: "unknown_227517",
    282382: "unknown_282382",
    398971: "unknown_398971",
    146956: "unknown_146956",
}

KNOWN_STRING_VALUES = OrderedDict(
    [
        ("logged_in", "logged_in"),
        ("visitor_data", "visitor_data"),
        ("client.version", "client.version"),
        ("client.name", "client.name"),
        ("browse_id", "browse_id"),
        ("browse_id_prefix", "browse_id_prefix"),
        ("context", "context"),
        ("FEwhat_to_watch", "FEwhat_to_watch"),
        ("FElibrary", "FElibrary"),
        ("FEshorts", "FEshorts"),
        ("FEsubscriptions", "FEsubscriptions"),
        ("FEnotifications_inbox", "FEnotifications_inbox"),
        ("reel", "reel_content_type"),
        ("shorts-comments-panel", "shorts_comments_panel"),
        ("video-description-ep-identifier", "video_description_panel"),
        ("PAproduct_list", "PAproduct_list"),
        ("com.google.ios.youtube", "bundle_id"),
    ]
)

ENDPOINT_NAMES = {
    "guide": "Guide (Sidebar)",
    "browse": "Browse (Home Feed)",
    "next": "Next (Recommendations)",
    "reel/reel_item_watch": "Reel Item Watch (Shorts)",
    "reel/reel_watch_sequence": "Reel Watch Sequence",
    "att/get": "ATT Get",
    "notification_registration/get_settings": "Notification Settings",
    "account/get_setting_values": "Account Settings",
    "log_event": "Log Event",
    "generate_204": "Connectivity Check",
    "ad_activeview": "Ad ActiveView Tracking",
    "playback_tracking": "Playback Tracking",
    "playback": "Playback Stats",
    "watchtime": "Watchtime Stats",
    "atr": "Ad Tracking Report (ATR)",
    "video_playback": "Video Playback Stream (UMP)",
    "init_playback": "Init Playback",
    "suggest_search": "Suggest Search",
    "play_log": "Play Log",
    "crash_report": "Crash Report",
    "player/ad_break": "Player Ad Break",
    "get_panel": "Get Panel",
    "config": "Config",
    "feedback": "Feedback",
    "search": "Search",
}

VIDEO_ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")

AD_PROTOBUF_MARKERS = [
    b"Sponsored",
    b"ad_badge",
    b"ad_subscribe_button",
    b"ad_avatar",
    b"feed_ad_metadata",
    b"feed_ad_extension",
    b"ad_disclosure_banner",
    b"ad_button",
    b"ad_card_badge",
    b"ad_rating",
    b"ad_icon_text",
    b"ad_details_line",
    b"carousel_ad_card",
    b"countdown_banner",
]

AD_URL_PATTERNS = [
    b"pcs/activeview",
    b"googleadservices.com/pagead/aclk",
    b"youtube.com/pagead/adview",
    b"doubleclick.net",
]

AD_SESSION_ID_RE = re.compile(rb"\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:")
AD_SERVING_METADATA_RE = re.compile(rb"\$\d{13}:\d+:\d+:\d+@")

SHORT_PROTOBUF_MARKERS = [
    b"shorts-shelf-item-",
    b"shorts_lockup",
    b"shorts_shelf",
]

PLAYBACK_AD_PARAMS = {
    "oad": "ad_buffer_duration_ms",
    "ovd": "ad_video_duration_ms",
    "oaad": "ad_audio_duration_ms",
    "oavd": "ad_audio_video_duration_ms",
    "opf": "offline_prefetch",
}

CTIER_VALUES = {
    "SH": "Short (vertical video)",
    "L": "Live",
    "U": "Upcoming live",
}


class Colors:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    RED = "\033[31m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    BLUE = "\033[34m"
    MAGENTA = "\033[35m"
    CYAN = "\033[36m"
    WHITE = "\033[37m"


USE_COLOR = sys.stdout.isatty()

VIDEO_CATEGORIES = {
    "AD": {"color": Colors.RED, "icon": "[AD]", "desc": "Ad / Sponsored"},
    "NORMAL": {"color": Colors.GREEN, "icon": "   ", "desc": "Normal video"},
    "SHORT": {"color": Colors.MAGENTA, "icon": "[SH]", "desc": "Short / Reel"},
    "SHORT_AD": {"color": Colors.RED, "icon": "[SH]", "desc": "Short Ad"},
}


def classify_video_section(data, video_id, context_radius=3000):
    vid_bytes = video_id.encode("utf-8")
    pos = data.find(vid_bytes)
    if pos == -1:
        return "UNKNOWN", []

    ctx_start = max(0, pos - context_radius)
    ctx_end = min(len(data), pos + context_radius)
    before = data[ctx_start:pos]
    after = data[pos:ctx_end]
    context = data[ctx_start:ctx_end]

    indicators = []

    for marker in AD_PROTOBUF_MARKERS:
        if marker in context:
            indicators.append(f"ad_marker:{marker.decode('utf-8', errors='replace')}")

    for url_pat in AD_URL_PATTERNS:
        if url_pat in before[-1500:] or url_pat in after[:1500]:
            indicators.append(f"ad_url:{url_pat.decode('utf-8')}")

    if b"Sponsored" in after[:1000]:
        indicators.append("sponsored_label")

    if AD_SESSION_ID_RE.search(before[-500:]):
        indicators.append("ad_session_uuid")

    if AD_SERVING_METADATA_RE.search(before[-500:]):
        indicators.append("ad_serving_metadata")

    is_short = any(m in context for m in SHORT_PROTOBUF_MARKERS)

    if indicators:
        return ("SHORT_AD" if is_short else "AD"), indicators
    if is_short:
        return "SHORT", ["shorts_shelf_item"]
    return "NORMAL", []


def find_all_videos(data):
    vids = OrderedDict()
    for m in re.finditer(rb"i\.ytimg\.com/vi/([A-Za-z0-9_-]{11})", data):
        vid = m.group(1).decode("utf-8")
        if vid not in vids:
            vids[vid] = m.start()
    for m in re.finditer(rb"shorts-shelf-item-([A-Za-z0-9_-]{11})", data):
        vid = m.group(1).decode("utf-8")
        if vid not in vids:
            vids[vid] = m.start()
    return vids


def classify_playback_session(url, all_params):
    params = {k: v[0] for k, v in all_params.items()}
    info = {"ad_params": {}, "ctier": None, "is_prefetch": False}

    for key, desc in PLAYBACK_AD_PARAMS.items():
        if key in params:
            info["ad_params"][key] = {"value": params[key], "desc": desc}

    ctier = params.get("ctier")
    if ctier:
        info["ctier"] = ctier
        info["ctier_desc"] = CTIER_VALUES.get(ctier, f"Unknown ({ctier})")

    if params.get("opf") == "1":
        info["is_prefetch"] = True

    return info


def c(color, text):
    if not USE_COLOR:
        return text
    return f"{color}{text}{Colors.RESET}"


def decode_varint(data, pos):
    result = 0
    shift = 0
    while pos < len(data):
        b = data[pos]
        result |= (b & 0x7F) << shift
        pos += 1
        if (b & 0x80) == 0:
            return result, pos
        shift += 7
    return result, pos


def is_printable(data):
    if not data:
        return False
    try:
        s = data.decode("utf-8")
        return all(32 <= ord(ch) < 127 or ch in "\n\r\t" for ch in s)
    except (UnicodeDecodeError, ValueError):
        return False


def format_bytes(data, max_hex=64):
    if len(data) <= max_hex:
        return data.hex()
    return f"{data[:max_hex].hex()}... ({len(data)} bytes)"


def field_label(field_number, parent_path=""):
    parts = parent_path.strip(".").split(".") if parent_path else []
    parent = parts[-1] if parts else ""

    if parent in ("context", "1"):
        key = ("context", field_number)
        if key in KNOWN_FIELDS:
            return c(Colors.CYAN, KNOWN_FIELDS[key])
        if field_number in KNOWN_CONTEXT_WRAPPER_FIELDS:
            return c(Colors.CYAN, KNOWN_CONTEXT_WRAPPER_FIELDS[field_number])

    if parent == "" or parent == "response":
        key = ("response", field_number)
        if key in KNOWN_RESPONSE_FIELDS:
            return c(Colors.CYAN, KNOWN_RESPONSE_FIELDS[key])

    if field_number in KNOWN_HASH_FIELDS:
        return c(Colors.MAGENTA, KNOWN_HASH_FIELDS[field_number])

    return str(field_number)


def decode_protobuf(data, depth=0, max_depth=8, parent_path=""):
    if depth > max_depth or not data:
        return []

    results = []
    pos = 0
    indent = "  " * depth

    while pos < len(data):
        if pos >= len(data):
            break

        try:
            tag_val, new_pos = decode_varint(data, pos)
            if new_pos <= pos:
                break
            pos = new_pos
        except Exception:
            break

        field_number = tag_val >> 3
        wire_type = tag_val & 0x07
        label = field_label(field_number, parent_path)
        current_path = f"{parent_path}.{field_number}"

        if wire_type == 0:
            try:
                value, pos = decode_varint(data, pos)
            except Exception:
                break

            val_str = str(value)
            if field_number == 16 and parent_path in (".1.1", "1.1"):
                client_names = {
                    1: "WEB",
                    2: "ANDROID",
                    3: "MWEB",
                    5: "IOS",
                    14: "TVHTML5",
                    15: "IOS_LITE",
                    16: "IOS_KIDS",
                    21: "IOS_MUSIC",
                    28: "ANDROID_CREATOR",
                    30: "IOS_CREATOR",
                    55: "ANDROID_VR",
                    58: "IOS_SPORTS",
                }
                if value in client_names:
                    val_str = f"{value} ({client_names[value]})"
            if field_number == 105 and parent_path in (".1.1", "1.1"):
                connection_types = {
                    0: "UNKNOWN",
                    1: "WIFI",
                    2: "CELLULAR_2G",
                    3: "CELLULAR_3G",
                    4: "CELLULAR_4G",
                    5: "CELLULAR_5G",
                    6: "CELLULAR_UNKNOWN",
                    7: "CELLULAR_EDGE",
                    8: "CELLULAR_LTE",
                    16: "NONE",
                    17: "CARRIER",
                }
                if value in connection_types:
                    val_str = f"{value} ({connection_types[value]})"
            if field_number == 61 and parent_path in (".1.1", "1.1"):
                form_factors = {
                    0: "UNKNOWN_FORM_FACTOR",
                    1: "SMALL_FORM_FACTOR",
                    2: "LARGE_FORM_FACTOR",
                    3: "MEDIUM_FORM_FACTOR",
                }
                if value in form_factors:
                    val_str = f"{value} ({form_factors[value]})"
            results.append(f"{indent}[{label}] = {c(Colors.GREEN, val_str)}")

        elif wire_type == 2:
            try:
                length, pos = decode_varint(data, pos)
            except Exception:
                break
            if length < 0 or pos + length > len(data):
                break
            value = data[pos : pos + length]
            pos += length

            if is_printable(value):
                s = value.decode("utf-8")
                ad_tag = ""
                s_lower = s.lower()
                is_ad = any(m.decode().lower() in s_lower for m in AD_PROTOBUF_MARKERS)
                is_ad_url = any(p.decode().lower() in s_lower for p in AD_URL_PATTERNS)
                if is_ad or is_ad_url:
                    ad_tag = f" {c(Colors.RED, '[AD]')}"

                if VIDEO_ID_RE.match(s) and parent_path != "":
                    results.append(
                        f"{indent}[{label}] = {c(Colors.YELLOW, 'VIDEO_ID')} {c(Colors.RED, s)}"
                    )
                elif len(s) > 300:
                    results.append(
                        f'{indent}[{label}] = "{c(Colors.WHITE, s[:300])}..." ({len(s)} chars){ad_tag}'
                    )
                else:
                    results.append(
                        f'{indent}[{label}] = "{c(Colors.WHITE, s)}"{ad_tag}'
                    )
            elif 1 < len(value):
                nested = decode_protobuf(
                    value, depth + 1, max_depth, current_path
                )
                if nested:
                    results.append(
                        f"{indent}[{label}] {{  {c(Colors.DIM, f'// {len(value)} bytes')}"
                    )
                    results.extend(nested)
                    results.append(f"{indent}}}")
                else:
                    results.append(
                        f"{indent}[{label}] = bytes({format_bytes(value)})"
                    )
            else:
                results.append(
                    f"{indent}[{label}] = bytes({len(value)})"
                )

        elif wire_type == 1:
            if pos + 8 > len(data):
                break
            raw = data[pos : pos + 8]
            pos += 8
            fval = struct.unpack("<d", raw)[0]
            ival = struct.unpack("<Q", raw)[0]
            if fval == float("inf") or fval != fval:
                results.append(
                    f"{indent}[{label}] = 64-bit(0x{ival:016x})"
                )
            else:
                results.append(
                    f"{indent}[{label}] = {c(Colors.GREEN, f'{fval}')}"
                )

        elif wire_type == 5:
            if pos + 4 > len(data):
                break
            raw = data[pos : pos + 4]
            pos += 4
            fval = struct.unpack("<f", raw)[0]
            ival = struct.unpack("<I", raw)[0]
            if abs(fval) < 1e-30 and fval != 0.0:
                results.append(
                    f"{indent}[{label}] = 32-bit(0x{ival:08x})"
                )
            else:
                results.append(
                    f"{indent}[{label}] = {c(Colors.GREEN, f'{fval}')}"
                )

        else:
            results.append(
                f"{indent}[{label}] <unknown wire_type={wire_type}>"
            )
            break

    return results


def decode_body(raw_bytes, max_depth=7, label="Body", parent_path=""):
    if not raw_bytes:
        return [f"  ({label} empty)"]

    lines = decode_protobuf(raw_bytes, depth=1, max_depth=max_depth, parent_path=parent_path)
    if lines:
        return lines

    if is_printable(raw_bytes):
        s = raw_bytes.decode("utf-8")
        return [f'  (text): "{s[:500]}"']

    return [f"  (binary, {len(raw_bytes)} bytes): {format_bytes(raw_bytes)}"]


def get_body_bytes(entry, is_request=True):
    if is_request:
        pd = entry["request"].get("postData", {})
        text = pd.get("text", "")
    else:
        content = entry["response"].get("content", {})
        text = content.get("text", "")
        enc = content.get("encoding")
        if enc == "base64" and text:
            return base64.b64decode(text)

    if not text:
        return b""

    try:
        decoded = base64.b64decode(text, validate=True)
        if decoded and len(decoded) > 0:
            return decoded
    except Exception:
        pass

    return text.encode("utf-8")


def get_endpoint_name(url):
    path = url.split("?")[0]
    if "youtubei.googleapis.com/youtubei/v1/" in path:
        endpoint = path.split("/youtubei/v1/")[-1]
    elif "suggestqueries.google.com" in path:
        endpoint = "suggest_search"
    elif "googlevideo.com" in path:
        if "videoplayback" in path:
            endpoint = "video_playback"
        elif "initplayback" in path:
            endpoint = "init_playback"
        else:
            endpoint = "googlevideo"
    elif "play.googleapis.com/log" in path:
        endpoint = "play_log"
    elif "clients2.google.com/cr/report" in path:
        endpoint = "crash_report"
    elif "s.youtube.com/api/stats/" in path:
        endpoint = path.split("/api/stats/")[-1].split("?")[0]
    elif "youtube.com/pcs/activeview" in path:
        endpoint = "ad_activeview"
    elif "youtube.com/ptracking" in path:
        endpoint = "playback_tracking"
    elif "app-analytics-services.com" in path:
        endpoint = "analytics"
    elif "itunes.apple.com" in path:
        endpoint = "itunes"
    else:
        endpoint = path.split("/")[-1].split("?")[0]

    return endpoint


def is_protobuf_entry(entry):
    resp_mime = entry["response"].get("content", {}).get("mimeType", "")
    req_mime = entry["request"].get("postData", {}).get("mimeType", "")
    return "protobuf" in resp_mime or "protobuf" in req_mime


def print_separator(char="=", length=80):
    print(c(Colors.DIM, char * length))


def print_header(title, char="="):
    print()
    print_separator(char)
    print(c(Colors.BOLD, f" {title}"))
    print_separator(char)


def classify_videos(har_path):
    try:
        with open(har_path, "r", encoding="utf-8") as f:
            har = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(c(Colors.RED, f"Error reading HAR file: {e}"))
        sys.exit(1)

    entries = har["log"]["entries"]

    print_header("Video Classification from HAR")
    classified = {"AD": [], "SHORT": [], "NORMAL": [], "UNKNOWN": []}

    for i, entry in enumerate(entries):
        resp_data = get_body_bytes(entry, is_request=False)
        if not resp_data or len(resp_data) < 1000:
            continue

        url = entry["request"]["url"]
        endpoint = get_endpoint_name(url)
        if endpoint not in ("browse", "reel/reel_item_watch", "reel/reel_watch_sequence"):
            continue

        videos = find_all_videos(resp_data)
        if not videos:
            continue

        friendly = ENDPOINT_NAMES.get(endpoint, endpoint)
        print(f"\n  {c(Colors.BOLD, f'Entry #{i}')} ({friendly}): {len(videos)} video(s)")

        for vid, offset in videos.items():
            category, indicators = classify_video_section(resp_data, vid)
            if vid not in classified.get(category, classified["NORMAL"]):
                classified.setdefault(category, []).append(vid)

            cat_info = VIDEO_CATEGORIES.get(category, VIDEO_CATEGORIES["NORMAL"])
            icon = c(cat_info["color"], cat_info["icon"])
            desc = c(cat_info["color"], cat_info["desc"])

            indicator_str = ""
            if indicators:
                indicator_str = c(Colors.DIM, f"  [{', '.join(indicators[:3])}]")

            print(f"    {icon} {c(Colors.RED, vid)} {desc}{indicator_str}")

    print_header("Summary")
    for cat, vids in classified.items():
        if vids:
            cat_info = VIDEO_CATEGORIES.get(cat, VIDEO_CATEGORIES["NORMAL"])
            label = c(cat_info["color"], f"{cat_info['desc']} ({len(vids)})")
            vid_list = ", ".join(vids[:8])
            if len(vids) > 8:
                vid_list += f" ... (+{len(vids) - 8} more)"
            print(f"  {label}: {vid_list}")

    return classified


def analyze_playback(har_path):
    try:
        with open(har_path, "r", encoding="utf-8") as f:
            har = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(c(Colors.RED, f"Error reading HAR file: {e}"))
        sys.exit(1)

    entries = har["log"]["entries"]

    print_header("Playback Session Analysis")

    sessions = OrderedDict()
    for i, entry in enumerate(entries):
        url = entry["request"]["url"]
        if "googlevideo.com" not in url:
            continue
        if "videoplayback" not in url and "initplayback" not in url:
            continue

        parsed = urlparse(url)
        params = parse_qs(parsed.query)
        cpn = params.get("cpn", [None])[0]
        ei = params.get("ei", [params.get("id", ["unknown"])[0]])[0]
        session_key = cpn or ei or f"session_{i}"

        if session_key not in sessions:
            sessions[session_key] = {
                "cpn": cpn,
                "ei": ei,
                "requests": [],
                "total_bytes": 0,
                "has_atr": False,
                "docid": None,
            }

        resp_size = entry["response"].get("content", {}).get("size", 0)
        sessions[session_key]["requests"].append(
            {"index": i, "url": url, "params": params, "size": resp_size}
        )
        sessions[session_key]["total_bytes"] += resp_size

        if params.get("docid"):
            sessions[session_key]["docid"] = params["docid"][0]

    atr_entries = [
        (i, e) for i, e in enumerate(entries)
        if "stats/atr" in e["request"]["url"]
    ]
    for i, entry in atr_entries:
        url = entry["request"]["url"]
        params = parse_qs(urlparse(url).query)
        docid = params.get("docid", [None])[0]
        cpn = params.get("cpn", [None])[0]
        for sk, sess in sessions.items():
            if (cpn and sess["cpn"] == cpn) or (docid and sess["docid"] == docid):
                sess["has_atr"] = True

    ad_url_entries = [
        (i, e) for i, e in enumerate(entries)
        if any(p in e["request"]["url"] for p in ["pagead", "activeview", "googleadservices"])
    ]

    for sk, sess in sessions.items():
        if sess["cpn"]:
            print(f"\n  {c(Colors.BOLD, 'Session:')} {sess['cpn']}")
        else:
            print(f"\n  {c(Colors.BOLD, 'Session:')} {sk[:30]}...")

        if sess["docid"]:
            print(f"    Video: {c(Colors.RED, sess['docid'])}")

        print(f"    Requests: {len(sess['requests'])}  Total: {sess['total_bytes']:,} bytes")

        for req in sess["requests"]:
            endpoint = "videoplayback" if "videoplayback" in req["url"] else "initplayback"
            info = classify_playback_session(req["url"], req["params"])
            extras = []
            if info["ctier"]:
                extras.append(f"ctier={info['ctier']}({info.get('ctier_desc', '')})")
            if info["is_prefetch"]:
                extras.append(c(Colors.YELLOW, "prefetch"))
            if info["ad_params"]:
                ad_params_str = ", ".join(
                    f"{k}={v['value']}" for k, v in info["ad_params"].items()
                )
                extras.append(c(Colors.RED, f"ad_params: {ad_params_str}"))
            extra_str = f"  {', '.join(extras)}" if extras else ""
            print(f"    [{req['index']:>2}] {endpoint:15s} {req['size']:>10,} bytes{extra_str}")

        if sess["has_atr"]:
            print(f"    {c(Colors.RED, '** Ad Tracking Report (ATR) detected **')}")
        if sess["docid"]:
            for ai, ae in ad_url_entries:
                aurl = ae["request"]["url"]
                if sess["docid"] in aurl or (sess["cpn"] and sess["cpn"] in aurl):
                    print(f"    {c(Colors.RED, f'[{ai}] Ad URL: {aurl[:100]}')}")

    print(f"\n  {c(Colors.BOLD, 'Legend:')}")
    print(f"    {c(Colors.RED, 'ctier=SH')} = Short content tier")
    print(f"    {c(Colors.YELLOW, 'opf=1')} = Offline prefetch (preloading next video)")
    print(f"    {c(Colors.RED, 'oad/oaad/oavd')} = Ad buffer/duration params (always present in initplayback)")
    print(f"    {c(Colors.RED, 'ATR')} = Ad Tracking Report (stats/atr endpoint)")


def process_har(har_path, filter_endpoint=None, show_request=True, show_response=True, max_depth=7):
    try:
        with open(har_path, "r", encoding="utf-8") as f:
            har = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(c(Colors.RED, f"Error reading HAR file: {e}"))
        sys.exit(1)

    entries = har["log"]["entries"]
    print(c(Colors.BOLD, f"\nYouTube HAR Protobuf Decoder"))
    print(f"HAR file: {har_path}")
    print(f"Total entries: {len(entries)}")

    proto_count = 0
    for i, entry in enumerate(entries):
        endpoint = get_endpoint_name(entry["request"]["url"])
        if not is_protobuf_entry(entry):
            continue

        if filter_endpoint and filter_endpoint.lower() not in endpoint.lower():
            continue

        proto_count += 1
        friendly = ENDPOINT_NAMES.get(endpoint, endpoint)
        req = entry["request"]
        resp = entry["response"]
        resp_size = resp.get("content", {}).get("size", 0)

        print_header(f"Entry #{i}: {friendly} ({endpoint})")
        print(f"  {req['method']} {c(Colors.BLUE, req['url'][:200])}")
        print(f"  Status: {resp['status']}  Response size: {resp_size:,} bytes")

        for h in req["headers"]:
            name_lower = h["name"].lower()
            if name_lower in (
                "x-youtube-client-name",
                "x-youtube-client-version",
                "content-type",
                "x-goog-request-params",
            ):
                print(f"  {h['name']}: {h['value'][:150]}")

        if show_request:
            req_data = get_body_bytes(entry, is_request=True)
            if req_data:
                print(f"\n  {c(Colors.BOLD, '--- Request Body ---')} ({len(req_data):,} bytes)")
                for line in decode_body(req_data, max_depth, "Request", ".1"):
                    print(line)

        if show_response:
            resp_data = get_body_bytes(entry, is_request=False)
            if resp_data:
                print(f"\n  {c(Colors.BOLD, '--- Response Body ---')} ({len(resp_data):,} bytes)")
                for line in decode_body(resp_data, max_depth, "Response", "response"):
                    print(line)

    if proto_count == 0:
        print(c(Colors.YELLOW, "\nNo protobuf entries found in HAR file."))
    else:
        print(f"\n{c(Colors.GREEN, f'Decoded {proto_count} protobuf entries.')}")


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Decode YouTube iOS protobuf from HAR files"
    )
    parser.add_argument("har_file", help="Path to the HAR file")
    parser.add_argument(
        "-f",
        "--filter",
        help="Filter entries by endpoint name (e.g. 'browse', 'reel')",
        default=None,
    )
    parser.add_argument(
        "--no-request",
        action="store_true",
        help="Hide request bodies",
    )
    parser.add_argument(
        "--no-response",
        action="store_true",
        help="Hide response bodies",
    )
    parser.add_argument(
        "-d",
        "--max-depth",
        type=int,
        default=7,
        help="Maximum protobuf nesting depth (default: 7)",
    )
    parser.add_argument(
        "--classify",
        action="store_true",
        help="Classify all videos as AD, NORMAL, or SHORT",
    )
    parser.add_argument(
        "--playback",
        action="store_true",
        help="Analyze video playback sessions and ad tracking",
    )

    args = parser.parse_args()

    if args.classify:
        classify_videos(args.har_file)
    elif args.playback:
        analyze_playback(args.har_file)
    else:
        process_har(
            args.har_file,
            filter_endpoint=args.filter,
            show_request=not args.no_request,
            show_response=not args.no_response,
            max_depth=args.max_depth,
        )


if __name__ == "__main__":
    main()
