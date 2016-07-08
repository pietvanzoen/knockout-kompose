var test = require('tape');
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

  var obj2 = [{ a: ko.observableArray(['foo', 'bar'])}];
  t.same(kp.get(obj2, '[0].a.[1]'), 'bar',
    'it correctly parses array paths at beginning and end of path');

  t.same(kp.get(obj, '.b....c..0..'), 2,
    'it ignores excess periods');

  t.same(kp.get(ko.observable(null), 'foo.bar'), undefined,
    'it is undefined if `object` is wrapped null');

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

test('kp.computedApply', function computedApply(t) {

  t.ok(ko.isPureComputed(kp.computedApply()),
    'it returns a pure computed observable');

  var name = ko.observable('Ron');
  var nameComputed = kp.computedApply(name);
  t.same(nameComputed(), 'Ron',
    'it can be given an observable that is unwrapped when the computed is invoked');

  name('Leslie');
  t.same(nameComputed(), 'Leslie',
    'it returns the latest value of the given observable');

  var names = ko.observableArray(['Ronald', 'Ulysses']);
  function joinWords(wordArray) {
    return wordArray.join(' ');
  }
  var fullNameComputed = kp.computedApply(names, joinWords);
  t.same(fullNameComputed(), 'Ronald Ulysses',
    'it applies a given function to the unwrapped observable');

  names.push('Swanson');
  t.same(fullNameComputed(), 'Ronald Ulysses Swanson',
    'it applies the given function to the unwrapped observable on changes');

  var wordsModule = {
    delimiter: ' ',
    join: function (wordsArray) {
      return wordsArray.join(this.delimiter);
    }
  };
  var words = ko.observableArray(['foo', 'bar', 'baz']);
  var sentenceComputed = kp.computedApply(words, wordsModule.join, wordsModule);
  t.same(sentenceComputed(), 'foo bar baz',
    'it applies the given context to the function');

  t.end();
});

test('kp.computedMap', function computedMap(t) {

  t.ok(ko.isPureComputed(kp.computedMap()),
    'it returns a pure computed observable');

  var numberwangs = ko.observableArray([1, 22, 7, 9]);
  var numberwangComputed = kp.computedMap(numberwangs);
  t.looseEqual(numberwangComputed(), [1, 22, 7, 9],
    'it can be given an observableArray that is unwrapped when the computed is invoked');

  numberwangs.push(109876567);
  t.looseEqual(numberwangComputed(), [1, 22, 7, 9, 109876567],
    'it returns the latest value of the given observableArray');

  var nums = ko.observableArray([1, 2, 3]);
  function double(n) {
    return n * 2;
  }
  var doubleNumsComputed = kp.computedMap(nums, double);
  t.looseEqual(doubleNumsComputed(), [2, 4, 6],
    'it applies a given iteratee to the unwrapped observableArray');

  var math = {
    addNum: 2,
    add: function (n) {
      return n + this.addNum;
    }
  };
  var numsAddTwoComputed = kp.computedMap(nums, math.add, math);
  t.looseEquals(numsAddTwoComputed(), [3, 4, 5],
    'it applies the given context to the iteratee');

  var users = ko.observableArray([
    { name: 'Jake', age: ko.observable({ years: 31, months: 5 }) },
    { name: 'Finn', age: ko.observable({ years: 14, months: 2 }) },
    { name: 'BMO', age: ko.observable({ years: 6, months: 11 }) }
  ]);
  var userAgeYearsComputed = kp.computedMap(users, 'age.years');
  t.looseEquals(userAgeYearsComputed(), [31, 14, 6],
    'it fetches given object properties when passed a string path as an iteratee');

  var userAgeMonthsComputed = kp.computedMap(users, ['age', 'months']);
  t.looseEquals(userAgeMonthsComputed(), [5, 2, 11],
    'it fetches given object properties when passed a array path as an iteratee');

  t.end();
});
