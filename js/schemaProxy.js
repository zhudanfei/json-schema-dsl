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
        throw new Error('Index should be integer');
    }
    return [schemaObj.elementType, obj[index]];
}

function getStringMapField(schemaObj, obj, name){
    return [{type: 'String'}, obj[name]]
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

function walkFieldCommon(obj, name, fieldType){
    if (fieldType.type !== 'Object' && fieldType.type !== 'Array' && fieldType.type !== 'StringMap'){
        throw new Error('Path is too long');
    }
    if (obj[name] === undefined || obj[name] === null){
        if (fieldType.type === 'Object'){
            obj[name] = {};
        } else {
            obj[name] = [];
        }
    }
    return [fieldType, obj[name]];
}

function walkObjectField(schemaObj, obj, name){
    const field = findField(schemaObj, name);
    if (field === null){
        throw new Error('Unrecognized field: ' + name);
    }
    const fieldType = field.fieldType;
    return walkFieldCommon(obj, name, fieldType);
}

function walkArrayField(schemaObj, obj, name){
    const index = convertToInteger(name);
    if (index === null){
        throw new Error('Index should be integer');
    }
    const fieldType = schemaObj.elementType;
    return walkFieldCommon(obj, index, fieldType);
}

function walkFields(schemaObj, obj, path){
    for (let i = 0; i < path.length; i++){
        const name = path[i];
        if (schemaObj.type === 'Object'){
            [schemaObj, obj] = walkObjectField(schemaObj, obj, name);
        } else if (schemaObj.type === 'Array') {
            [schemaObj, obj] = walkArrayField(schemaObj, obj, name);
        } else {
            throw new Error('Path is too long');
        }
    }
    return [schemaObj, obj];
}

function setField(schemaObj, obj, name, value){
    if (schemaObj.type === 'Object') {
        const field = findField(schemaObj, name);
        if (field === null) {
            throw new Error('Unrecognized field: ' + name);
        }
        obj[name] = value;
    } else if (schemaObj.type === 'Array'){
        const index = convertToInteger(name);
        if (index === null){
            throw new Error('Index should be integer');
        }
        obj[index] = value;
    } else {
        obj[name] = value;
    }
}

function setter(schemaObj, path, obj, value){
    if (path.length === 0){
        throw new Error('Cannot set itself');
    }
    [schemaObj, obj] = walkFields(schemaObj, obj, path.slice(0, path.length - 1));
    setField(schemaObj, obj, path[path.length - 1], value);
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

