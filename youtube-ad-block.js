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

        $done({ body: JSON.stringify(body) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
