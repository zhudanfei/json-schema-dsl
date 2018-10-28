const common = require('./schemaCommon');

function getObjectField(schemaObj, obj, name) {
    const field = common.findField(schemaObj, name);
    if (field === null) {
        throw new Error('Unrecognized field: ' + name);
    }
    if (obj[name] === undefined || obj[name] === null) {
        throw obj[name];
    }
    return [field.fieldType, obj[name]];
}

function getArrayField(schemaObj, obj, name) {
    const index = common.convertToInteger(name);
    if (index === null) {
        throw new Error('Index should be integer');
    }
    return [schemaObj.elementType, obj[index]];
}

function getStringMapField(schemaObj, obj, name) {
    return [{type: 'String'}, obj[name]]
}

function getBasicField(schemaObj, obj, name) {
    throw new Error('Path is too long')
}

const FieldTypeGetterMap = {
    Object: getObjectField,
    Array: getArrayField,
    StringMap: getStringMapField,
    String: getBasicField,
    Integer: getBasicField,
    Boolean: getBasicField,
    Number: getBasicField
};

function getField(schemaObj, obj, name) {
    return FieldTypeGetterMap[schemaObj.type](schemaObj, obj, name);
}

function getter(schemaObj, path, obj) {
    try {
        for (const name of path) {
            [schemaObj, obj] = getField(schemaObj, obj, name);
        }
        return obj;
    } catch (err) {
        if (err === null || err === undefined) {
            return err;
        }
        throw err;
    }
}

module.exports = getter;