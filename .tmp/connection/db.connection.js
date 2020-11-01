"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollectionWithSchema = exports.getCollection = exports.getDb = exports.initDb = void 0;
var mongodb_1 = require("mongodb");
var url = 'mongodb://localhost:27017';
var _db;
var initDb = function (dbName, cb) {
    if (_db) {
        console.log('Already connected');
        cb(null, _db);
    }
    else {
        mongodb_1.MongoClient.connect(url + "/" + dbName, { useUnifiedTopology: true }).then(function (client) {
            _db = client;
            cb(null, _db);
        }).catch(function (err) {
            cb(err);
        });
    }
};
exports.initDb = initDb;
var getDb = function () {
    if (!_db) {
        throw Error('Database is not initialized.');
    }
    return _db.db();
};
exports.getDb = getDb;
var getCollection = function (collectionName) {
    if (!_db) {
        throw Error('Database is not initialized.');
    }
    return _db.db().collection(collectionName);
};
exports.getCollection = getCollection;
var getCollectionWithSchema = function (collectionName, options, cb) {
    var db = getDb();
    db.listCollections({ name: collectionName }).toArray().then(function (result) {
        if (result[0] && result[0].options) {
            cb(true);
        }
        else {
            db.createCollection(collectionName, options).then(function (result) {
                return db.collection(collectionName).createIndex({ name: 1 }, { unique: true });
            }).then(function (index) {
                console.log("new collection " + collectionName + " created with index " + index);
                cb(true);
            }).catch(function (err) {
                cb(false);
            });
        }
    });
};
exports.getCollectionWithSchema = getCollectionWithSchema;
