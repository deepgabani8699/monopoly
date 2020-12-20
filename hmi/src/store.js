import serverConfig from './config/server.json';
const SimpleCrypto = require("simple-crypto-js").default, simpleCrypto = new SimpleCrypto(serverConfig.secretKey);

const state = {
    designs: [],
    users: [],
    isLoginDataValid: false,
    serverConnection: 'offline',
}

export function getState() {
    return state;
}

export function getsLoginDataValidFlag() {
    return state.isLoginDataValid;
}

export function reduce(action: Action) {
    switch (action.type) {
        case 'changeServerConnection': {
            const { connection } = action;
            state.serverConnection = connection;
            return state;
        }
        case 'setStateFromServer': {
            const { designs, users } = action;
            Object.assign(state, { designs, users });
            return state;
        }
        case 'loginFromForm': {
            const { email_id, password } = action;
            const user = state.users.find((u) => u.email_id == email_id);
            if (password == simpleCrypto.decrypt(user.password))
                state.isLoginDataValid = true;
            return state;
        }
        case 'logoutFromForm': {
            state.isLoginDataValid = false;
            return state;
        }
        default:
            console.log(`Nothing to reduce from store`);
    }
}