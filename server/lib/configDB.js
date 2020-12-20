'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongodb = require('mongodb');

var _store = require('./store');

var _container = require('./container');

var _util = require('util');

var serverConfig = require('../config/server');
var DB_NAME = 'monopoly';
var DB_URL = 'mongodb://' + serverConfig.configDBAddress + ':' + serverConfig.configDBPort;
var SimpleCrypto = require("simple-crypto-js").default,
    simpleCrypto = new SimpleCrypto(serverConfig.secretKey);

var db = void 0;
var designsTable = void 0;
var usersTable = void 0;

function dispatchSideEffects(action) {
    switch (action.type) {
        case 'addNewDesignFromAdmin':
            {
                var design_no = action.design_no,
                    design_name = action.design_name,
                    colors = action.colors,
                    design_images = action.design_images;

                add_row(designsTable, { design_no: design_no, design_name: design_name, colors: colors, design_images: design_images }, 'design');
                return;
            }
        case 'deleteDesignFromAdmin':
            {
                var _design_no = action.design_no;

                delete_row(designsTable, { design_no: _design_no }, 'design');
                return;
            }
        case 'signUpFromAdmin':
            {
                var email_id = action.email_id,
                    password = action.password;

                var newUser = { email_id: email_id, password: simpleCrypto.encrypt(password) };
                add_row(usersTable, { email_id: email_id, password: simpleCrypto.encrypt(password) }, 'user');
                return;
            }
        case 'editDesignFromAdmin':
            {
                var _design_no2 = action.design_no,
                    _design_name = action.design_name,
                    _colors = action.colors;

                update_row(designsTable, { design_no: _design_no2 }, { design_name: _design_name, colors: _colors }, 'design');
                return;
            }
        default:
        // console.log(`No side effect from configDB for ${action.type}`);
    }
}

function add_row(table, row, entry_type) {
    row.updated_at = new Date();
    table.insertOne(row, function (err, result) {
        if (err != null) {
            console.error('Failed to insert ' + entry_type + ': ' + err);
            throw new Error(err);
        }
        console.log('Created ' + entry_type + ': ' + (0, _util.inspect)(row));
    });
}

function update_row(table, query, state, entry_type) {
    state.updated_at = new Date();
    table.updateOne(query, { $set: state }, function (err, result) {
        if (err != null) {
            throw new Error('Failed to update ' + query + ': ' + err);
        }
        console.log('Successfully updated row for ' + entry_type + ' ' + query);
    });
}

function delete_row(table, query, entry_type) {
    table.deleteOne(query, function (err, result) {
        if (err != null) {
            throw new Error('Failed to remove ' + entry_type + ': ' + err);
        }
        console.log('Successfully removed ' + entry_type + ' ' + query);
    });
}

function load() {
    _mongodb.MongoClient.connect(DB_URL, function (err, client) {
        if (err != null) {
            throw new Error('Couldn\'t connect to config DB: ' + err);
        }
        console.log('Connected to config DB');

        db = client.db(DB_NAME);
        designsTable = db.collection('designs');
        usersTable = db.collection('users');

        designsTable.find({}).toArray(function (err, designRows) {
            if (err != null) {
                throw new Error('Failed to scan "devices" rows: ' + err);
            }
            usersTable.find({}).toArray(function (err, userRows) {
                if (err != null) {
                    throw new Error('Failed to scan "users" rows: ' + err);
                }
                setState(designRows, userRows);
            });
        });
    });
}

function dbRowsToState(designRows, userRows) {
    var designs = designRows.map(function (_ref) {
        var design_no = _ref.design_no,
            design_name = _ref.design_name,
            colors = _ref.colors,
            design_images = _ref.design_images;
        return {
            design_no: design_no, design_name: design_name, colors: colors, design_images: design_images
        };
    });
    var users = userRows.map(function (_ref2) {
        var email_id = _ref2.email_id,
            password = _ref2.password;
        return {
            email_id: email_id, password: password
        };
    });

    return { designs: designs, users: users };
}

function setState(designRows, userRows) {
    var _dbRowsToState = dbRowsToState(designRows, userRows),
        designs = _dbRowsToState.designs,
        users = _dbRowsToState.users;

    (0, _container.dispatch)({ type: 'setStateFromDB', designs: designs, users: users });
}

var api = {
    load: load,
    dispatchSideEffects: dispatchSideEffects
};

exports.default = api;