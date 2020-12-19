'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = require('../config/server');
var io = void 0;

var startedResolver = {
    resolve: null,
    reject: null
};

var started = new Promise(function (resolve, reject) {
    Object.assign(startedResolver, { resolve: resolve, reject: reject });
});

function start() {
    if (io != null) {
        return;
    }

    console.log('Binding socket.io to port ' + server.socketioPort);

    io = (0, _socket2.default)(server.socketioPort);
    var resolve = startedResolver.resolve;
    if (resolve == null) {
        throw new Error('Unable to start IO!');
    }
    resolve(io);
}

var api = {
    start: start,
    started: started
};

exports.default = api;