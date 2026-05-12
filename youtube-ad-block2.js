if ($response.body) {
    try {
        if ($request && $request.url) {
            let url = $request.url;
            if (url.indexOf("/player/ad_break") !== -1 ||
                url.indexOf("/player/heartbeat") !== -1 ||
                url.indexOf("/player/get_live_stream_ad_tag") !== -1 ||
                url.indexOf("/ptracking") !== -1 ||
                url.indexOf("/pagead") !== -1 ||
                url.indexOf("/get_video_info") !== -1) {
                $done({ body: "" });
                return;
            }
        }

        let body;
        if (typeof $response.body === "string") {
            body = JSON.parse($response.body);
        } else if ($response.body instanceof Uint8Array || $response.body instanceof ArrayBuffer) {
            let bytes = $response.body instanceof ArrayBuffer ? new Uint8Array($response.body) : $response.body;
            body = JSON.parse(String.fromCharCode.apply(null, bytes));
        } else {
            body = $response.body;
        }

        function stripPlayerAds(obj) {
            if (!obj || typeof obj !== "object") return;

            if (obj.adPlacements) obj.adPlacements = [];
            if (obj.playerAds) obj.playerAds = [];
            if (obj.adSlots) obj.adSlots = [];
            if (obj.adBreakHeartbeatParams) delete obj.adBreakHeartbeatParams;
            if (obj.adCuepoints) obj.adCuepoints = [];
            if (obj.midrollConfig) delete obj.midrollConfig;

            if (obj.streamingData) {
                if (obj.streamingData.adPlayback) delete obj.streamingData.adPlayback;
                if (obj.streamingData.formats) {
                    obj.streamingData.formats = obj.streamingData.formats.filter(f =>
                        f && !(f.url && f.url.indexOf("oad=") !== -1)
                    );
                }
                if (obj.streamingData.adaptiveFormats) {
                    obj.streamingData.adaptiveFormats = obj.streamingData.adaptiveFormats.filter(f =>
                        f && !(f.approxDurationMs === "0" && f.url && f.url.indexOf("oad=") !== -1)
                    );
                }
            }

            if (obj.playabilityStatus) {
                obj.playabilityStatus.status = "OK";
                delete obj.playabilityStatus.messages;
                delete obj.playabilityStatus.adSafetyReason;
                delete obj.playabilityStatus.reason;
                delete obj.playabilityStatus.errorScreen;
                delete obj.playabilityStatus.backgroundPlayer;
                if (obj.playabilityStatus.playabilityInAdBreak) {
                    delete obj.playabilityStatus.playabilityInAdBreak;
                }
            }

            if (obj.playerOverlay) {
                delete obj.playerOverlay.adSlotRenderer;
                delete obj.playerOverlay.playerOverlayAdBadgeRenderer;
                if (obj.playerOverlay.playerOverlayVideoDetailsRenderer) {
                    delete obj.playerOverlay.playerOverlayVideoDetailsRenderer.adBadge;
                    delete obj.playerOverlay.playerOverlayVideoDetailsRenderer.promotedContent;
                }
                if (obj.playerOverlay.endScreenDecoratorRenderer) {
                    delete obj.playerOverlay.endScreenDecoratorRenderer.adBadge;
                }
                delete obj.playerOverlay.adBreakTimelineData;
                delete obj.playerOverlay.adMarkerRenderer;
            }

            delete obj.promotedSparklesWeb;
            delete obj.promotedSparklesWebRenderer;
            delete obj.adPromotedContent;
            delete obj.merchandise;

            if (obj.cards && obj.cards.cardCollectionRenderer) {
                let cards = obj.cards.cardCollectionRenderer.cards;
                if (cards) {
                    obj.cards.cardCollectionRenderer.cards = cards.filter(c =>
                        !c || !c.promotedSparklesWebRenderer
                    );
                }
            }

            if (obj.playbackTracking) {
                delete obj.playbackTracking.pageadViewthroughconversion;
                delete obj.playbackTracking.videostatsPlaybackUrl;
                if (obj.playbackTracking.videostatsDelayplayUrl) {
                    delete obj.playbackTracking.videostatsDelayplayUrl;
                }
            }
        }

        function stripEngagementPanels(panels) {
            if (!Array.isArray(panels)) return panels;
            return panels.filter(panel => {
                if (!panel || !panel.panelIdentifier) return true;
                let pid = panel.panelIdentifier;
                return pid.indexOf("engagement-panel-ads") === -1 &&
                       pid !== "engagement-panel-closetory" &&
                       pid.indexOf("engagement-panel-promoted") === -1;
            });
        }

        function stripFrameworkAds(frameworkUpdates) {
            if (!frameworkUpdates || !frameworkUpdates.entityBatchUpdate) return;
            let batch = frameworkUpdates.entityBatchUpdate;
            if (!batch.mutations) return;
            batch.mutations = batch.mutations.filter(mutation => {
                if (!mutation.payload) return true;
                return !mutation.payload.adSlotEntity &&
                       !mutation.payload.adBreakEntity &&
                       !mutation.payload.adEntityRenderer &&
                       !mutation.payload.adCta &&
                       !mutation.payload.adCtaEntity &&
                       !mutation.payload.promotedContentEntity &&
                       !mutation.payload.adPromotedContentEntity;
            });
        }

        function stripItemAds(items) {
            if (!Array.isArray(items)) return;
            for (let i = items.length - 1; i >= 0; i--) {
                let item = items[i];
                if (!item) continue;

                if (item.adSlotRenderer || item.displayAdRenderer ||
                    item.promotedSparklesWebRenderer || item.searchPyvRenderer ||
                    item.promotedVideoRenderer || item.carouselAdRenderer ||
                    item.inFeedVideoAdRenderer || item.adSlotRenderer ||
                    item.videoDisplayCarouselRenderer ||
                    item.mastheadVideoBannerRenderer ||
                    item.compactPromotedVideoRenderer) {
                    items.splice(i, 1);
                    continue;
                }

                if (item.richItemRenderer && item.richItemRenderer.content) {
                    let c = item.richItemRenderer.content;
                    if (c.adSlotRenderer || c.promotedSparklesWebRenderer ||
                        c.displayAdRenderer || c.searchPyvRenderer ||
                        c.inFeedVideoAdRenderer) {
                        items.splice(i, 1);
                        continue;
                    }
                }

                if (item.videoRenderer && (item.videoRenderer.adBadge ||
                    item.videoRenderer.promotedContent ||
                    item.videoRenderer.sponsoredContent)) {
                    items.splice(i, 1);
                    continue;
                }

                if (item.gridVideoRenderer && (item.gridVideoRenderer.adBadge ||
                    item.gridVideoRenderer.promotedContent)) {
                    items.splice(i, 1);
                    continue;
                }

                if (item.compactVideoRenderer && (item.compactVideoRenderer.adBadge ||
                    item.compactVideoRenderer.promotedContent)) {
                    items.splice(i, 1);
                    continue;
                }

                if (item.shelfRenderer && item.shelfRenderer.content &&
                    item.shelfRenderer.content.horizontalListRenderer) {
                    stripItemAds(item.shelfRenderer.content.horizontalListRenderer.items);
                }

                if (item.reelShelfRenderer && item.reelShelfRenderer.items) {
                    let hadAds = false;
                    item.reelShelfRenderer.items = item.reelShelfRenderer.items.filter(ri => {
                        if (ri && (ri.adSlotRenderer || ri.promotedSparklesWebRenderer)) {
                            hadAds = true;
                            return false;
                        }
                        return true;
                    });
                }
            }
        }

        function stripBrowseAds(obj) {
            if (!obj || typeof obj !== "object") return;

            delete obj.masthead;
            delete obj.mastheadVideoBannerRenderer;
            delete obj.topbarDesktopRenderer;

            if (obj.contents) stripContentAds(obj.contents);
            if (obj.continuationContents) stripContentAds(obj.continuationContents);

            if (obj.onResponseReceivedActions) {
                for (let action of obj.onResponseReceivedActions) {
                    if (action.appendContinuationItemsAction &&
                        action.appendContinuationItemsAction.continuationItems) {
                        stripItemAds(action.appendContinuationItemsAction.continuationItems);
                    }
                    if (action.replaceContinuationItemsAction &&
                        action.replaceContinuationItemsAction.items) {
                        stripItemAds(action.replaceContinuationItemsAction.items);
                    }
                    if (action.reloadContinuationItemsCommand &&
                        action.reloadContinuationItemsCommand.continuationItems) {
                        stripItemAds(action.reloadContinuationItemsCommand.continuationItems);
                    }
                }
            }
        }

        function stripContentAds(contents) {
            if (!contents || typeof contents !== "object") return;
            if (Array.isArray(contents)) {
                stripItemAds(contents);
                return;
            }
            for (let key of Object.keys(contents)) {
                let val = contents[key];
                if (!val) continue;
                if (Array.isArray(val)) {
                    stripItemAds(val);
                } else if (typeof val === "object") {
                    if (val.items) stripItemAds(val.items);
                    else if (val.contents) stripContentAds(val.contents);
                }
            }
        }

        function stripReelAds(obj) {
            if (!obj || !obj.entries) return;
            obj.entries = obj.entries.filter(entry => {
                if (!entry.command || !entry.command.reelWatchEndpoint) return true;
                let ep = entry.command.reelWatchEndpoint;
                if (ep.adClientParams && ep.adClientParams.isAd) return false;
                if (ep.adBreakData) return false;
                if (ep.adLayout) return false;
                return true;
            });
        }

        stripPlayerAds(body);
        if (body.playerResponse) stripPlayerAds(body.playerResponse);

        if (body.engagementPanels) body.engagementPanels = stripEngagementPanels(body.engagementPanels);
        if (body.playerResponse && body.playerResponse.engagementPanels) {
            body.playerResponse.engagementPanels = stripEngagementPanels(body.playerResponse.engagementPanels);
        }

        if (body.frameworkUpdates) stripFrameworkAds(body.frameworkUpdates);
        if (body.playerResponse && body.playerResponse.frameworkUpdates) {
            stripFrameworkAds(body.playerResponse.frameworkUpdates);
        }

        stripBrowseAds(body);
        if (body.playerResponse) stripBrowseAds(body.playerResponse);

        if (body.reelWatchSequenceResponse) stripReelAds(body.reelWatchSequenceResponse);

        if (body.adSafetyReason) delete body.adSafetyReason;
        if (body.adPlacements) body.adPlacements = [];

        $done({ body: JSON.stringify(body) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
