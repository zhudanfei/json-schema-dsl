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

function trim(value, path){
    if (value === undefined || value === null) {
        return value;
    }
    return value.trim();
}

function toString(value){
    if (value === undefined || value === null) {
        return value;
    }
    return value.toString();
}

module.exports = {
    ToTimestamp: {type: 'filter', name: 'toTimestamp', action: toTimestamp},
    Trim: {type: 'filter', name: 'Trim', action: trim},
    ToString: {type: 'filter', name: 'ToString', action: toString}
};
