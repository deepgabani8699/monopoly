'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongodb = require('mongodb');

var _store = require('./store');

var _container = require('./container');

var serverConfig = require('../config/server');
var DB_NAME = 'monopoly';
var DB_URL = 'mongodb://' + serverConfig.configDBAddress + ':' + serverConfig.configDBPort;

var db = void 0;
var designsTable = void 0;

function dispatchSideEffects(action) {
    switch (action.type) {
        default:
            console.log('No side effect from configDB for ' + action.type);
    }
}

function load() {
    _mongodb.MongoClient.connect(DB_URL, function (err, client) {
        if (err != null) {
            throw new Error('Couldn\'t connect to config DB: ' + err);
        }
        console.log('Connected to config DB');

        db = client.db(DB_NAME);
        designsTable = db.collection('designs');

        designsTable.find({}).toArray(function (err, designRows) {
            if (err != null) {
                throw new Error('Failed to scan "devices" rows: ' + err);
            }
            (0, _container.dispatch)({ type: 'setStateFromDB', designs: designRows });
        });
    });
}

var api = {
    load: load,
    dispatchSideEffects: dispatchSideEffects
};

exports.default = api;