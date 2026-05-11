if ($response.body) {
    try {
        if ($request && $request.url) {
            let url = $request.url;
            if (url.indexOf("/player/ad_break") !== -1 ||
                url.indexOf("/player/heartbeat") !== -1) {
                $done({ body: "" });
                return;
            }
        }

        let body = JSON.parse($response.body);

        function stripAdFields(obj) {
            if (!obj || typeof obj !== "object") return;
            if (obj.adPlacements) {
                obj.adPlacements = obj.adPlacements.filter(placement =>
                    !placement.renderer ||
                    (placement.renderer.adSlotRenderer === undefined &&
                     placement.renderer.adBreakRenderer === undefined)
                );
                if (obj.adPlacements.length === 0) {
                    obj.adPlacements = [];
                }
            }
            if (obj.playerAds !== undefined) {
                obj.playerAds = [];
            }
            if (obj.adSlots !== undefined) {
                obj.adSlots = [];
            }
            if (obj.streamingData && obj.streamingData.adPlayback) {
                delete obj.streamingData.adPlayback;
            }
            if (obj.playabilityStatus) {
                obj.playabilityStatus.status = "OK";
                if (obj.playabilityStatus.messages) {
                    delete obj.playabilityStatus.messages;
                }
                if (obj.playabilityStatus.adSafetyReason) {
                    delete obj.playabilityStatus.adSafetyReason;
                }
            }
        }

        stripAdFields(body);
        if (body.playerResponse) {
            stripAdFields(body.playerResponse);
        }

        if (body.engagementPanels) {
            body.engagementPanels = body.engagementPanels.filter(panel => {
                if (!panel || !panel.panelIdentifier) return true;
                let pid = panel.panelIdentifier;
                return pid.indexOf("engagement-panel-ads") === -1 &&
                       pid !== "engagement-panel-closetory";
            });
        }
        if (body.playerResponse && body.playerResponse.engagementPanels) {
            body.playerResponse.engagementPanels = body.playerResponse.engagementPanels.filter(panel => {
                if (!panel || !panel.panelIdentifier) return true;
                let pid = panel.panelIdentifier;
                return pid.indexOf("engagement-panel-ads") === -1 &&
                       pid !== "engagement-panel-closetory";
            });
        }

        if (body.frameworkUpdates &&
            body.frameworkUpdates.entityBatchUpdate &&
            body.frameworkUpdates.entityBatchUpdate.mutations) {
            body.frameworkUpdates.entityBatchUpdate.mutations =
                body.frameworkUpdates.entityBatchUpdate.mutations.filter(mutation => {
                    return !(mutation.payload &&
                             (mutation.payload.adSlotEntity ||
                              mutation.payload.adBreakEntity ||
                              mutation.payload.adEntityRenderer));
                });
        }

        if (body.playerResponse && body.playerResponse.frameworkUpdates &&
            body.playerResponse.frameworkUpdates.entityBatchUpdate &&
            body.playerResponse.frameworkUpdates.entityBatchUpdate.mutations) {
            body.playerResponse.frameworkUpdates.entityBatchUpdate.mutations =
                body.playerResponse.frameworkUpdates.entityBatchUpdate.mutations.filter(mutation => {
                    return !(mutation.payload &&
                             (mutation.payload.adSlotEntity ||
                              mutation.payload.adBreakEntity ||
                              mutation.payload.adEntityRenderer));
                });
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

        if (body.adSafetyReason) {
            delete body.adSafetyReason;
        }

        $done({ body: JSON.stringify(body) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
