if ($response.body) {
    try {
        let body = JSON.parse($response.body);

        if (body.adPlacements) {
            body.adPlacements = [];
        }
        if (body.playerAds) {
            body.playerAds = [];
        }
        if (body.adSlots) {
            body.adSlots = [];
        }
        if (body.streamingData && body.streamingData.adPlayback) {
            delete body.streamingData.adPlayback;
        }
        if (body.playabilityStatus) {
            body.playabilityStatus.status = "OK";
            if (body.playabilityStatus.messages) {
                delete body.playabilityStatus.messages;
            }
        }
        if (body.playerResponse && body.playerResponse.adPlacements) {
            body.playerResponse.adPlacements = [];
        }
        if (body.playerResponse && body.playerResponse.playerAds) {
            body.playerResponse.playerAds = [];
        }
        if (body.playerResponse && body.playerResponse.adSlots) {
            body.playerResponse.adSlots = [];
        }
        if (body.playerResponse && body.playerResponse.playabilityStatus) {
            body.playerResponse.playabilityStatus.status = "OK";
            if (body.playerResponse.playabilityStatus.messages) {
                delete body.playerResponse.playabilityStatus.messages;
            }
        }
        if (body.engagementPanels) {
            body.engagementPanels = body.engagementPanels.filter(panel =>
                !panel.panelIdentifier ||
                (panel.panelIdentifier !== "engagement-panel-ads" &&
                 panel.panelIdentifier !== "engagement-panel-closetory")
            );
        }

        $done({ body: JSON.stringify(body) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
