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

function setObjectField(schemaObj, obj, value, name){
    const field = findField(schemaObj, name);
    if (field === null){
        throw new Error('Unrecognized field: ' + name);
    }
    if (field.fieldType.type !== 'Object' && field.fieldType.type !== 'Array'){
        throw new Error('Path is too long');
    }
    if (field.fieldType.type === 'Object'){
        if (obj[name] === undefined || obj[name] === null){
            obj[name] = {};
        }
    } else {
        if (obj[name] === undefined || obj[name] === null){
            obj[name] = [];
        }
    }
    return [field.fieldType, obj[name]];
}

function setter(schemaObj, path, obj, value){
    if (path.length === 0){
        throw new Error('Cannot set itself');
    }
    for (let i = 0; i < path.length - 1; i++){
        const name = path[i];
        if (schemaObj.type === 'Object'){
            [schemaObj, obj] = setObjectField(schemaObj, obj, value, name);
        }
    }
    const name = path[path.length - 1];
    const field = findField(schemaObj, name);
    if (field === null){
        throw new Error('Unrecognized field: ' + name);
    }
    obj[name] = value;
}

function createProxy(target, schemaObject, path = []){
    return new Proxy(target, new SchemaProxy(schemaObject, path));
}

class SchemaProxy {
    constructor(schemaObject, path){
        this.$schemaObject = schemaObject;
        this.$path = path;
    }

    get(target, fieldName, receiver){
        if (fieldName === '$get' || fieldName === '$set'){
            return this[fieldName](target);
        }
        return createProxy(target, this.$schemaObject, this.$path.concat([fieldName]));
    }

    $get(target){
        return () => getter(this.$schemaObject, this.$path, target);
    }

    $set(target){
        return value => setter(this.$schemaObject, this.$path, target, value);
    }
}

module.exports = {
    createProxy: createProxy
};

