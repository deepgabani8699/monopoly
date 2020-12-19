'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getState = getState;
exports.reduce = reduce;

var _container = require('./container');

var state = {
    designs: []
};

function getState() {
    return state;
}

function reduce(action) {
    switch (action.type) {
        case 'setStateFromDB':
            {
                var designs = action.designs;

                Object.assign(state, { designs: designs });
                return state;
            }
        default:
            console.log('reduce() ignoring action ' + action.type + ')');
    }
}