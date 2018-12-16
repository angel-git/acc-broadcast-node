const constants = {
    outboundMessageTypes: {
        REGISTER_COMMAND_APPLICATION: 1,
        UNREGISTER_COMMAND_APPLICATION: 9,
        REQUEST_ENTRY_LIST: 10,
        REQUEST_TRACK_DATA: 11,
        CHANGE_HUD_PAGE: 49,
        CHANGE_FOCUS: 50,
        INSTANT_REPLAY_REQUEST: 51,
        PLAY_MANUAL_REPLAY_HIGHLIGHT: 52, // TODO, but planned
        SAVE_MANUAL_REPLAY_HIGHLIGHT: 60, // TODO, but planned
    },
    broadcastingNetworkProtocol: {
        BROADCASTING_PROTOCOL_VERSION: 2,
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