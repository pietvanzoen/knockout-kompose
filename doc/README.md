# kodash.js API documentation

<!-- div class="toc-container" -->

<!-- div -->

## `kd`
* <a href="#kd-pluck" class="alias">`kd.get` -> `pluck`</a>
* <a href="#kd-pluck">`kd.pluck`</a>
* <a href="#kd-pluckWith">`kd.pluckWith`</a>
* <a href="#kd-pluckWith" class="alias">`kd.property` -> `pluckWith`</a>

<!-- /div -->

<!-- /div -->

<!-- div class="doc-container" -->

<!-- div -->

## `kd`

<!-- div -->

### <a id="kd-pluck"></a>`kd.pluck(object, path, [defaultValue])`
<a href="#kd-pluck">#</a> [&#x24C8;](https://github.com/pietvanzoen/kodash/blob/master/kodash.js#L55 "View in source") [&#x24C9;][1]

Get a value from the given `object` and `path`. Unwraps any observables
along the path. Optionally pass a `defaultValue` if `path` is not available.

#### Aliases
*kd.get*

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

kd.pluck(object, 'a.b');
// => 'c'

kd.pluck(object, 'foo.bar', 'wibble');
// => 'wibble'
```
* * *

<!-- /div -->

<!-- div -->

### <a id="kd-pluckWith"></a>`kd.pluckWith(path)`
<a href="#kd-pluckWith">#</a> [&#x24C8;](https://github.com/pietvanzoen/kodash/blob/master/kodash.js#L74 "View in source") [&#x24C9;][1]

Creates a function that returns the value at the given `path`, unwrapping
any observables along the way.

#### Aliases
*kd.property*

#### Arguments
1. `path` *(Array|String)*: The path of the property to get.

#### Returns
*(Function)*:

* * *

<!-- /div -->

<!-- /div -->

<!-- /div -->

 [1]: #kd "Jump back to the TOC."
