import { MongoClient } from 'mongodb';

const DB_NAME = 'monopoly';
const DB_URL = `mongodb://localhost:27017`;

let db;
let designsTable;

const state = {
    designs: [],
    serverConnection: 'offline',
}

export function getState() {
    return state;
}

export function reduce(action: Action) {
    switch (action.type) {
        case 'changeServerConnection': {
            const { connection } = action;
            state.serverConnection = connection;
            return state;
        }
        case 'setStateFromServer': {
            const { designs } = action;
            Object.assign(state, { designs });
            console.log("-------- set new designs successfully!");
            return state;
        }
        default:
            console.log(`Nothing to reduce from store`);
    }
}