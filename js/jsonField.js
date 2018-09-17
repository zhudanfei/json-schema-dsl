class Field{
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

module.exports = {
    Field: Field
};