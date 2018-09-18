 function isString(value){
    return typeof(value) === 'string';
}

function isInteger(value){
    return Number.isInteger(value);
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
    return getPathString(path) + ':' + msg;
}

module.exports = {
    isString: isString,
    isInteger: isInteger,
    isBoolean: isBoolean,
    isDict: isDict,
    isList: isList,
    getMessage: getMessage
};