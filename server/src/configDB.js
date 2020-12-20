import { MongoClient } from 'mongodb';
import { getState } from './store';
import { dispatch } from './container';
import { inspect } from 'util';

const serverConfig = require('../config/server');
const DB_NAME = 'monopoly';
const DB_URL = `mongodb://${serverConfig.configDBAddress}:${serverConfig.configDBPort}`;
const SimpleCrypto = require("simple-crypto-js").default, simpleCrypto = new SimpleCrypto(serverConfig.secretKey);

let db;
let designsTable;
let usersTable;

function dispatchSideEffects(action) {
    switch (action.type) {
        case 'addNewDesignFromAdmin': {
            const { design_no, design_name, colors, design_images } = action;
            add_row(designsTable, { design_no, design_name, colors, design_images }, 'design');
            return;
        }
        case 'deleteDesignFromAdmin': {
            const { design_no } = action;
            delete_row(designsTable, { design_no }, 'design');
            return;
        }
        case 'signUpFromAdmin': {
            const { email_id, password } = action;
            const newUser = { email_id, password: simpleCrypto.encrypt(password) };
            add_row(usersTable, { email_id, password: simpleCrypto.encrypt(password) }, 'user');
            return;
        }
        case 'editDesignFromAdmin': {
            const { design_no, design_name, colors } = action;
            update_row(designsTable, { design_no }, { design_name, colors }, 'design');
            return;
        }
        default:
        // console.log(`No side effect from configDB for ${action.type}`);
    }
}

function add_row(table, row, entry_type) {
    row.updated_at = new Date();
    table.insertOne(row, (err, result) => {
        if (err != null) {
            console.error(`Failed to insert ${entry_type}: ${err}`);
            throw new Error(err);
        }
        console.log(`Created ${entry_type}: ${inspect(row)}`);
    });
}

function update_row(table, query, state, entry_type) {
    state.updated_at = new Date();
    table.updateOne(query, { $set: state }, (err, result) => {
        if (err != null) {
            throw new Error(`Failed to update ${query}: ${err}`);
        }
        console.log(`Successfully updated row for ${entry_type} ${query}`);
    });
}

function delete_row(table, query, entry_type) {
    table.deleteOne(query, (err, result) => {
        if (err != null) {
            throw new Error(`Failed to remove ${entry_type}: ${err}`);
        }
        console.log(`Successfully removed ${entry_type} ${query}`);
    });
}

function load() {
    MongoClient.connect(DB_URL, (err, client) => {
        if (err != null) {
            throw new Error(`Couldn't connect to config DB: ${err}`);
        }
        console.log('Connected to config DB');

        db = client.db(DB_NAME);
        designsTable = db.collection('designs');
        usersTable = db.collection('users');

        designsTable.find({}).toArray((err, designRows) => {
            if (err != null) {
                throw new Error(`Failed to scan "devices" rows: ${err}`);
            }
            usersTable.find({}).toArray((err, userRows) => {
                if (err != null) {
                    throw new Error(`Failed to scan "users" rows: ${err}`);
                }
                setState(designRows, userRows);
            });
        });
    });
}

function dbRowsToState(designRows, userRows) {
    const designs = designRows.map(({ design_no, design_name, colors, design_images }) => ({
        design_no, design_name, colors, design_images
    }));
    const users = userRows.map(({ email_id, password }) => ({
        email_id, password
    }));

    return { designs, users };
}

function setState(designRows, userRows) {
    const { designs, users } = dbRowsToState(designRows, userRows);
    dispatch({ type: 'setStateFromDB', designs, users });
}

const api = {
    load,
    dispatchSideEffects,
};

export default api;