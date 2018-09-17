require('./basic-type');
const jsonField = require('./jsonField');
const jsonArray = require('./jsonArray');
const jsonObject = require('./jsonObject');

JsonField = function (name, fieldType, ...filters){
    return new jsonField.Field(name, fieldType, filters);
};

JsonIncomingObject = jsonObject.incomingObject;
JsonArray = jsonArray.arrayClass;
