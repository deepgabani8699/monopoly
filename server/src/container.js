import configDB from './configDB';
import hmis from './hmis';
import io from './io';
import { getState, reduce } from './store';

export function dispatch(action) {
    // TODO organize reducers / side effects
    reduce(action);

    dispatchSideEffects(action);
    configDB.dispatchSideEffects(action);
}

function dispatchSideEffects(action) {
    switch (action.type) {
        case 'setStateFromDB': {
            io.start();
            io.started.then(() => hmis.to().emit('setState', getState()));
            return;
        }
        case 'deleteDesignFromAdmin':
        case 'signUpFromAdmin':
        case 'editDesignFromAdmin':
        case 'addNewDesignFromAdmin': {
            hmis.to().emit('setState', getState());
            return;
        }
        default:
        // console.log(`No side effect for ${action.type}`);
    }
}

configDB.load();