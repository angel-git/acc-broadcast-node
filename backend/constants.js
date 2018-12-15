const constants = {
    outboundMessageTypes: {
        registerCommandApplication: 1,
    },
    broadcastingNetworkProtocol: {
        protocolVersion: 2,
    },
    InboundMessageTypes: {
        REGISTRATION_RESULT: 1,
        REALTIME_UPDATE: 2,
        REALTIME_CAR_UPDATE :3,
        ENTRY_LIST: 4,
        ENTRY_LIST_CAR: 6,
        TRACK_DATA: 5,
    },

}
module.exports = constants;