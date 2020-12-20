import { dispatch } from './container';
const serverConfig = require('../config/server');
const SimpleCrypto = require("simple-crypto-js").default, simpleCrypto = new SimpleCrypto(serverConfig.secretKey);

const state = {
    designs: [],
    users: []
}

export function getState() {
    return state;
}

export function reduce(action) {
    switch (action.type) {
        case 'setStateFromDB': {
            const { designs, users } = action;
            Object.assign(state, { designs, users });
            return state;
        }
        case 'addNewDesignFromAdmin': {
            const { design_no, design_name, colors, design_images } = action;
            const new_design = { design_no, design_name, colors, design_images };
            state.designs.push(new_design);
            return state;
        }
        case 'deleteDesignFromAdmin': {
            const { design_no } = action;
            const newDesigns = state.designs.filter((d) => d.design_no != design_no);
            state.designs = newDesigns;
            return state;
        }
        case 'signUpFromAdmin': {
            const { email_id, password } = action;
            const newUser = { email_id, password: simpleCrypto.encrypt(password) };
            state.users.push(newUser);
            return state;
        }
        case 'editDesignFromAdmin': {
            const { design_no, design_name, colors } = action;
            const design = state.designs.find((d) => d.design_no == design_no);
            design.design_name = design_name;
            design.colors = colors;
            return state;
        }
        default:
        // console.log(`reduce() ignoring action ${action.type})`);
    }
}