const common = require('./schemaCommon');

function notNull(value, path){
    if (value === undefined || value === null){
        throw new Error(common.getMessage(path, 'Cannot be null'));
    }
    return value;
}

function notEmpty(value, path){
    if (value === undefined || value === null){
        throw new Error(common.getMessage(path, 'Cannot be null'));
    }
    if (value.length === 0){
        throw new Error(common.getMessage(path, 'Cannot be empty'));
    }
    return value;
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

function pattern(re){
    return function (value, path){
        if (value === undefined || value === null) {
            return value;
        }
        const regExp = new RegExp(re);
        if (value.match(regExp) === null){
            throw new Error(common.getMessage(path, 'Pattern not match'));
        }
        return value;
    }
}

function MaxLength(length){
    return {type: 'validation', name: 'MaxLength', action: maxLength(length)};
}

function MinLength(length){
    return {type: 'validation', name: 'MinLength', action: minLength(length)};
}

function LengthRange(low, high){
    return {type: 'validation', name: 'LengthRange', action: lengthRange(low, high)};
}

function Only(...options){
    return {type: 'validation', name: 'Only', action: only(...options)};
}

function Range(low, high){
    return {type: 'validation', name: 'Range', action: range(low, high)};
}

function Pattern(re){
    return {type: 'validation', name: 'Pattern', action: pattern(re)};
}

module.exports = {
    NotNull: {type: 'validation', name: 'NotNull', action: notNull},
    NotEmpty: {type: 'validation', name: 'NotEmpty', action: notEmpty},
    MaxLength: MaxLength,
    MinLength: MinLength,
    LengthRange: LengthRange,
    Only: Only,
    Range: Range,
    Pattern: Pattern
};
