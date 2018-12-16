const dgram = require('dgram');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const api = require('./api');
const constants = require('./constants');
const binutils = require('binutils');

const PORT = 9000;
const LOCAL_PORT = 9001;
const HOST = '192.168.178.24';
// const HOST = '127.0.0.1';
const DISPLAY_NAME = 'your';
const CONNECTION_PASSWORD = 'asd';
const COMMAND_PASSWORD = '';
const onClientConnectedCallback = (callback) => {
    console.log(`I'm connected to ACC!`, callback);
}

let browserSocket;

const acc = dgram.createSocket('udp4');
acc.bind(LOCAL_PORT);

acc.on('message', message => {
    // console.log(`raw message: ${message}`);
    const reader = new binutils.BinaryReader(message, 'little');
    
    const messageType = reader.ReadUInt8();
    switch(messageType) {
        case constants.InboundMessageTypes.REGISTRATION_RESULT: {
            console.log('REGISTRATION_RESULT');
            const connectionId = reader.ReadInt32();
            const connectionSuccess = reader.ReadBytes(1).readUInt8(0) > 0;
            const isReadonly = reader.ReadBytes(1).readUInt8(0) === 0;
            const errMsg = api.readString(reader);

            console.log({connectionId, connectionSuccess, isReadonly, errMsg});

            break;
        }
        case constants.InboundMessageTypes.REALTIME_UPDATE: {
            // console.log('REALTIME_UPDATE');
            break;
        }
        case constants.InboundMessageTypes.REALTIME_CAR_UPDATE: {
            console.log('REALTIME_CAR_UPDATE');
            const carIndex = reader.ReadUInt16();
            const driverIndex = reader.ReadUInt16();
            const gear = reader.ReadBytes(1).readUInt8(0) - 1;
            const worldPosX = reader.ReadFloat();
            const worldPosY = reader.ReadFloat();
            const yaw = reader.ReadFloat();
            const carLocation = reader.ReadBytes(1).readUInt8(0);
            const kmh = reader.ReadUInt16();
            const position = reader.ReadUInt16();
            const cupPosition = reader.ReadUInt16();
            const trackPosition = reader.ReadUInt16();
            const splinePosition = reader.ReadFloat();
            const laps = reader.ReadUInt16();
            const delta = reader.ReadUInt32();

            //TODO read laps
            // carUpdate.BestSessionLap = ReadLap(br);
            // carUpdate.LastLap = ReadLap(br);
            // carUpdate.CurrentLap = ReadLap(br);

            console.log({carIndex, driverIndex, gear, kmh, laps, delta});

            if (browserSocket) browserSocket.emit('carstate', {gear, kmh, delta});

            break;
        }
        default: {
            // console.log('response message type not recognized', messageType);
        }
    }
});

acc.on('listening', () => {
    const address = acc.address();
    console.log(`server listening ${address.address}:${address.port}`);
});


function handleError(err) {
    if (err) {
        console.log('ERROR');
        console.log(err);
    }
}

const requestConnection = api.requestConnection(DISPLAY_NAME, CONNECTION_PASSWORD, COMMAND_PASSWORD);
acc.send(requestConnection, 0, requestConnection.length, PORT, HOST, handleError);

io.on('connection', socket => {
    console.log('Connected from browser...');
    socket.on('command', command => {
        console.log('command Sent from browser');
        console.log(command);
        //TODO here to send messages to ACC
    });

    browserSocket = socket;

    socket.emit('status', 'CONNECTED');
});

http.listen(6767, () => {
    console.log('Socket io server up and running');
});