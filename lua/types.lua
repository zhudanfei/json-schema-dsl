local function is_string(value)
    return type(value) == 'string'
end


local function is_integer(value)
    if type(value) ~= 'number' then
        return false
    end
    return value == math.floor(value)
end


local function is_boolean(value)
    return type(value) == 'boolean'
end


local function is_array(t)
    if type(t) ~= 'table' then
        return false
    end
    k, v = next(t)
    return is_integer(k)
end


local function is_dict(t)
    if type(t) ~= 'table' then
        return false
    end
    k, v = next(t)
    return is_string(k)
end


return {is_string=is_string, is_integer=is_integer, is_boolean=is_boolean,
is_array=is_array, is_dict=is_dict}