# kompose.js v0.1.0 API Documentation

<!-- div class="toc-container" -->

<!-- div -->

## `kp`
* <a href="#kp-computedApply">`kp.computedApply`</a>
* <a href="#kp-computedMap">`kp.computedMap`</a>
* <a href="#kp-get">`kp.get`</a>
* <a href="#kp-matchesProperty">`kp.matchesProperty`</a>
* <a href="#kp-method">`kp.method`</a>
* <a href="#kp-property">`kp.property`</a>

<!-- /div -->

<!-- /div -->

<!-- div class="doc-container" -->

<!-- div -->

## `kp`

<!-- div -->

### <a id="kp-computedApply"></a>`kp.computedApply(observable, [func], [thisArg])`
<a href="#kp-computedApply">#</a> [&#x24C8;](https://github.com/pietvanzoen/knockout-kompose/blob/master/src/kompose.js#L213 "View in source") [&#x24C9;][1]

Creates a pureComputed that unwraps and applies the given `observable` to
the given `func`. An `owner` can be given which is set as the context for
`func`. If `func` is not given, computed returns unwrapped `observable` value.

#### Arguments
1. `observable` *(ko.observable)*: The observable to apply. This can be any type of knockout observable.
2. `[func]` *(Function)*: Function to receive unwrapped observable.
3. `[thisArg]` *(Object)*: The `this` binding of `func`.

#### Returns
*(Function)*:  A pure computed observable.

#### Example
```js
function toUpper(string) {
  return string.toUpperCase();
}
var speak = ko.observable('Hello');
var shoutComputed = kp.computedApply(speak, toUpper);
shoutComputed()
// => 'HELLO'
speak('Hello world');
shoutComputed();
// => 'HELLO WORLD'
```
* * *

<!-- /div -->

<!-- div -->

### <a id="kp-computedMap"></a>`kp.computedMap(observableArray, [iteratee], [thisArg])`
<a href="#kp-computedMap">#</a> [&#x24C8;](https://github.com/pietvanzoen/knockout-kompose/blob/master/src/kompose.js#L250 "View in source") [&#x24C9;][1]

Creates a pureComputed that unwraps and maps the given `observableArray`
with the given `iteratee` function. If `iteratee` is a string it is treated
as a `kp.property` string.

#### Arguments
1. `observableArray` *(ko.observableArray)*: The observableArray to iterate over.
2. `[iteratee]` *(Function|Array|String)*: A function to iterate with, or a string or array property path.
3. `[thisArg]` *(Object)*: The `this` binding of `iteratee`.

#### Returns
*(Function)*:  A pure computed observable.

#### Example
```js
function double(n) {
  return n * n;
}
var nums = ko.observableArray([1, 2, 3]);
var doubleComputed = kp.computedMap(nums, double);
doubleComputed();
// => [2, 4, 6]
nums.push(4);
doubleComputed();
// => [2, 4, 6, 8]

var users = ko.observableArray([
  { name: 'Jake', age: ko.observable({ years: 31, months: 5 }) },
  { name: 'Finn', age: ko.observable({ years: 14, months: 2 }) }
]);
var userAgeYearsComputed = kp.computedMap(users, 'age.years');
userAgeYearsComputed();
// => [31, 14]
```
* * *

<!-- /div -->

<!-- div -->

### <a id="kp-get"></a>`kp.get(object, path, [defaultValue])`
<a href="#kp-get">#</a> [&#x24C8;](https://github.com/pietvanzoen/knockout-kompose/blob/master/src/kompose.js#L96 "View in source") [&#x24C9;][1]

Get a value from the given `object` and `path`. Unwraps any observables
along the path. Optionally pass a `defaultValue` if `path` is not available.

#### Arguments
1. `object` *(Object)*: Object to query.
2. `path` *(Array|String)*: Path in object to retrieve value from.
3. `[defaultValue]` *(&#42;)*: A default value to return if `path` is not available.

#### Returns
*(&#42;)*:  Value at `path` or `defaultValue`.

#### Example
```js
var object = ko.observable({
  a: { b: ko.observable('c') }
})

kp.get(object, 'a.b');
// => 'c'

kp.get(object, 'foo.bar', 'wibble');
// => 'wibble'
```
* * *

<!-- /div -->

<!-- div -->

### <a id="kp-matchesProperty"></a>`kp.matchesProperty(path, matchValue, [customMatcher])`
<a href="#kp-matchesProperty">#</a> [&#x24C8;](https://github.com/pietvanzoen/knockout-kompose/blob/master/src/kompose.js#L161 "View in source") [&#x24C9;][1]

Creates a function that tests if the value at `path` is the same as the given
value. By default it uses `===` equality. A custom matcher function can be
given. Any observables along the path are unwrapped.

#### Arguments
1. `path` *(Array|String)*: Path in object to test.
2. `matchValue` *(&#42;)*: Value to match with retrieved value.
3. `[customMatcher]` *(Function)*: A custom matcher function that receives two values to match.

#### Returns
*(Function)*:  Returns a new function.

#### Example
```js
var hikers = [
  {
    name: ko.observable('Ford Prefect'),
    age: ko.observable(200)
  },
  {
    name: ko.observable('Arthur Dent'),
    age: ko.observable(31)
  },
];
_.find(hikers, kp.matchesProperty('age', 200));
// => { name: ko.observable('Ford Prefect'), age: ko.observable(200) };

var obj = { foo: ko.observable({ bar: 'baz' }) };
kp.matchesProperty('foo', { bar: 'baz' }, _.isEqual)(obj);
// => true
```
* * *

<!-- /div -->

<!-- div -->

### <a id="kp-method"></a>`kp.method(path, [args])`
<a href="#kp-method">#</a> [&#x24C8;](https://github.com/pietvanzoen/knockout-kompose/blob/master/src/kompose.js#L184 "View in source") [&#x24C9;][1]

Creates a function that invokes the method at `path` with the given `args`.
Unwraps any observables along the path.

#### Arguments
1. `path` *(Array|String)*: The path of the method.
2. `[args]` *(...&#42;)*: Zero or more arguments to apply to the method.

#### Returns
*(Function)*:  Returns a new function.

#### Example
```js
var objects = [
  { a: ko.observable({ b: function (val) { return val + 1; } }) },
  { a: ko.observable({ b: function (val) { return val + 2; } }) },
];
_.map(objects, kp.method('a.b', 2));
// => [2, 4]
```
* * *

<!-- /div -->

<!-- div -->

### <a id="kp-property"></a>`kp.property(path)`
<a href="#kp-property">#</a> [&#x24C8;](https://github.com/pietvanzoen/knockout-kompose/blob/master/src/kompose.js#L127 "View in source") [&#x24C9;][1]

Creates a function that returns the value at the given `path`, unwrapping
any observables along the way.

#### Arguments
1. `path` *(Array|String)*: The path of the property to get.

#### Returns
*(Function)*:  Returns a new function.

#### Example
```js
var puppy = { name: ko.observable('Django') };
var getName = kp.property('name');
getName(puppy);
// => 'Django'

var puppies = ko.observableArray([
  { name: ko.observable('Django'), age: ko.observable({ years: 4, months: 2 }) },
  { name: ko.observable('Henry'), age: ko.observable({ years: 2, months: 6 }) }
]);
_.map(puppies, kp.property('age.years'));
// => [4, 2]
```
* * *

<!-- /div -->

<!-- /div -->

<!-- /div -->

 [1]: #kp "Jump back to the TOC."
