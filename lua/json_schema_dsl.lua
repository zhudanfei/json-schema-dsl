types = require('types')
set = require('set')
common = require('schema_dsl_common')



function String(value, path)
    path = path or {}
    if value == nil then
        return nil
    end
    if not types.is_string(value) then
        error(common.get_message(path, 'Should be a string'))
    end
    return value
end


function Integer(value, path)
    path = path or {}
    if value == nil then
        return nil
    end
    if not types.is_integer(value) then
        error(common.get_message(path, 'Should be an integer'))
    end
    return value
end


function Boolean(value, path)
    path = path or {}
    if value == nil then
        return nil
    end
    if not types.is_boolean(value) then
        error(common.get_message(path, 'Should be a boolean'))
    end
    return value
end

local function validate_StringMap(value, path)
    if not types.is_dict(value) then
        error(common.get_message(path, 'Should be an object'))
    end
    for k, v in pairs(value) do
        if not types.is_string(v) then
            error(common.get_message(common.table_append(path, k), 'Should be a string'))
        end
    end
end


function StringMap(value, path)
    path = path or {}
    if value == nil then
        return nil
    end
    validate_StringMap(value, path)
    return value
end


FieldClass = {}


function FieldClass:new (o)
    o = o or {}
    setmetatable(o, self)
    self.__index = self
    return o
end


function FieldClass:init(name, field_type, filters)
    self.name = name
    self.field_type = field_type
    self.filters = filters
end


function FieldClass:get_name()
    return self.name
end


function FieldClass:filter(input_object)
    result = input_object
    for k, v in ipairs(self.filters) do
        result = v(result, self.path)
    end
    return result
end


function FieldClass:process(parent, input_object)
    self.path = common.table_append(parent, self.name)
    local result = self.field_type(input_object, self.path)
    return self:filter(result)
end


ObjectClass = {}


function ObjectClass:new (o)
    o = o or {}
    setmetatable(o, self)
    self.__index = self
    return o
end


function ObjectClass:init(fields)
    self.fields = fields
    self.path = nil
    self.field_name_set = set:new()
    for _, field in ipairs(fields) do
        self.field_name_set:add(field:get_name())
    end
end


function ObjectClass:get_unrecognized_message(diff)
    if table.getn(diff) == 1 then
        return 'Unrecognized field: '..diff[1]
    end
    return 'Unrecognized fields: '..table.concat(diff, ', ')
end


function ObjectClass:check_redundancy(input_object)
    diff = {}
    for k, v in pairs(input_object) do
        if not self.field_name_set:contains(k) then
            table.insert(diff)
        end
    end
    if table.getn(diff) > 0 then
        msg = self:get_unrecognized_message(diff)
        error(common.get_message(self.path, msg))
    end
end


function ObjectClass:validate(input_object)
    if input_object == nil then
        return
    end
    if not types.is_dict(input_object) then
        error(common.get_message(self.path, 'Should be an object'))
    end
    self:check_redundancy(input_object)
end


function ObjectClass:__call(input_object, path)
    self.path = path or {}
    self:validate(input_object)
    if input_object == nil then
        return nil
    end
    return self:collect_result(input_object)
end


function ObjectClass:collect_result(input_object)
    local result = {}
    for _, field in ipairs(self.fields) do
        field_name = field:get_name()
        if input_object[field_name] ~= nil then
            result[field_name] = field:process(self.path, input_object[field_name])
        else
            result[field_name] = field:process(self.path, nil)
        end
    end
    return result
end


ArrayClass = {}


function ArrayClass:new (o)
    local o = o or {}
    setmetatable(o, self)
    self.__index = self
    return o
end


function ArrayClass:init(element_type, filters)
    self.element_type = element_type
    self.filters = filters
end


function ArrayClass:validate(input_object)
    if input_object == nil then
        return
    end
    if not types.is_array(input_object) then
        error(common.get_message(self.path, 'Should be an array'))
    end
end


function ArrayClass:__call(input_object, path)
    self.path = path or {}
    self:validate(input_object)
    if input_object == nil then
        return nil
    end
    local result = self:collect_result(input_object)
    return result
end


function ArrayClass:filter(input_object, index)
    local result = input_object[index]
    local element_path = common.table_append(self.path, tostring(index))
    result = self.element_type(result, element_path)
    for _, f in ipairs(self.filters) do
        result = f(result, element_path)
    end
    return result
end


function ArrayClass:collect_result(input_object)
    local result = {}
    for index, value in ipairs(input_object) do
        result[index] = self:filter(input_object, index)
    end
    return result
end


function Field(name, field_type, ...)
    o = FieldClass:new()
    o:init(name, field_type, arg)
    return o
end


function Object(...)
    o = ObjectClass:new()
    o:init(arg)
    return o
end


function Array(element_type, ...)
    o = ArrayClass:new()
    o:init(element_type, arg)
    return o
end
