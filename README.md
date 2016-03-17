Kompose
===

[![CircleCI branch](https://img.shields.io/circleci/project/pietvanzoen/knockout-kompose/master.svg)](https://circleci.com/gh/pietvanzoen/knockout-kompose/tree/master) [![npm](https://img.shields.io/npm/v/knockout-kompose.svg)](https://www.npmjs.com/package/knockout-kompose)

Kompose makes functional composition with knockout easier by providing lodash-esk helpers that handle observables.

These helpers compliment lodash and underscore by providing alternative functions for `_.property`, `_.matchesProperty` and others like them that traverse object paths. Lodash and underscore's methods do not work when any properties in the path is observable.

Kompose's only dependency is [knockout](http://knockoutjs.com/).

## Links
* [Build](https://raw.githubusercontent.com/pietvanzoen/knockout-kompose/master/dist/kompose.js) ([minified](https://raw.githubusercontent.com/pietvanzoen/knockout-kompose/master/dist/kompose.min.js))
* [API Documentation](https://github.com/pietvanzoen/knockout-kompose/tree/master/doc)

## Example
```js
var puppies = [
  { name: ko.observable('Django'), age: ko.observable({ years: 4, months: 2 }) },
  { name: ko.observable('Henry'), age: ko.observable({ years: 2, months: 6 }) }
];
_.map(puppies, kp.property('age.years'));
// => [4, 2]
```

See more in the [docs](https://github.com/pietvanzoen/knockout-kompose/tree/master/doc).

## Contributing

Don't be shy! Submit issues (or better yet PRs) if you see anything that could be better. If you're submitting code that contains patches or features please try to include unit tests. Thanks!

## Author

Piet van Zoen <hi@pietvanzoen.com>

## License

 - **MIT** : http://opensource.org/licenses/MIT
