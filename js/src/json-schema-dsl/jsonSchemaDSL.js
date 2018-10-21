JsonAny = {type: 'Any'};
JsonString = {type: 'String'};
JsonInteger = {type: 'Integer'};
JsonNumber = {type: 'Number'};
JsonBoolean = {type: 'Boolean'};
JsonStringMap = {type: 'StringMap'};

JsonField = function (name, fieldType, ...filters){
    return {name: name, fieldType: fieldType, filters: filters};
};

JsonObject = function(...fields){
    return {type: 'Object', fields: fields};
};

JsonArray = function(elementType, ...filters){
    return {type: 'Array', elementType: elementType, filters: filters};
};

JsonEither = function(...types){
    return {type: 'Either', types: types};
};