const constants = require('./constants');

const sender = {

    readString: (message) => {
        const length = message.readUInt16LE();
        return message.readInt16LE(length);
    },

    requestConnection: (displayName, connectionPassword, commandPassword) => {
        const displayNameArray = toUTF8Array(displayName);
        const connectionPasswordArray = toUTF8Array(connectionPassword);
        const commandPasswordArray = toUTF8Array(commandPassword);
        const updateInterval = 250;

        //1 byte + 1 + displayNameArray + connectionPasswordArray + 1 + commandPasswordArray
        // const arrayLength = 1 + 1 + displayNameArray.length + connectionPasswordArray.length + 1 + commandPasswordArray.length;
        // console.log('arrayLength', arrayLength);
        // const bufArr = new ArrayBuffer(arrayLength);
        // const buffer = new Uint8Array(bufArr);
        const buffer2 = new Uint16Array([
            ...new Uint16Array([constants.outboundMessageTypes.registerCommandApplication]),
            ...new Uint16Array([constants.broadcastingNetworkProtocol.protocolVersion]),
            ...new Uint16Array(displayNameArray.length),
            ...new Uint16Array(displayNameArray),
            ...new Uint16Array(connectionPasswordArray),
            ...new Uint16Array(connectionPasswordArray.length),
            ...new Uint16Array([updateInterval]),
            ...new Uint16Array(commandPasswordArray.length),
            ...new Uint16Array(commandPasswordArray),
        ]);

        // buffer[0] = constants.outboundMessageTypes.registerCommandApplication;
        // buffer[1] = constants.broadcastingNetworkProtocol.protocolVersion;
        // for (let i = 2; i < displayNameArray.length; ++i) {
        //     buffer[i] = displayNameArray[i];
        // }
        // for (let i = displayNameArray.length + 2; i < connectionPasswordArray.length; ++i) {
        //     buffer[i] = connectionPasswordArray[i];
        // }
        // buffer[4] = 250;
        // buffer[5] = commandPasswordArray;
        return new Uint8Array(buffer2.buffer);
    },

};

/**
 * converts string to utf8 bytes
 */
function toUTF8Array(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            charcode = ((charcode&0x3ff)<<10)|(str.charCodeAt(i)&0x3ff)
            utf8.push(0xf0 | (charcode >>18), 
                      0x80 | ((charcode>>12) & 0x3f), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}

function uint16 (n) {
    return n & 0xFFFF;
  }

module.exports = sender;