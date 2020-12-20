'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getState = getState;
exports.reduce = reduce;

var _container = require('./container');

var serverConfig = require('../config/server');
var SimpleCrypto = require("simple-crypto-js").default,
    simpleCrypto = new SimpleCrypto(serverConfig.secretKey);

var state = {
    designs: [],
    users: []
};

function getState() {
    return state;
}

function reduce(action) {
    switch (action.type) {
        case 'setStateFromDB':
            {
                var designs = action.designs,
                    users = action.users;

                Object.assign(state, { designs: designs, users: users });
                return state;
            }
        case 'addNewDesignFromAdmin':
            {
                var design_no = action.design_no,
                    design_name = action.design_name,
                    colors = action.colors,
                    design_images = action.design_images;

                var new_design = { design_no: design_no, design_name: design_name, colors: colors, design_images: design_images };
                state.designs.push(new_design);
                return state;
            }
        case 'deleteDesignFromAdmin':
            {
                var _design_no = action.design_no;

                var newDesigns = state.designs.filter(function (d) {
                    return d.design_no != _design_no;
                });
                state.designs = newDesigns;
                return state;
            }
        case 'signUpFromAdmin':
            {
                var email_id = action.email_id,
                    password = action.password;

                var newUser = { email_id: email_id, password: simpleCrypto.encrypt(password) };
                state.users.push(newUser);
                return state;
            }
        case 'editDesignFromAdmin':
            {
                var _design_no2 = action.design_no,
                    _design_name = action.design_name,
                    _colors = action.colors;

                var design = state.designs.find(function (d) {
                    return d.design_no == _design_no2;
                });
                design.design_name = _design_name;
                design.colors = _colors;
                return state;
            }
        default:
        // console.log(`reduce() ignoring action ${action.type})`);
    }
}