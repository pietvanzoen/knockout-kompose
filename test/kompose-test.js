var test = require('tape-catch');
var ko = require('knockout');
var kp = require('./../src/kompose.js');

test('kp.get', function get(t) {

  var obj = { a: ko.observable(1), b: { c: [ko.observable(2)] } };

  t.same(kp.get(obj, 'a'), 1,
    'returns the value of the given property');

  t.same(kp.get(obj, 'b.c.0'), 2,
    'returns the value of the property at the given path and invokes any observables');

  t.same(kp.get(obj, ['b', 'c', 0]), 2,
    'path can be an array');

  var longArrayObj = {a: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]};
  t.same(kp.get(longArrayObj, 'a.[1]'), 2,
    'array indexes can be inside brackets after a period');

  t.same(kp.get(longArrayObj, 'a[1]'), 2,
    'array indexes can be inside brackets without a preceding period');

  t.same(kp.get(longArrayObj, 'a[10]'), 11,
    'array indexes can be multiple digits');

  t.same(kp.get({'he[]o': 5}, 'he[]o'), 5,
    'does not senselessly remove all brackets');

  t.same(kp.get(obj, 'foo.bar', 'wibble'), 'wibble',
    'returns defaultValue if path is not available');

  t.same(kp.get(obj, 'foo', 'wibble'), 'wibble',
    'returns defaultValue if single depth path is not available');

  t.same(kp.get(obj, 'foo.bar'), undefined,
    'it returns undefined if path is not available and defaultValue is not set');

  t.same(kp.get(obj), undefined,
    'it returns undefined if path is not set');

  t.same(kp.get(obj, 'a.toString.name'), 'toString',
    'it returns value at path for language level objects');

  t.end();
});

test('kp.property', function property(t) {
  var obj = { a: ko.observable({ b: 2 })};

  t.same(typeof kp.property('a.b'), 'function',
    'takes a path and returns a function');

  t.same(kp.property('a.b')(obj), 2,
    'when invoked with an object it returns the value at the path');

  t.end();
});

test('kp.matchesProperty', function matchesProperty(t) {

  var obj = { a: ko.observable({ b: 'c' })};

  t.same(typeof kp.matchesProperty('foo', 'bar'), 'function',
    'takes a path and a value and returns a function');

  t.same(kp.matchesProperty('a.b', 'c')(obj), true,
    'function returns true if value at path matches given value');

  t.same(kp.matchesProperty('a.b', 'foo')(obj), false,
    'function returns false if value at path does not matches given value');

  obj.number = ko.observable(1);
  var looseMatcher = function (a, b) { return a == b; };
  t.same(kp.matchesProperty('number', '1', looseMatcher)(obj), true,
    'can be given custom matcher');

  t.end();
});

test('kp.method', function method(t) {

  function Person(first, last) {
    this.firstName = first;
    this.lastName = last;
  }
  Person.prototype.fullName = function () {
    return [this.firstName, this.lastName].join(' ');
  };
  Person.prototype.update = function (first, last) {
    this.firstName = first;
    this.lastName = last;
  };

  t.same(typeof kp.method('foo'), 'function',
    'takes a path and returns a function');

  var president = new Person('Frank', 'Underwood');
  var whitehouse = ko.observable({ president: ko.observable(president)});

  t.same(kp.method('president.fullName')(whitehouse), 'Frank Underwood',
    'invokes the method at the path and maintains the correct context');

  kp.method('president.update', 'claire', 'underwood')(whitehouse);
  t.same(president.fullName(), 'claire underwood',
    'invokes the method with the given arguments');

  t.end();
});
