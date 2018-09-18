const common = require('./schemaCommon');

function anyType(value, path){
    return value;
}

function stringType(value, path){
    path = path || [];
    if (value === null) {
        return null;
    }
    if (!common.isString(value)){
        throw new Error(common.getMessage(path, 'Should be a string'));
    }
    return value;
}

function integerType(value, path){
    path = path || [];
    if (value === null) {
        return null;
    }
    if (!common.isInteger(value)){
        throw new Error(common.getMessage(path, 'Should be an integer'));
    }
    return value;
}

function booleanType(value, path){
    path = path || [];
    if (value === null) {
        return null;
    }
    if (!common.isBoolean(value)){
        throw new Error(common.getMessage(path, 'Should be a boolean'));
    }
    return value;
}

function validateStringMap(value, path){
    if (!common.isDict(value)){
        throw new Error(common.getMessage(path, 'Should be an object'));
    }
    for (let prop in value){
        if (value.hasOwnProperty(prop)){
            if (!common.isString(value[prop])){
                let ext_path = path.concat([prop]);
                throw new Error(common.getMessage(ext_path, 'Should be a string'));
            }
        }
    }
}

function stringMap(value, path){
    path = path || [];
    if (value === null) {
        return null;
    }
    validateStringMap(value, path);
    return value;
}

module.exports = {
    anyType: anyType,
    stringType: stringType,
    integerType: integerType,
    booleanType: booleanType,
    stringMap: stringMap
};

