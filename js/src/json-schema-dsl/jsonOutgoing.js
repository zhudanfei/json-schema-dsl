const basicType = require('./basicType');
const common = require('./schemaCommon');

function checkObjectType(inputObject, path) {
    if (!common.isDict(inputObject)) {
        throw new Error(common.getMessage(path, 'Should be an object'));
    }
}

function validateOutgoingObject(inputObject, path, fieldNameSet) {
    if (inputObject === undefined || inputObject === null) {
        return;
    }
    checkObjectType(inputObject, path);
}

function processField(field, parent, inputObject){
    const path = parent.concat([field.name]);
    const result = field.filters.reduce((result, filter) => filter.action(result, path), inputObject);
    return convert(field.fieldType, result, path);
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
    validateOutgoingObject(inputObject, path, fieldNameSet);
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
    const result = filters.reduce((result, filter) => filter.action(result, path), inputObject);
    return convert(elementType, result, path);
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
    if (inputObject === undefined || inputObject === null){
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
    Any: schemaWrap(basicType.anyType),
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
