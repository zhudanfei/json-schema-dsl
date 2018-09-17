class IncomingField{
    constructor(name, fieldType, filters){
        this.name = name;
        this.fieldType = fieldType;
        this.filters = filters;
    }

    getName(){
        return this.name;
    }

    process(parent, inputObject){
        const path = parent.concat([this.name]);
        const result = this.fieldType(inputObject, path);
        return this.filters.reduce((result, filter) => filter(result, path), result);
    }
}

class OutgoingField{
    constructor(name, fieldType, filters){
        this.name = name;
        this.fieldType = fieldType;
        this.filters = filters;
    }

    getName(){
        return this.name;
    }

    process(parent, inputObject){
        const path = parent.concat([this.name]);
        let result = inputObject;
        result = this.filters.reduce((result, filter) => filter(result, path), result);
        return this.fieldType(result, path);
    }
}

module.exports = {
    IncomingField: IncomingField,
    OutgoingField: OutgoingField
};
