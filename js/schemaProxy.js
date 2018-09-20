function getter(obj, path){
    for (const name of path){
        if (obj[name] === undefined || obj[name] === null){
            return null;
        }
        obj = obj[name];
    }
    return obj;
}

function findField(schemaObject, fieldName){
    for (field of schemaObject.fields){
        if (field.name === fieldName){
            return field;
        }
    }
    return null;
}

function createProxy(schemaObject, path = []){
    return new Proxy(function(obj){}, new SchemaProxy(schemaObject, path));
}

class SchemaProxy {
    constructor(schemaObject, path){
        this.$schemaObject = schemaObject;
        this.$path = path;
    }

    getObjectFieldValue(target, field){
        const newPath = this.$path.concat([field.name]);
        this[field.name] = createProxy(field.fieldType, newPath);
        return this[field.name];
    }

    getArrayFieldValue(target, field){
        return null;
    }

    getStringMapFieldValue(target, field){
        return null;
    }

    getBasicFieldValue(target, field){
        const newPath = this.$path.concat([field.name]);
        this[field.name] = createProxy(field.fieldType, newPath);
        return this[field.name];
    }

    getFieldValue(target, field){
        if (field.fieldType.type === 'Object'){
            return this.getObjectFieldValue(target, field);
        } else if (field.fieldType.type === 'Array'){
            return this.getArrayFieldValue(target, field);
        } else if (field.fieldType.type === 'StringMap'){
            return this.getStringMapFieldValue(target, field);
        } else {
            return this.getBasicFieldValue(target, field);
        }
    }

    get(target, fieldName, receiver){
        if (this[fieldName] !== undefined){
            return this[fieldName];
        }
        const field = findField(this.$schemaObject, fieldName);
        if (field === null){
            return obj => undefined;
        }
        return this.getFieldValue(target, field);
    }

    apply(target, thisArg, argumentsList){
        return getter(argumentsList[0], this.$path);
    }
}

module.exports = {
    createProxy: createProxy
};

/*
var obj = {node: 'abc', user: ['def', null, 'f'], tag: {name: null, level: 2}};
console.log(getter(obj, ['use', '2']));

function processField(field, path) {
    const newPath = path.concat([field.name]);
    let flattenedFields = [CreateFieldContext(newPath)];
    const classType = field.fieldType;
    flattenedFields += flattenFields(field.GetClass(), newPath);
    return flattenedFields
}

function flattenFields(jsonObject, path) {
    let flattenedFields = [];
    for (field of jsonObject.fields) {
        flattenedFields = flattenedFields.concat(processField(field, path));
    }
    return flattenedFields;
}

function schemaProxy(jsonObject){

}
*/
