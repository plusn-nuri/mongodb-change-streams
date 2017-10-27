"use strict";
var cfg = require('./config.js');
var mc = require('mongodb').MongoClient;

mc.connect(cfg.connectionString)
    .then(client => {
        var coll = client.db(cfg.dbName).collection(cfg.collectionName);

        var cursor = coll.aggregate([
            { $changeStream: { fullDocument: 'updateLookup' } },
            { $match: { operationType: { $in: ['update', 'replace'] } } },
            { $project: {secret:0}}
            
        ]);

        cursor.each((err, data) => {
            console.log(err || data.fullDocument);
        });
        return coll;
    })
    .then(coll => {
        return coll.update({ _id: 'waldo' }, { $set: { seen: 'beach' }, $currentDate: { at: true } }, { upsert: true });
    }).catch(err => {
        console.error(err)
    });