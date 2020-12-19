'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _container = require('./container');

var _io = require('./io');

var _io2 = _interopRequireDefault(_io);

var _store = require('./store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var namespace = void 0;

function getNamespace() {
    if (namespace != null) {
        return namespace;
    }
    throw new Error('Attempt to use /hmis namespace before IO started');
}

function to() {
    return getNamespace();
}

_io2.default.started.then(function (socketIO) {
    namespace = socketIO.of('/hmi');
    namespace.on('connect', function (socket) {
        var id = socket.client.id;
        console.log('"hmi" connection from ' + id);
        socket.emit('setState', (0, _store.getState)());

        socket.on('reconnect', function (arg) {
            console.log('  hmi ' + id + ' reconnected');
            socket.emit('setState', (0, _store.getState)());
        });

        socket.on('disconnect', function (why) {
            console.log('  hmi ' + id + ' disconnected because ' + why);
        });
    });
});

exports.default = {
    to: to
};