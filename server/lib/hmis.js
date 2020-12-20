'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _container = require('./container');

var _io = require('./io');

var _io2 = _interopRequireDefault(_io);

var _store = require('./store');

var _mongodb = require('mongodb');

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

        socket.on('addNewDesign', function (_ref) {
            var design_no = _ref.design_no,
                design_name = _ref.design_name,
                colors = _ref.colors,
                design_images = _ref.design_images;

            (0, _container.dispatch)({ type: 'addNewDesignFromAdmin', design_no: design_no, design_name: design_name, colors: colors, design_images: design_images });
        });

        socket.on('deleteDesign', function (_ref2) {
            var design_no = _ref2.design_no;

            (0, _container.dispatch)({ type: 'deleteDesignFromAdmin', design_no: design_no });
        });

        socket.on('signUp', function (_ref3) {
            var email_id = _ref3.email_id,
                password = _ref3.password;

            (0, _container.dispatch)({ type: 'signUpFromAdmin', email_id: email_id, password: password });
        });

        socket.on('editDesign', function (_ref4) {
            var design_no = _ref4.design_no,
                design_name = _ref4.design_name,
                colors = _ref4.colors;

            (0, _container.dispatch)({ type: 'editDesignFromAdmin', design_no: design_no, design_name: design_name, colors: colors });
        });
    });
});

exports.default = {
    to: to
};