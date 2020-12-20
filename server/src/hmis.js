import { dispatch } from './container';
import io from './io';
import { getState } from './store';
import { Binary } from 'mongodb';

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

        socket.on('addNewDesign', ({ design_no, design_name, colors, design_images }) => {
            dispatch({ type: 'addNewDesignFromAdmin', design_no, design_name, colors, design_images });
        });

        socket.on('deleteDesign', ({ design_no }) => {
            dispatch({ type: 'deleteDesignFromAdmin', design_no });
        });

        socket.on('signUp', ({ email_id, password }) => {
            dispatch({ type: 'signUpFromAdmin', email_id, password });
        });

        socket.on('editDesign', ({ design_no, design_name, colors }) => {
            dispatch({ type: 'editDesignFromAdmin', design_no, design_name, colors });
        });

    });
});

export default {
    to,
};