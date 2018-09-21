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

function getObjectField(schemaObj, obj, name){
    const field = findField(schemaObj, name);
    if (field === null){
        throw new Error('Unrecognized field: ' + name);
    }
    if (obj[name] === undefined || obj[name] === null){
        throw null;
    }
    return [field.fieldType, obj[name]];
}

function getArrayField(schemaObj, obj, name){
    const index = convertToInteger(name);
    if (index === null){
        throw undefined;
    }
    return [schemaObj.elementType, obj[index]];
}

function getStringMapField(schemaObj, obj, name){
    return [{}, obj[name]]
}

function getBasicField(schemaObj, obj, name){
    throw new Error('Path is too long')
}

const FieldTypeGetterMap = {
    Object: getObjectField,
    Array: getArrayField,
    StringMap: getStringMapField,
    String: getBasicField,
    Integer: getBasicField,
    Boolean: getBasicField
};

function getField(schemaObj, obj, name){
    return FieldTypeGetterMap[schemaObj.type](schemaObj, obj, name);
}

function getter(schemaObj, path, obj){
    try {
        for (const name of path) {
            [schemaObj, obj] = getField(schemaObj, obj, name);
        }
        return obj;
    } catch(err){
        if (err === null || err === undefined){
            return err;
        }
        throw err;
    }
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
        return createProxy(this.$schemaObject, this.$path.concat([fieldName]));
    }

    apply(target, thisArg, argumentsList){
        return getter(this.$schemaObject, this.$path, argumentsList[0]);
    }
}

module.exports = {
    createProxy: createProxy
};

