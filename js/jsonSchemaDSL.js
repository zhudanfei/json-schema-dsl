const basicType = require('./basicType');
const jsonField = require('./jsonField');
const jsonArray = require('./jsonArray');
const jsonObject = require('./jsonObject');

JsonAny = basicType.anyType;
JsonString = basicType.stringType;
JsonInteger = basicType.integerType;
JsonBoolean = basicType.booleanType;
JsonStringMap = basicType.stringMap;
JsonField = function (name, fieldType, ...filters){
    return new jsonField.Field(name, fieldType, filters);
};

JsonIncomingObject = jsonObject.incomingObject;
JsonOutgoingObject = jsonObject.outgoingObject;
JsonArray = jsonArray.arrayClass;
