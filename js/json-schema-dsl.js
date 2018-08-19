let common = require('./schema-dsl-common');

function FieldClass(name, fieldType, filters){
    this.name = name;
    this.fieldType = fieldType;
    this.filters = filters;
}

FieldClass.prototype.getName = function () {
    return this.name;
};

FieldClass.prototype.process = function (parent, inputObject) {
    let path = parent.concat([this.name]);
    let result = this.fieldType.convert(inputObject, path);
    return this.filters.reduce((result, filter) => filter(result, path), result);
};

function ObjectClass(fields) {
    this.fields = fields;
    this.fieldNameSet = new Set(fields.map(field => field.getName()));
    this.path = null;
}

ObjectClass.prototype.getUnrecognizedMessage = function(diff) {
    if (diff.length === 1){
        return 'Unrecognized field: ' + diff[0];
    }
    return 'Unrecognized fields: ' + diff.join(', ');
};

ObjectClass.prototype.checkType = function (inputObject) {
    if (!common.isDict(inputObject)){
        throw new Error(common.getMessage(this.path, 'Should be an object'));
    }
};

ObjectClass.prototype.checkRedundancy = function (inputObject) {
    let diff = [];
    Object.keys(inputObject).forEach(key => {
        if (!this.fieldNameSet.has(key)){
            diff.push(key);
        }
    });
    if (diff.length > 0){
        throw new Error(common.getMessage(this.path, this.getUnrecognizedMessage(diff)));
    }
};

ObjectClass.prototype.validate = function (inputObject) {
    if (inputObject === null){
        return;
    }
    this.checkType(inputObject);
    this.checkRedundancy(inputObject);
};

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

ObjectClass.prototype.collectResult = function (inputObject){
    let result = {};
    this.fields.forEach(getFieldResult(inputObject, this.path, result));
    return result;
};

ObjectClass.prototype.convert = function (inputObject, path=null) {
    this.path = path || [];
    this.validate(inputObject);
    if (inputObject === null){
        return null;
    }
    return this.collectResult(inputObject);
};

function ArrayClass(elementType, filters){
    this.elementType = elementType;
    this.filters = filters;
}

ArrayClass.prototype.checkType = function (inputObject) {
    if (!common.isList(inputObject)){
        throw new Error(common.getMessage(this.path, 'Should be an array'));
    }
};

ArrayClass.prototype.validate = function (inputObject) {
    if (inputObject === null){
        return;
    }
    this.checkType(inputObject);
};

ArrayClass.prototype.filter = function (inputObject, i){
    let path = this.path.concat([i.toString()]);
    let result = this.elementType.convert(inputObject[i], path);
    return this.filters.reduce((result, filter) => filter(result, path), result);
};

ArrayClass.prototype.collectResult = function (inputObject){
    let result = [];
    for (let i = 0; i < inputObject.length; i++){
        result.push(this.filter(inputObject, i));
    }
    return result;
};

ArrayClass.prototype.convert = function (inputObject, path=null) {
    this.path = path || [];
    this.validate(inputObject);
    if (inputObject === null){
        return null;
    }
    return this.collectResult(inputObject);
};

require('./basic-type');

function putIntoGlobal() {
    this.JsonField = function (name, fieldType, ...filters){
        return new FieldClass(name, fieldType, filters);
    };
    this.JsonObject = function (...fields) {
        return new ObjectClass(fields);
    };
    this.JsonArray = function (elementType, ...filters){
        return new ArrayClass(elementType, filters);
    }
}

putIntoGlobal();