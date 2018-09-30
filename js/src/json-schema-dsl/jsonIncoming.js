const basicType = require('./basicType');
const common = require('./schemaCommon');

function checkObjectType(inputObject, path) {
    if (!common.isDict(inputObject)) {
        throw new Error(common.getMessage(path, 'Should be an object'));
    }
}

function getUnrecognizedMessage(diff) {
    if (diff.length === 1) {
        return 'Unrecognized field: ' + diff[0];
    }
    return 'Unrecognized fields: ' + diff.join(', ');
}

function checkRedundancy(inputObject, path, fieldNameSet) {
    let diff = [];
    Object.keys(inputObject).forEach(key => {
        if (!fieldNameSet.has(key)) {
            diff.push(key);
        }
    });
    if (diff.length > 0) {
        throw new Error(common.getMessage(path, getUnrecognizedMessage(diff)));
    }
}

function validateIncomingObject(inputObject, path, fieldNameSet) {
    if (inputObject === undefined || inputObject === null) {
        return;
    }
    checkObjectType(inputObject, path);
    checkRedundancy(inputObject, path, fieldNameSet);
}

function processField(field, parent, inputObject){
    const path = parent.concat([field.name]);
    const result = convert(field.fieldType, inputObject, path);
    return field.filters.reduce((result, filter) => filter(result, path), result);
}

function getFieldResult(inputObject, path, result) {
    return function (field) {
        const fieldName = field.name;
        if (fieldName in inputObject) {
            result[fieldName] = processField(field, path, inputObject[fieldName]);
        } else {
            result[fieldName] = processField(field, path, undefined);
        }
    }
}

function collectObjectResult(inputObject, path, fields) {
    let result = {};
    fields.forEach(getFieldResult(inputObject, path, result));
    return result;
}

function convertObject(schema, inputObject, path) {
    path = path || [];
    const fieldNameSet = new Set(schema.fields.map(field => field.name));
    validateIncomingObject(inputObject, path, fieldNameSet);
    if (inputObject === undefined || inputObject === null) {
        return inputObject;
    }
    return collectObjectResult(inputObject, path, schema.fields);
}

function checkArrayType (inputObject, path) {
    if (!common.isList(inputObject)){
        throw new Error(common.getMessage(path, 'Should be an array'));
    }
}

function validateArray(inputObject, path) {
    if (inputObject === undefined || inputObject === null){
        return;
    }
    checkArrayType(inputObject, path);
}

function filterArrayElement(inputObject, path, elementType, filters){
    const result = convert(elementType, inputObject, path);
    return filters.reduce((result, filter) => filter(result, path), result);
}

function collectArrayResult(inputObject, path, elementType, filters){
    let result = [];
    for (let i = 0; i < inputObject.length; i++){
        const elemPath = path.concat([i.toString()]);
        result.push(filterArrayElement(inputObject[i], elemPath, elementType, filters));
    }
    return result;
}

function convertArray(schema, inputObject, path){
    path = path || [];
    validateArray(inputObject, path);
    if (inputObject === undefined || inputObject === null) {
        return inputObject;
    }
    return collectArrayResult(inputObject, path, schema.elementType, schema.filters);
}

function schemaWrap(converter){
    return function(schema, inputObject, path){
        return converter(inputObject, path);
    }
}

const typeFunctionMap = {
    String: schemaWrap(basicType.stringType),
    Integer: schemaWrap(basicType.integerType),
    Number: schemaWrap(basicType.numberType),
    Boolean: schemaWrap(basicType.booleanType),
    StringMap: schemaWrap(basicType.stringMap),
    Object: convertObject,
    Array: convertArray
};

function convert(schema, inputObject, path = []){
    return typeFunctionMap[schema.type](schema, inputObject, path);
}

module.exports = {
    convert: convert
};
