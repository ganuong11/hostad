if ($response.body) {
    try {
        let body = JSON.parse($response.body);

        if (body.adPlacements) {
            body.adPlacements = body.adPlacements.filter(placement =>
                !placement.renderer ||
                (placement.renderer.adSlotRenderer === undefined &&
                 placement.renderer.adBreakRenderer === undefined)
            );
            if (body.adPlacements.length === 0) {
                body.adPlacements = [];
            }
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
        if (body.playerResponse) {
            if (body.playerResponse.adPlacements) {
                body.playerResponse.adPlacements = body.playerResponse.adPlacements.filter(placement =>
                    !placement.renderer ||
                    (placement.renderer.adSlotRenderer === undefined &&
                     placement.renderer.adBreakRenderer === undefined)
                );
                if (body.playerResponse.adPlacements.length === 0) {
                    body.playerResponse.adPlacements = [];
                }
            }
            if (body.playerResponse.playerAds) {
                body.playerResponse.playerAds = [];
            }
            if (body.playerResponse.adSlots) {
                body.playerResponse.adSlots = [];
            }
            if (body.playerResponse.playabilityStatus) {
                body.playerResponse.playabilityStatus.status = "OK";
                if (body.playerResponse.playabilityStatus.messages) {
                    delete body.playerResponse.playabilityStatus.messages;
                }
            }
            if (body.playerResponse.streamingData) {
                delete body.playerResponse.streamingData.adPlayback;
            }
        }
        if (body.engagementPanels) {
            body.engagementPanels = body.engagementPanels.filter(panel =>
                !panel.panelIdentifier ||
                (panel.panelIdentifier !== "engagement-panel-ads" &&
                 panel.panelIdentifier !== "engagement-panel-closetory")
            );
        }
        if (body.reelWatchSequenceResponse &&
            body.reelWatchSequenceResponse.entries) {
            body.reelWatchSequenceResponse.entries = body.reelWatchSequenceResponse.entries.filter(entry =>
                !entry.command ||
                !entry.command.reelWatchEndpoint ||
                !entry.command.reelWatchEndpoint.adClientParams ||
                !entry.command.reelWatchEndpoint.adClientParams.isAd
            );
        }

        $done({ body: JSON.stringify(body) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
