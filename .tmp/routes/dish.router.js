"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dishes_constant_1 = require("../constants/dishes.constant");
var db_connection_1 = require("./../connection/db.connection");
var collectionName = 'dishes';
var dishRouter = express_1.default.Router();
dishRouter.use(express_1.default.json());
var route = dishRouter.route('/');
/**
 * Middleware for all http calls
 */
route.all(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
});
/**
 * get all dishes
 */
route.get(function (req, res, next) {
    db_connection_1.getCollection(collectionName).find({})
        .sort({ _id: -1 })
        .skip(0)
        .limit(5).toArray()
        .then(function (dishes) {
        res.status(200).json(dishes);
    })
        .catch(function (err) {
        res.status(500).json(err);
    });
});
/**
 * Add a new dish
 */
route.post(function (req, res, next) {
    db_connection_1.getCollectionWithSchema(collectionName, dishes_constant_1.DISHES_SCHEMA, function (isCollAvailable) {
        if (isCollAvailable) {
            db_connection_1.getCollection(collectionName).insertOne(req.body).then(function (newDoc) {
                res.status(201).json({ message: 'A new dish inserted', id: newDoc.insertedId });
            }).catch(function (err) {
                res.status(500).json(err);
            });
        }
        else {
            res.status(500).json({ message: "Failed to create a dish [collection not found]" });
        }
    });
});
/**
 * delete dishes
 */
route.delete(function (req, res, next) {
    db_connection_1.getCollection(collectionName).deleteMany({}).then(function () {
        res.status(200).json({ message: 'dishes collection deleted' });
    }).catch(function (err) {
        next({ message: 'Not able to delete dishes' });
    });
});
exports.default = dishRouter;
