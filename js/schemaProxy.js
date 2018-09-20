function convertToInteger(s){
    const result = Number(s);
    if (Number.isNaN(result)){
        return null;
    }
    return result;
}

function findField(schemaObject, fieldName){
    for (field of schemaObject.fields){
        if (field.name === fieldName){
            return field;
        }
    }
    return null;
}

function getter(schemaObj, path, obj){
    for (const name of path){
        if (schemaObj.type === 'Object'){
            const field = findField(schemaObj, name);
            if (field === null){
                return undefined;
            }
            if (obj[name] === undefined || obj[name] === null){
                return null;
            }
            schemaObj = field.fieldType;
            obj = obj[name];
        } else if (schemaObj.type === 'Array'){
            const index = convertToInteger(name);
            if (index === null){
                return undefined;
            }
            schemaObj = schemaObj.elementType;
            obj = obj[index];
        } else if (schemaObj.type === 'StringMap') {
            schemaObj = {};
            obj = obj[name];
        } else {
            throw new Error('Path is too long')
        }
    }
    return obj;
}

function createProxy(schemaObject, path = []){
    return new Proxy(function(obj){}, new SchemaProxy(schemaObject, path));
}

class SchemaProxy {
    constructor(schemaObject, path){
        this.$schemaObject = schemaObject;
        this.$path = path;
    }

    get(target, fieldName, receiver){
        if (this[fieldName] !== undefined){
            return this[fieldName];
        }
        const newPath = this.$path.concat([fieldName]);
        this[fieldName] = createProxy(this.$schemaObject, newPath);
        return this[fieldName];
    }

    apply(target, thisArg, argumentsList){
        return getter(this.$schemaObject, this.$path, argumentsList[0]);
    }
}

module.exports = {
    createProxy: createProxy
};

