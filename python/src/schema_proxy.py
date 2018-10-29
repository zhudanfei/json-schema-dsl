import schema_getter
import schema_setter


class Proxy:
    def __init__(self, target, schema_object, path=None):
        self._TARGET_ = target
        self._SCHEMA_OBJECT_ = schema_object
        self._PATH_ = path or []

    def __getattr__(self, name):
        return Proxy(self._TARGET_, self._SCHEMA_OBJECT_, self._PATH_ + [name])

    def __getitem__(self, key):
        return Proxy(self._TARGET_, self._SCHEMA_OBJECT_, self._PATH_ + [key])

    def _GET_(self):
        return schema_getter.getter(self._SCHEMA_OBJECT_, self._PATH_, self._TARGET_)

    def _SET_(self, value):
        schema_setter.setter(self._SCHEMA_OBJECT_, self._PATH_, self._TARGET_, value)

