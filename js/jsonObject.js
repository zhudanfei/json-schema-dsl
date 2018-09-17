const common = require('./schema-dsl-common');

function getUnrecognizedMessage(diff) {
    if (diff.length === 1){
        return 'Unrecognized field: ' + diff[0];
    }
    return 'Unrecognized fields: ' + diff.join(', ');
}

function checkObjectType(inputObject, path) {
    if (!common.isDict(inputObject)){
        throw new Error(common.getMessage(path, 'Should be an object'));
    }
}

function checkRedundancy(inputObject, path, fieldNameSet) {
    let diff = [];
    Object.keys(inputObject).forEach(key => {
        if (!fieldNameSet.has(key)){
            diff.push(key);
        }
    });
    if (diff.length > 0){
        throw new Error(common.getMessage(path, getUnrecognizedMessage(diff)));
    }
}

function validateObject(inputObject, path, fieldNameSet) {
    if (inputObject === null){
        return;
    }
    checkObjectType(inputObject, path);
    checkRedundancy(inputObject, path, fieldNameSet);
}

function getFieldResult(inputObject, path, result){
    return function(field){
        let fieldName = field.getName();
        if (fieldName in inputObject){
            result[fieldName] = field.process(path, inputObject[fieldName]);
        } else {
            result[fieldName] = field.process(path, null);
        }
    }
}

function collectObjectResult(inputObject, path, fields){
    let result = {};
    fields.forEach(getFieldResult(inputObject, path, result));
    return result;
}

function incomingObject(...fields){
    const fieldNameSet = new Set(fields.map(field => field.getName()));
    return function(inputObject, path = null){
        path = path || [];
        validateObject(inputObject, path, fieldNameSet);
        if (inputObject === null){
            return null;
        }
        return collectObjectResult(inputObject, path, fields);
    }
}

module.exports = {
    incomingObject: incomingObject
};
