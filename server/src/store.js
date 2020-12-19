import { dispatch } from './container';

const state = {
    designs: [],
}

export function getState() {
    return state;
}

export function reduce(action) {
    switch (action.type) {
        case 'setStateFromDB': {
            const { designs } = action;
            Object.assign(state, { designs });
            return state;
        }
        default:
            console.log(`reduce() ignoring action ${action.type})`);
    }
}