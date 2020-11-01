import express from "express";
import { DISHES_SCHEMA } from "../constants/dishes.constant";
import { getCollection, getCollectionWithSchema} from "./../connection/db.connection";

const collectionName = 'dishes';
const dishRouter = express.Router();
dishRouter.use(express.json());
const route = dishRouter.route('/');

/**
 * Middleware for all http calls
 */
route.all((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

/**
 * get all dishes
 */
route.get((req, res, next) => {
    getCollection(collectionName).find({})
        .sort({ _id: -1 })
        .skip(0)
        .limit(5).toArray()
        .then((dishes) => {
            res.status(200).json(dishes);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

/**
 * Add a new dish
 */
route.post((req, res, next) => {
    getCollectionWithSchema(collectionName, DISHES_SCHEMA, (isCollAvailable: boolean)=> {
        if(isCollAvailable){
            getCollection(collectionName).insertOne(req.body).then((newDoc) => {
                res.status(201).json({message: 'A new dish inserted', id: newDoc.insertedId});
            }).catch((err) => {
                res.status(500).json(err);
            })
        } else {
            res.status(500).json({message: `Failed to create a dish [collection not found]`});
        }
    });
});

/**
 * delete dishes
 */
route.delete((req, res, next) => {
    getCollection(collectionName).deleteMany({
        _id: {$in:req.body}
    }).then(() => {
        res.status(200).json({message: 'dishes collection deleted'});
    }).catch(err=> {
        next({message: 'Not able to delete dishes'});
    })
});

export default dishRouter;