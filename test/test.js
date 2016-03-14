var test = require('tape-catch');
var ko = require('knockout');
var kd = require('./../src/kodash.js');

test('kd.pluck', function pluck(t) {

  var obj = { a: ko.observable(1), b: { c: [ko.observable(2)] } };

  t.same(kd.pluck(obj, 'a'), 1,
    'returns the value of the given property');

  t.same(kd.pluck(obj, 'b.c.0'), 2,
    'returns the value of the property at the given path and invokes any observables');

  t.same(kd.pluck(obj, ['b', 'c', 0]), 2,
    'path can be an array');

  var longArrayObj = {a: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]};
  t.same(kd.pluck(longArrayObj, 'a.[1]'), 2,
    'array indexes can be inside brackets after a period');

  t.same(kd.pluck(longArrayObj, 'a[1]'), 2,
    'array indexes can be inside brackets without a preceding period');

  t.same(kd.pluck(longArrayObj, 'a[10]'), 11,
    'array indexes can be multiple digits');

  t.same(kd.pluck({'he[]o': 5}, 'he[]o'), 5,
    'does not senselessly remove all brackets');

  t.same(kd.pluck(obj, 'foo.bar', 'wibble'), 'wibble',
    'returns defaultValue if path is not available');

  t.same(kd.pluck(obj, 'foo', 'wibble'), 'wibble',
    'returns defaultValue if single depth path is not available');

  t.same(kd.pluck(obj, 'foo.bar'), undefined,
    'it returns undefined if path is not available and defaultValue is not set');

  t.same(kd.pluck(obj), undefined,
    'it returns undefined if path is not set');

  t.same(kd.pluck(obj, 'a.toString.name'), 'toString',
    'it returns value at path for language level objects');

  t.same(kd.get, kd.pluck,
    'aliases to get');

  t.end();
});

test('kd.pluckWith', function pluckWith(t) {
  var obj = { a: ko.observable({ b: 2 })};

  t.same(typeof kd.pluckWith('a.b'), 'function',
    'takes a path and returns a function');

  t.same(kd.pluckWith('a.b')(obj), 2,
    'when invoked with an object it returns the value at the path');

  t.same(kd.property, kd.pluckWith,
    'aliases to property');

  t.end();
});
