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

function minimum(low){
    return function (value, path){
        if (value === undefined || value === null) {
            return value;
        }
        if (value < low){
            throw new Error(common.getMessage(path, 'Value is too small'));
        }
        return value;
    }
}

function exclusiveMinimum(low){
    return function (value, path){
        if (value === undefined || value === null) {
            return value;
        }
        if (value <= low){
            throw new Error(common.getMessage(path, 'Value is too small'));
        }
        return value;
    }
}

function maximum(high){
    return function (value, path){
        if (value === undefined || value === null) {
            return value;
        }
        if (value > high){
            throw new Error(common.getMessage(path, 'Value is too large'));
        }
        return value;
    }
}

function exclusiveMaximum(high){
    return function (value, path){
        if (value === undefined || value === null) {
            return value;
        }
        if (value >= high){
            throw new Error(common.getMessage(path, 'Value is too large'));
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
    const regExp = new RegExp(re);
    return function (value, path){
        if (value === undefined || value === null) {
            return value;
        }
        if (value.match(regExp) === null){
            throw new Error(common.getMessage(path, 'Pattern not match'));
        }
        return value;
    }
}

function MaxLength(length){
    return {type: 'validator', name: 'MaxLength', action: maxLength(length)};
}

function MinLength(length){
    return {type: 'validator', name: 'MinLength', action: minLength(length)};
}

function LengthRange(low, high){
    return {type: 'validator', name: 'LengthRange', action: lengthRange(low, high)};
}

function Only(...options){
    return {type: 'validator', name: 'Only', action: only(...options)};
}

function Minimum(low){
    return {type: 'validator', name: 'Minimum', action: minimum(low)};
}

function ExclusiveMinimum(low){
    return {type: 'validator', name: 'ExclusiveMinimum', action: exclusiveMinimum(low)};
}

function Maximum(high){
    return {type: 'validator', name: 'Maximum', action: maximum(high)};
}

function ExclusiveMaximum(high){
    return {type: 'validator', name: 'ExclusiveMaximum', action: exclusiveMaximum(high)};
}

function Range(low, high){
    return {type: 'validator', name: 'Range', action: range(low, high)};
}

function Pattern(re){
    return {type: 'validator', name: 'Pattern', action: pattern(re)};
}

module.exports = {
    NotNull: {type: 'validator', name: 'NotNull', action: notNull},
    NotEmpty: {type: 'validator', name: 'NotEmpty', action: notEmpty},
    MaxLength: MaxLength,
    MinLength: MinLength,
    LengthRange: LengthRange,
    Only: Only,
    Minimum: Minimum,
    ExclusiveMinimum: ExclusiveMinimum,
    Maximum: Maximum,
    ExclusiveMaximum: ExclusiveMaximum,
    Range: Range,
    Pattern: Pattern
};
