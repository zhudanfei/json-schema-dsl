function isString(value) {
    return typeof(value) === 'string';
}

function isInteger(value) {
    return Number.isInteger(value);
}

function isNumber(value) {
    return typeof(value) === 'number';
}

function isBoolean(value) {
    return typeof(value) === 'boolean';
}

function isDict(value) {
    if (Array.isArray(value)) {
        return false;
    }
    return typeof(value) === 'object';
}

function isList(value) {
    return Array.isArray(value);
}

function getMessage(path, msg) {
    if (path.length === 0) {
        return msg;
    }
    return path.join('.') + ': ' + msg;
}

function convertToInteger(s) {
    const result = Number(s);
    if (Number.isNaN(result)) {
        return null;
    }
    return result;
}

function findField(schemaObject, fieldName) {
    for (const field of schemaObject.fields) {
        if (field.name === fieldName) {
            return field;
        }
    }
    return null;
}

module.exports = {
    isString: isString,
    isInteger: isInteger,
    isNumber: isNumber,
    isBoolean: isBoolean,
    isDict: isDict,
    isList: isList,
    getMessage: getMessage,
    convertToInteger: convertToInteger,
    findField: findField
};
