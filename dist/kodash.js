/**
 * Kodash - knockout functional utility library v0.0.1
 * (c) 2016 Piet van Zoen - http://github.com/pietvanzoen/kodash
 * @license MIT (http://www.opensource.org/licenses/mit-license.php)
 */
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['knockout'], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory(require('knockout'));
  } else {
    // Browser globals (root is window)
    root.kd = factory(root.ko);
  }
}(this, function(ko) {

  /** @namespace */
  var kd = {};

  /**
   * Create an array of path arguments.
   * @private
   * @param {Array|String} path
   * @return {Array}
   */
  function toPath(path) {
    if (typeof path === 'object') {
      return path;
    }
    path = (path || '').replace(/\.?\[(\d+)]/g, '.$1');
    return path.split('.');
  }

  /**
   * Get a value from the given `object` and `path`. Unwraps any observables
   * along the path. Optionally pass a `defaultValue` if `path` is not available.
   * @memberOf kd
   * @alias get
   * @param {Object} object  Object to query.
   * @param {Array|String} path  Path in object to retrieve value from.
   * @param {*} [defaultValue]  A default value to return if `path` is not available.
   * @return {*}  Value at `path` or `defaultValue`.
   * @example
   * var object = ko.observable({
   *   a: { b: ko.observable('c') }
   * })
   *
   * kd.pluck(object, 'a.b');
   * // => 'c'
   *
   * kd.pluck(object, 'foo.bar', 'wibble');
   * // => 'wibble'
   */
  function pluck(object, path, defaultValue) {
    var parts = toPath(path);
    var index = 0;
    var length = parts.length;
    while (object && index < length) {
      object = ko.unwrap(ko.unwrap(object)[parts[index]]);
      index += 1;
    }
    return (index == length && object !== undefined) ? object : defaultValue;
  }

  /**
   * Creates a function that returns the value at the given `path`, unwrapping
   * any observables along the way.
   * @alias property
   * @memberOf kd
   * @param {Array|String} path The path of the property to get.
   * @return {Function}
   */
  function pluckWith(path) {
    return function (obj) {
      return pluck(obj, path);
    }
  }

  // Map functions to kd object
  kd.pluck = pluck;
  kd.pluckWith = pluckWith;

  // Aliases
  kd.get = pluck;
  kd.property = pluckWith;

  return kd;

}));
