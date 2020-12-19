import socketIO from 'socket.io';


const server = require('../config/server');
let io;

const startedResolver= {
    resolve: null,
    reject: null,
};

const started = new Promise((resolve, reject) => {
  Object.assign(startedResolver, { resolve, reject });
});

function start() {
    if (io != null) {
        return;
    }

    console.log(`Binding socket.io to port ${server.socketioPort}`);

    io = socketIO(server.socketioPort);
    const resolve = startedResolver.resolve;
    if (resolve == null) {
        throw new Error('Unable to start IO!');
    }
    resolve(io);
}

const api = {
  start,
  started,
};

export default api;