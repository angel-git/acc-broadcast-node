const dgram = require('dgram');
const wait = require('waait');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const throttle = require('lodash/throttle');
// const commandDelays = require('./commandDelays');
const sender = require('./sender');
const constants = require('./constants');

const PORT = 9000;
const LOCAL_PORT = 9001;
const HOST = '192.168.178.24';
// const HOST = '127.0.0.1';
const DISPLAY_NAME = 'your name';
const CONNECTION_PASSWORD = 'asd';
const COMMAND_PASSWORD = '';
const onClientConnectedCallback = (callback) => {
    console.log(`I'm connected to ACC!`, callback);
}

const drone = dgram.createSocket('udp4');
drone.bind(LOCAL_PORT);

drone.on('message', message => {
    console.log(`🤖 : ${message}`);

    console.log(message.toString())
    const messageType = message.readUInt8();
    switch(messageType) {
        case constants.InboundMessageTypes.REGISTRATION_RESULT: {
            console.log('REGISTRATION_RESULT');
            const connectionId = message.readInt32LE();
            const connectionSuccess = message.readInt8() > 0;
            const isReadonly = message.readInt8() === 0;
            const errMsg = sender.readString(message);
            console.log({connectionId, connectionSuccess, isReadonly, errMsg});

            // OnConnectionStateChanged?.Invoke(ConnectionId, connectionSuccess, isReadonly, errMsg);

            // In case this was successful, we will request the initial data
            // RequestEntryList();
            // RequestTrackData();

            break;
        }
        default: {
            console.log('response message type not recognized', messageType);
        }
    }
    //   io.sockets.emit('status', message.toString());
});

drone.on('listening', () => {
    const address = drone.address();
    console.log(`server listening ${address.address}:${address.port}`);
});


// drone.bind(PORT);

// function parseState(state) {
//   return state
//     .split(';')
//     .map(x => x.split(':'))
//     .reduce((data, [key, value]) => {
//       data[key] = value;
//       return data;
//     }, {});
// }

// const droneState = dgram.createSocket('udp4');
// droneState.bind(8890);



function handleError(err) {
    if (err) {
        console.log('ERROR');
        console.log(err);
    }
}

const requestConnection = sender.requestConnection(DISPLAY_NAME, CONNECTION_PASSWORD, COMMAND_PASSWORD);
drone.send(requestConnection, 0, requestConnection.length, PORT, HOST, handleError);

io.on('connection', socket => {
    console.log('Connected from browser...');
    socket.on('command', command => {
        console.log('command Sent from browser');
        console.log(command);
        // drone.send(command, 0, command.length, PORT, HOST, handleError);
    });

    setInterval(() => socket.emit('carstate', fakeState()), 100);

    socket.emit('status', 'CONNECTED');
});

fakeState = () => {
    return {
        speed: {
            max: 200,
            min: 0,
            actual: Math.random() * 200,
        },
        rpm: {
            max: 9000,
            min: 0,
            actual: Math.random() * 9000,
        },
        date: new Date(),
    }
}

// droneState.on(
//   'message',
//   throttle(state => {
//       console.log('state!', state);
//     // const formattedState = parseState(state.toString());
//     // io.sockets.emit('dronestate', formattedState);
//   }, 100)
// );

http.listen(6767, () => {
    console.log('Socket io server up and running');
});