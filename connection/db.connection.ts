import { CollectionCreateOptions, MongoClient } from 'mongodb';
const url = 'mongodb://localhost:27017';

let _client: MongoClient;

const initDb = (dbName: string, cb: Function) => {
    if (_client) {
        console.log('Already connected');
        cb(null, _client);
    } else {
        MongoClient.connect(`${url}/${dbName}`, { useUnifiedTopology: true }).then((client) => {
            _client = client;
            cb(null, _client);
        }).catch((err) => {
            cb(err);
        });
    }
};

const getDb = () => {
    if (!_client) {
        throw Error('Database is not initialized.');
    }
    return _client.db();
}

const getCollection = (collectionName: string) => {
    if (!_client) {
        throw Error('Database is not initialized.');
    }
    return _client.db().collection(collectionName);
}

const getCollectionWithSchema = (collectionName: string, options: CollectionCreateOptions, cb: Function ) => {
    const db = getDb();
    db.listCollections({name: collectionName}).toArray().then(result => {
        if(result[0] && result[0].options){
            cb(true);
        } else {
            db.createCollection(collectionName, options).then(result => {
                return db.collection(collectionName).createIndex({name:1}, {unique: true});
            }).then((index) => {
                console.log(`new collection ${collectionName} created with index ${index}`);
                cb(true);
            }).catch(err => {
                cb(false);
            });
        }
    });
}
export { initDb, getDb, getCollection, getCollectionWithSchema };


