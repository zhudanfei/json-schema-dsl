 function isString(value){
    return typeof(value) === 'string';
}

function isInteger(value){
    return Number.isInteger(value);
}

 function isNumber(value) {
     return typeof(value) === 'number';
 }

function isBoolean(value){
    return typeof(value) === 'boolean';
}

function isDict(value){
    if (Array.isArray(value)){
        return false;
    }
    return typeof(value) === 'object';
}

 function isList(value){
    return Array.isArray(value);
}

function getPathString(path){
    if (path === null){
        return ''
    }
    return path.join('.');
}

 function getMessage(path, msg){
    if (path.length === 0){
        return msg;
    }
    return getPathString(path) + ': ' + msg;
}

module.exports = {
    isString: isString,
    isInteger: isInteger,
    isNumber: isNumber,
    isBoolean: isBoolean,
    isDict: isDict,
    isList: isList,
    getMessage: getMessage
};
