'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dispatch = dispatch;

var _configDB = require('./configDB');

var _configDB2 = _interopRequireDefault(_configDB);

var _hmis = require('./hmis');

var _hmis2 = _interopRequireDefault(_hmis);

var _io = require('./io');

var _io2 = _interopRequireDefault(_io);

var _store = require('./store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dispatch(action) {
    // TODO organize reducers / side effects
    (0, _store.reduce)(action);

    dispatchSideEffects(action);
    _configDB2.default.dispatchSideEffects(action);
}

function dispatchSideEffects(action) {
    switch (action.type) {
        case 'setStateFromDB':
            {
                _io2.default.start();
                _io2.default.started.then(function () {
                    return _hmis2.default.to().emit('setState', (0, _store.getState)());
                });
                return;
            }
        case 'deleteDesignFromAdmin':
        case 'signUpFromAdmin':
        case 'editDesignFromAdmin':
        case 'addNewDesignFromAdmin':
            {
                _hmis2.default.to().emit('setState', (0, _store.getState)());
                return;
            }
        default:
        // console.log(`No side effect for ${action.type}`);
    }
}

_configDB2.default.load();