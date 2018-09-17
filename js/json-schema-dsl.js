const common = require('./schema-dsl-common');

class Field{
    constructor(name, fieldType, filters){
        this.name = name;
        this.fieldType = fieldType;
        this.filters = filters;
    }

    getName(){
        return this.name;
    }

    process(parent, inputObject){
        const path = parent.concat([this.name]);
        const result = this.fieldType(inputObject, path);
        return this.filters.reduce((result, filter) => filter(result, path), result);
    }
}

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

function checkArrayType (inputObject, path) {
    if (!common.isList(inputObject)){
        throw new Error(common.getMessage(path, 'Should be an array'));
    }
}

function validateArray(inputObject, path) {
    if (inputObject === null){
        return;
    }
    checkArrayType(inputObject, path);
}

function filterArray(inputObject, path, elementType, filters, i){
    const elemPath = path.concat([i.toString()]);
    const  result = elementType(inputObject[i], elemPath);
    return filters.reduce((result, filter) => filter(result, elemPath), result);
}

function collectArrayResult(inputObject, path, elementType, filters){
    let result = [];
    for (let i = 0; i < inputObject.length; i++){
        result.push(filterArray(inputObject, path, elementType, filters, i));
    }
    return result;
}

function arrayClass(elementType, ...filters){
    return function(inputObject, path = null){
        path = path || [];
        validateArray(inputObject, path);
        if (inputObject === null){
            return null;
        }
        return collectArrayResult(inputObject, path, elementType, filters);
    }
}

require('./basic-type');

JsonField = function (name, fieldType, ...filters){
    return new Field(name, fieldType, filters);
};

JsonObject = incomingObject;
JsonArray = arrayClass;
