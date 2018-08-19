luaunit = require('luaunit')

require('json_schema_dsl')
require('filters')

schema1 = Object(
    Field('node', String, max_length(6)),
    Field('user', Array(String, max_length(6))),
    Field('tag', Object(Field('name', String, max_length(4)),
                        Field('level', Integer, range(0, 3))
                        )),
    Field('event', Array(Object(Field('name', String, max_length(3)),
                                Field('alarm', Boolean)
                                )))
)

schema3 = Object(
    Field('node', String, not_null, max_length(4))
)

schema4 = Array(Object(
    Field('arrayOfObject', String, not_null, max_length(4))
))

schema5 = Object(
    Field('node', String),
    Field('event_id', Array(Integer), not_null)
)

schema6 = Object(
    Field('name', String),
    Field('spec', StringMap, not_null)
)

ROOT = {'root'}

tests = {}


function tests:test_simple_type_mismatch()
    local data1 = {node=5}
    luaunit.assertError(schema1, data1)
end


function tests:test_array_type_match()
    local data2 = {user={'abc', 'def', 'xxxxxx'}}
    local expected2 = {user={'abc', 'def', 'xxxxxx'}}
    local result = schema1(data2)
    luaunit.assertEquals(result, expected2)
end


function tests:test_array_type_mismatch()
    local date3 = {user = {'abc', 5, 'xxxxxxx'}}
    local result = schema1(data3)
end


function tests:test_too_big_mismatch()
    local data4 = {tag = {name = 'abc', level = 4}}
    luaunit.assertError(schema1, data4)
end


function tests:test_object_type_mismatch()
    local data4 = {tag = 'abc'}
    luaunit.assertError(schema1, data4)
end


function tests:test_object_type_match()
    local data5 = {tag = {name = 'abc'}}
    local result = schema1(data5)
    luaunit.assertEquals(data5, result)
end


function tests:test_array_element_too_long()
    local data6 = {event={{name='abcd', alarm=true}, {name='def', alarm=false}}}
    luaunit.assertError(schema1, data6)
end


function tests:test_array_object_type_match()
    local data7 = {event={{name='abc'}, {alarm=true}}}
    local result = schema1(data7)
    luaunit.assertEquals(data7, result)
end


function tests:test_not_null()
    local data10 = {}
    luaunit.assertError(schema3, data10)
end


function tests:test_two_filters()
    local data11 = {}
    luaunit.assertError(schema3, data11, ROOT)
end


function tests:test_too_many_fields()
    local data12 = {node='abcd', xxx=6}
    luaunit.assertError(schema3, data12)
end


function tests:test_array_of_object()
    local data13 = {{arrayOfObject='def'}, {arrayOfObject='abcde'}}
    luaunit.assertError(schema4, data13)
end


function tests:test_empty_array()
    local data14 = {node='abc'}
    luaunit.assertError(schema5, data14)
end


function tests:test_map_type()
    local data15 = {name='abc', spec='def'}
    luaunit.assertError(schema6, data15)
end


function tests:test_map_field_type()
    local data16 = {name='abc', spec={def=1, size='xyz'}}
    luaunit.assertError(schema6, data16)
end


function tests:test_good_map()
    local data17 = {name='abc', spec={def='1', size='xyz'}}
    local result = schema6(data17)
    luaunit.assertEquals(data17, result)
end


luaunit.LuaUnit.run()