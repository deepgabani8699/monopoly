import { dispatch } from './container';
import io from './io';
import { getState } from './store';

let namespace;

function getNamespace() {
    if (namespace != null) {
      return namespace;
    }
    throw new Error('Attempt to use /hmis namespace before IO started');
}

function to() {
    return getNamespace();
}

io.started.then((socketIO) => {
    namespace = socketIO.of('/hmi');
    namespace.on('connect', (socket) => {
        const id = socket.client.id;
        console.log(`"hmi" connection from ${id}`);
        socket.emit('setState', getState());
    
        socket.on('reconnect', (arg) => {
            console.log(`  hmi ${id} reconnected`);
            socket.emit('setState', getState());
        });
    
        socket.on('disconnect', (why) => {
            console.log(`  hmi ${id} disconnected because ${why}`);
        });

    });
});

export default {
  to,
};