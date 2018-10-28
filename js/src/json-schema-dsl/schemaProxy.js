const schemaGetter = require('./schemaGetter');
const schemaSetter = require('./schemaSetter');

function createProxy(target, schemaObject, path = []) {
    return new Proxy(target, new SchemaProxy(schemaObject, path));
}

class SchemaProxy {
    constructor(schemaObject, path) {
        this.$schemaObject = schemaObject;
        this.$path = path;
    }

    get(target, fieldName, receiver) {
        if (fieldName === '$get' || fieldName === '$set') {
            return this[fieldName](target);
        }
        return createProxy(target, this.$schemaObject, this.$path.concat([fieldName]));
    }

    $get(target) {
        return () => schemaGetter(this.$schemaObject, this.$path, target);
    }

    $set(target) {
        return value => schemaSetter(this.$schemaObject, this.$path, target, value);
    }
}

module.exports = {
    createProxy: createProxy
};

