// "use strict";
var cfg = require('./config.js');
var mc = require('mongodb').MongoClient;
var ChangeEvent = require('./changeObjects.js').ChangeEvent;
var EventDetail = require('./changeObjects.js').EventDetail;

mc.connect(cfg.connectionString)
    .then(client => {
        var coll = client.db
(cfg.dbName).collection(cfg.collectionName);

        var changeStream = watchForWaldo(coll);

        return setTimeout(() => coll.updateOne(
            { _id: 'waldo' },
            { $currentDate: { dt: true } },
            { upsert: true }), 300);

    }).catch(err => {
        console.error(err)
    });

function watchForWaldo(coll) {
    var filter = {
        $match: {
            $or: [{ operationType: 'update' }, { operationType: 'replace' }],
            'fullDocument._id': 'waldo'
        }
    };

    var options = { fullDocument: 'updateLookup' };

    var changeStream = coll.watch([filter], options);

    changeStream.on('change', c => {
        console.log('Waldo alert!', c);
    });

    changeStream.on('error', err => console.log('Oh snap!', err));
    return changeStream;
}

