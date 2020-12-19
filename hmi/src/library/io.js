import socketio from 'socket.io-client';

import { dispatch } from '../AppContainer';

const server = require('../config/server');

console.log('Using config', server);

// TODO: https
const serverUrl = `${server.socketioAddress}:${server.socketioPort}/hmi`

console.log(`Connecting to server ${serverUrl} using socketio protocol ${socketio.protocol}`);

const io = socketio(serverUrl);
io.on('connect', () => {
  dispatch({ type: 'changeServerConnection', connection: 'online' })
});

io.on('reconnect', (attempts) => {
  console.log(`Reconnected IO after ${attempts} attempts`);
  dispatch({ type: 'changeServerConnection', connection: 'online' })
});

io.on('disconnect', (why) => {
  dispatch({ type: 'changeServerConnection', connection: 'offline' })
});

export default io;