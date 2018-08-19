local function table_is_empty(t)
    if type(t) ~= 'table' then
        return false
    end
    return next(t) == nil
end


local function table_clone(t)
    return {unpack(t)}
end


local function table_append(t, value)
    copy = table_clone(t)
    table.insert(copy, value)
    return copy
end



local function get_path_string(path)
    if table_is_empty(path) then
        return ''
    end
    return table.concat(path, '.')
end
    

local function get_message(path, msg)
    return get_path_string(path)..': '..msg
end


local function trim(s)
  return (s:gsub("^%s*(.-)%s*$", "%1"))
end

return {get_message=get_message, trim=trim, table_append=table_append}