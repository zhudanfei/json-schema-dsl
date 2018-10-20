const common = require('./schemaCommon');

function toDate(value, path){
    if (value === undefined || value === null) {
        return value;
    }
    const result = new Date(value);
    if (isNaN(result.getTime())){
        throw new Error(common.getMessage(path, 'Invalid value'));
    }
    return result;
}

function toTimestamp(value, path){
    let dt = toDate(value, path);
    if (dt === undefined || dt === null) {
        return dt;
    }
    return dt.getTime();
}

function notNull(value, path){
    if (value === undefined || value === null){
        throw new Error(common.getMessage(path, 'Cannot be null'));
    }
    return value;
}

function trim(value, path){
    if (value === undefined || value === null) {
        return value;
    }
    return value.trim();
}

function maxLength(length){
    return function (value, path){
        if (value === undefined || value === null) {
            return value;
        }
        if (value.length > length){
            throw new Error(common.getMessage(path, 'String is too long'));
        }
        return value;
    }
}

function minLength(length){
    return function (value, path){
        if (value === undefined || value === null) {
            return value;
        }
        if (value.length < length){
            throw new Error(common.getMessage(path, 'String is too short'));
        }
        return value;
    }
}

function lengthRange(low, high){
    return function (value, path){
        if (value === undefined || value === null) {
            return value;
        }
        if (value.length < low){
            throw new Error(common.getMessage(path, 'String is too short'));
        }
        if (value.length > high){
            throw new Error(common.getMessage(path, 'String is too long'));
        }
        return value;
    }
}

function only(...options){
    let optionSet = new Set(options);
    return function (value, path){
        if (value === undefined || value === null) {
            return value;
        }
        if (!optionSet.has(value)){
            throw new Error(common.getMessage(path, 'Invalid value'));
        }
        return value;
    }
}

function range(low, high){
    return function (value, path){
        if (value === undefined || value === null) {
            return value;
        }
        if (value < low){
            throw new Error(common.getMessage(path, 'Value is too small'));
        }
        if (value > high){
            throw new Error(common.getMessage(path, 'Value is too large'));
        }
        return value;
    }
}

function toString(value){
    if (value === undefined || value === null) {
        return value;
    }
    return value.toString();
}

module.exports = {
    toTimestamp: toTimestamp,
    notNull: notNull,
    trim: trim,
    maxLength: maxLength,
    minLength: minLength,
    lengthRange: lengthRange,
    only: only,
    range: range,
    toString: toString
};
