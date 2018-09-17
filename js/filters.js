const common = require('./schema-dsl-common');

function toDate(value, path){
    if (value === null){
        return null;
    }
    try {
        return new Date(value);
    } catch (err){
        throw new Error(common.getMessage(path, 'Invalid value'));
    }
}

function toTimestamp(value, path){
    let dt = toDate(value, path);
    if (dt == null){
        return null;
    }
    return dt.getTime();
}

function notNull(value, path){
    if (value === null){
        throw new Error(common.getMessage(path, 'Cannot be null'));
    }
    return value;
}

function trim(value, path){
    if (value === null){
        return null;
    }
    return value.trim();
}

function maxLength(length){
    return function (value, path){
        if (value === null){
            return null;
        }
        if (value.length > length){
            throw new Error(common.getMessage(path, 'String is too long'));
        }
        return value;
    }
}

function minLength(length){
    return function (value, path){
        if (value === null){
            return null;
        }
        if (value.length < length){
            throw new Error(common.getMessage(path, 'String is too short'));
        }
        return value;
    }
}

function lengthRange(low, high){
    return function (value, path){
        if (value === null){
            return null;
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
        if (value === null){
            return null;
        }
        if (!optionSet.has(value)){
            throw new Error(common.getMessage(path, 'Invalid value'));
        }
        return value;
    }
}

function range(low, high){
    return function (value, path){
        if (value === null){
            return null;
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

function integerToString(i){
    return i.toString();
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
    integerToString: integerToString
};
