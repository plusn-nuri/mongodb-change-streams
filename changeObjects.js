module.exports.ChangeEvent = Object.freeze({
    Insert: 'insert',
    Update: 'update',
    Delete: 'delete',
    Replace: 'replace',
    Invalidate: 'invalidate',
    anyOf() {
        var result = [];

        for (var i = 0; i < arguments.length; i++) {
            result.push({ operationType: arguments[i] })
        }

        return result;
    }
});

module.exports.EventDetail = Object.freeze({
    ChangeOnly: 'default',
    QueriedDocument: 'updateLookup'
});


