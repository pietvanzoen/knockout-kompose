/**
 * Kompose - Functional composition helpers for knockout
 * (c) 2016 Piet van Zoen - http://github.com/pietvanzoen/knockout-kompose
 * @version 0.1.3
 * @license MIT (http://www.opensource.org/licenses/mit-license.php)
 */
;(function(root, factory) { //eslint-disable-line no-extra-semi
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['knockout'], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory(require('knockout'));
  } else {
    // Browser globals (root is window)
    root.kp = factory(root.ko);
  }
}(this, function(ko) {

  var __slice = Array.prototype.slice;

  /**
   * Create an array of path arguments.
   * @private
   * @param {Array|String} path
   * @returns {Array}
   */
  function toPath(path) {
    if (typeof path === 'object') {
      return path;
    }
    path = (path || '').
      replace(/\[(\d+)]/g, '.$1'). // remove braces and ensure period before indexes
      replace(/\.+/g, '.'). // reduce multiple periods to single
      replace(/(^\.|\.$)/g, ''); // trim left/right periods
    return path.split('.');
  }

  /**
   * Invoke the method at the given `path` with the correct context and applying
   * the given arguments array. Unwraps any observables along the path.
   * @private
   * @param {Object} object Object to query.
   * @param {Array|String} path The path of the method to invoke.
   * @param {Array} [args] Array of arguments to apply to method.
   * @returns {*}
   */
  function invokePath(object, path, args) {
    if (object != null && !object.hasOwnProperty(path)) {
      path = toPath(path);
      object = path.length == 1 ? object : get(object, path.slice(0, -1));
      path = path[path.length - 1];
    }
    var func = object == null ? object : object[path];
    return func == null ? undefined : func.apply(object, args);
  }

  /**
   * Map `array` with `iteratee` function.
   * @private
   * @param {Array} array Array to map.
   * @param {Function} iteratee Iteratee function to apply to each array value.
   * @returns {Array} Array of mapped values.
   */
  function arrayMap(array, iteratee) {
    var index = -1;
    var length = array.length;
    var result = Array(length);
    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }


  /** @namespace */
  var kp = {};

  /**
   * Get a value from the given `object` and `path`. Unwraps any observables
   * along the path. Optionally pass a `defaultValue` if `path` is not available.
   * @static
   * @memberOf kp
   * @param {Object} object Object to query.
   * @param {Array|String} path Path in object to retrieve value from.
   * @param {*} [defaultValue] A default value to return if `path` is not available.
   * @returns {*} Value at `path` or `defaultValue`.
   * @example
   * var object = ko.observable({
   *   a: { b: ko.observable('c') }
   * })
   *
   * kp.get(object, 'a.b');
   * // => 'c'
   *
   * kp.get(object, 'foo.bar', 'wibble');
   * // => 'wibble'
   */
  function get(object, path, defaultValue) {
    var parts = toPath(path);
    var index = 0;
    var length = parts.length;
    object = ko.unwrap(object);
    while (object && index < length) {
      object = ko.unwrap(ko.unwrap(object)[parts[index]]);
      index += 1;
    }
    return (index == length && object !== undefined) ? object : defaultValue;
  }

  /**
   * Creates a function that returns the value at the given `path`, unwrapping
   * any observables along the way.
   * @static
   * @memberOf kp
   * @param {Array|String} path The path of the property to get.
   * @returns {Function} Returns a new function.
   * @example
   * var puppy = { name: ko.observable('Django') };
   * var getName = kp.property('name');
   * getName(puppy);
   * // => 'Django'
   *
   * var puppies = ko.observableArray([
   *   { name: ko.observable('Django'), age: ko.observable({ years: 4, months: 2 }) },
   *   { name: ko.observable('Henry'), age: ko.observable({ years: 2, months: 6 }) }
   * ]);
   * _.map(puppies, kp.property('age.years'));
   * // => [4, 2]
   */
  function property(path) {
    return function (obj) {
      return get(obj, path);
    };
  }

  /**
   * Creates a function that tests if the value at `path` is the same as the given
   * value. By default it uses `===` equality. A custom matcher function can be
   * given. Any observables along the path are unwrapped.
   * @static
   * @memberOf kp
   * @param {Array|String} path Path in object to test.
   * @param {*} matchValue Value to match with retrieved value.
   * @param {Function} [customMatcher] A custom matcher function that receives two values to match.
   * @returns {Function} Returns a new function.
   * @example
   * var hikers = [
   *   {
   *     name: ko.observable('Ford Prefect'),
   *     age: ko.observable(200)
   *   },
   *   {
   *     name: ko.observable('Arthur Dent'),
   *     age: ko.observable(31)
   *   },
   * ];
   * _.find(hikers, kp.matchesProperty('age', 200));
   * // => { name: ko.observable('Ford Prefect'), age: ko.observable(200) };
   *
   * var obj = { foo: ko.observable({ bar: 'baz' }) };
   * kp.matchesProperty('foo', { bar: 'baz' }, _.isEqual)(obj);
   * // => true
   */
  function matchesProperty(path, matchValue, customMatcher) {
    var matcher = customMatcher || function (a, b) { return a === b; };
    return function (object) {
      return matcher(get(object, path), matchValue);
    };
  }

  /**
   * Creates a function that invokes the method at `path` with the given `args`.
   * Unwraps any observables along the path.
   * @static
   * @memberOf kp
   * @param {Array|String} path The path of the method.
   * @param {...*} [args] Zero or more arguments to apply to the method.
   * @returns {Function} Returns a new function.
   * @example
   * var objects = [
   *   { a: ko.observable({ b: function (val) { return val + 1; } }) },
   *   { a: ko.observable({ b: function (val) { return val + 2; } }) },
   * ];
   * _.map(objects, kp.method('a.b', 2));
   * // => [3, 4]
   */
  function method(path, args) {
    var restArgs = __slice.call(arguments, 1);
    return function (object) {
      return invokePath(object, path, restArgs);
    };
  }

  /**
   * Creates a pureComputed that unwraps and applies the given `observable` to
   * the given `func`. A `thisArg` can be given which is set as the `this` binding
   * for `func`. If `func` is not given, computed returns unwrapped `observable` value.
   * @static
   * @memberOf kp
   * @param {ko.observable} observable The observable to apply. This can be any type of knockout observable.
   * @param {Function} [func] Function to receive unwrapped observable.
   * @param {Object} [thisArg] The `this` binding of `func`.
   * @returns {Function} A pure computed observable.
   * @example
   * function toUpper(string) {
   *   return string.toUpperCase();
   * }
   * var speak = ko.observable('Hello');
   * var shoutComputed = kp.computedApply(speak, toUpper);
   * shoutComputed()
   * // => 'HELLO'
   * speak('Hello world');
   * shoutComputed();
   * // => 'HELLO WORLD'
   */
  function computedApply(observable, func, thisArg) {
    return ko.pureComputed(function () {
      var value = ko.unwrap(observable);
      return !func ? value : func.call(thisArg, value);
    });
  }

  /**
   * Creates a pureComputed that unwraps and maps the given `observableArray`
   * with the given `iteratee` function. If `iteratee` is a string it is treated
   * as a `kp.property` string.
   * @static
   * @memberOf kp
   * @param {ko.observableArray} observableArray The observableArray to iterate over.
   * @param {Function|Array|String} [iteratee] A function to iterate with, or a string or array property path.
   * @param {Object} [thisArg] The `this` binding of `iteratee`.
   * @returns {Function} A pure computed observable.
   * @example
   * function double(n) {
   *   return n * n;
   * }
   * var nums = ko.observableArray([1, 2, 3]);
   * var doubleComputed = kp.computedMap(nums, double);
   * doubleComputed();
   * // => [2, 4, 6]
   * nums.push(4);
   * doubleComputed();
   * // => [2, 4, 6, 8]
   *
   * var users = ko.observableArray([
   *   { name: 'Jake', age: ko.observable({ years: 31, months: 5 }) },
   *   { name: 'Finn', age: ko.observable({ years: 14, months: 2 }) }
   * ]);
   * var userAgeYearsComputed = kp.computedMap(users, 'age.years');
   * userAgeYearsComputed();
   * // => [31, 14]
   */
  function computedMap(observableArray, iteratee, thisArg) {
    var func;
    if (typeof iteratee == 'function') {
      func = function () { return iteratee.apply(thisArg, arguments); };
    } else if (iteratee != null) {
      func = property(iteratee);
    }
    return ko.pureComputed(function () {
      var value = ko.unwrap(observableArray);
      return !func ? value : arrayMap(value, func);
    });
  }

  // Map functions to kp object
  kp.get = get;
  kp.property = property;
  kp.matchesProperty = matchesProperty;
  kp.method = method;
  kp.computedApply = computedApply;
  kp.computedMap = computedMap;

  return kp;

}));
