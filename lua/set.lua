set = {}


function set:new (o)
    o = o or {}
    setmetatable(o, self)
    self.__index = self
    o.data_set = {}
    return o
end


function set:add(key)
    self.data_set[key] = true
end


function set:remove(key)
    self.data_set[key] = nil
end


function set:contains(key)
    return self.data_set[key] ~= nil
end


return set