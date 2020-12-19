import { MongoClient } from 'mongodb';
import { getState } from './store';
import { dispatch } from './container';

const serverConfig = require('../config/server');
const DB_NAME = 'monopoly';
const DB_URL = `mongodb://${serverConfig.configDBAddress}:${serverConfig.configDBPort}`;

let db;
let designsTable;

function dispatchSideEffects(action) {
    switch (action.type) {
        default:
            console.log(`No side effect from configDB for ${action.type}`);
    }
}

function load() {
    MongoClient.connect(DB_URL, (err, client) => {
        if (err != null) {
          throw new Error(`Couldn't connect to config DB: ${err}`);
        }
        console.log('Connected to config DB');
        
        db = client.db(DB_NAME);
        designsTable = db.collection('designs');
        
        designsTable.find({}).toArray((err, designRows) => {
            if (err != null) {
              throw new Error(`Failed to scan "devices" rows: ${err}`);
            }
            dispatch({ type: 'setStateFromDB', designs: designRows });
        });
    });
}

const api = {
    load,
    dispatchSideEffects,
};
  
export default api;