const basicType = require('./basicType');
const jsonField = require('./jsonField');
const jsonArray = require('./jsonArray');
const jsonObject = require('./jsonObject');

JsonAny = basicType.anyType;
JsonString = basicType.stringType;
JsonInteger = basicType.integerType;
JsonBoolean = basicType.booleanType;
JsonStringMap = basicType.stringMap;
JsonFieldIn = function (name, fieldType, ...filters){
    return new jsonField.IncomingField(name, fieldType, filters);
};

JsonFieldOut = function (name, fieldType, ...filters){
    return new jsonField.OutgoingField(name, fieldType, filters);
};

JsonObjectIn = jsonObject.incomingObject;
JsonObjectOut = jsonObject.outgoingObject;
JsonArray = jsonArray.arrayClass;
