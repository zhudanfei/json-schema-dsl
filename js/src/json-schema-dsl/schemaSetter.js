const common = require('./schemaCommon');

function walkFieldCommon(obj, name, fieldType) {
    if (fieldType.type !== 'Object' && fieldType.type !== 'Array' && fieldType.type !== 'StringMap') {
        throw new Error('Path is too long');
    }
    if (obj[name] === undefined || obj[name] === null) {
        if (fieldType.type === 'Object' || fieldType.type === 'StringMap') {
            obj[name] = {};
        } else {
            obj[name] = [];
        }
    }
    return [fieldType, obj[name]];
}

function walkObjectField(schemaObj, obj, name) {
    const field = common.findField(schemaObj, name);
    if (field === null) {
        throw new Error('Unrecognized field: ' + name);
    }
    const fieldType = field.fieldType;
    return walkFieldCommon(obj, name, fieldType);
}

function walkArrayField(schemaObj, obj, name) {
    const index = common.convertToInteger(name);
    if (index === null) {
        throw new Error('Index should be integer');
    }
    const fieldType = schemaObj.elementType;
    return walkFieldCommon(obj, index, fieldType);
}

function walkFields(schemaObj, obj, path) {
    for (let i = 0; i < path.length; i++) {
        const name = path[i];
        if (schemaObj.type === 'Object') {
            [schemaObj, obj] = walkObjectField(schemaObj, obj, name);
        } else if (schemaObj.type === 'Array') {
            [schemaObj, obj] = walkArrayField(schemaObj, obj, name);
        } else {
            throw new Error('Path is too long');
        }
    }
    return [schemaObj, obj];
}

function setField(schemaObj, obj, name, value) {
    if (schemaObj.type === 'Object') {
        const field = common.findField(schemaObj, name);
        if (field === null) {
            throw new Error('Unrecognized field: ' + name);
        }
        obj[name] = value;
    } else if (schemaObj.type === 'Array') {
        const index = common.convertToInteger(name);
        if (index === null) {
            throw new Error('Index should be integer');
        }
        obj[index] = value;
    } else {
        obj[name] = value;
    }
}

function setter(schemaObj, path, obj, value) {
    if (path.length === 0) {
        throw new Error('Cannot set itself');
    }
    [schemaObj, obj] = walkFields(schemaObj, obj, path.slice(0, path.length - 1));
    setField(schemaObj, obj, path[path.length - 1], value);
}

module.exports = setter;