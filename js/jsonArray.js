const common = require('./schema-dsl-common');

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

function filterArrayElement(inputObject, path, elementType, filters){
    const result = elementType(inputObject, path);
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

module.exports = {
    arrayClass: arrayClass
};
