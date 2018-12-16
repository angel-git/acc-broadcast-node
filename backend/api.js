const constants = require('./constants');
const binutils = require('binutils');
const utf8 = require('utf8-bytes');

const api = {

    readString: (reader) => {
        const length = reader.ReadUInt16();
        const bytes = reader.ReadBytes(length);
        return bytes.toString('utf8');
    },

    requestConnection: (displayName, connectionPassword, commandPassword) => {
        const displayNameArray = utf8(displayName);
        const connectionPasswordArray = utf8(connectionPassword);
        const commandPasswordArray = utf8(commandPassword);
        const updateInterval = 250;

        const writer = new binutils.BinaryWriter('little');
        writer.WriteBytes([constants.outboundMessageTypes.REGISTER_COMMAND_APPLICATION]);
        writer.WriteBytes([constants.broadcastingNetworkProtocol.BROADCASTING_PROTOCOL_VERSION]);
        writer.WriteUInt16(displayNameArray.length);
        writer.WriteBytes(displayNameArray);
        writer.WriteUInt16(connectionPasswordArray.length);
        writer.WriteBytes(connectionPasswordArray);
        writer.WriteUInt32(updateInterval);
        writer.WriteUInt16(commandPasswordArray.length);
        writer.WriteBytes(commandPasswordArray);

        return writer.ByteBuffer;
    },

};

module.exports = api;