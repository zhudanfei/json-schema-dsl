exports.isString = function (value){
    return typeof(value) === 'string';
};

exports.isInteger = function (value){
    return Number.isInteger(value);
};

exports.isBoolean = function (value){
    return typeof(value) === 'boolean';
};

exports.isDict = function (value){
    if (Array.isArray(value)){
        return false;
    }
    return typeof(value) === 'object';
};

exports.isList = function (value){
    return Array.isArray(value);
};

function getPathString(path){
    if (path === null){
        return ''
    }
    return path.join('.');
}

exports.getMessage = function (path, msg){
    return getPathString(path) + ':' + msg;
};

