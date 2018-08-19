common = require('schema_dsl_common')
set = require('set')

PATTERN1 = '(%d%d%d%d)%-(%d%d)%-(%d%d)T(%d%d):(%d%d):(%d%d)%.(%d%d%d)Z'
PATTERN2 = '(%d%d%d%d)%-(%d%d)%-(%d%d)T(%d%d):(%d%d):(%d%d)%.(%d%d%d)%d%d%dZ'


local function get_time_table(value, path)
    start, _, year, month, day, hour, minute, second, millisecond =string.find(s, PATTERN1)
    if start == nil then
        start, _, year, month, day, hour, minute, second, millisecond =string.find(s, PATTERN2)
    end
    if start == nil then
        error(common.get_message(path, 'Invalid value'))
    end
    return {year=year, month=month, day=day, hour=hour, minute=minute, millisecond=millisecond}
end


function to_timestamp(value, path)
    if value == nil then
        return nil
    end
    dt = get_time_table(value, path)
    epoch_seconds = os.time(dt)
    return epoch_seconds * 1000 + dt.millisecond
end


function not_null(value, path)
    if value == nil then
        error(common.get_message(path, 'Cannot be null'))
    end
    return value
end


function trim(value, path)
    if value == nil then
        return nil
    end
    return common.trim(value)
end


function max_length(length)
    return function(value, path)
        if value == nil then
            return nil
        end
        if string.len(value) > length then
            error(common.get_message(path, 'String is too long'))
        end
        return value
    end
end


function min_length(length)
    return function(value, path)
        if value == nil then
            return nil
        end
        if string.len(value) < length then
            error(common.get_message(path, 'String is too short'))
        end
        return value
    end
end


function length_range(low, high)
    return function(value, path)
        if value == nil then
            return nil
        end
        if string.len(value) < low then
            error(common.get_message(path, 'String is too short'))
        end
        if string.len(value) > high then
            error(common.get_message(path, 'String is too long'))
        end
        return value
    end
end


function only(...)
    option_set = set:new()
    for _, option in ipairs(arg) do
        option_set:add(option)
    end
    return function(value, path)
        if value == nil then
            return nil
        end
        if not option_set.contains(value) then
            error(common.get_message(path, 'Invalid value'))
        end
        return value
    end
end


function range(low, high)
    return function(value, path)
        if value == nil then
            return nil
        end
        if value < low then
            error(common.get_message(path, 'Value is too small'))
        end
        if value > high then
            error(common.get_message(path, 'Value is too large'))
        end
        return value
    end
end
            