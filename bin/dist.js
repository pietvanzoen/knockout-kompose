/*eslint no-console: 0*/
'use strict';

var fs = require('fs');
var uglifyjs = require('uglify-js');
var pkg = require('./../package.json');

var files = {
  src: './src/kompose.js',
  dist: './dist/kompose.js',
  distMin: './dist/kompose.min.js'
};
var uglifyOptions = {
  sourceMap: false,
  output: {
    comments: require('uglify-save-license')
  }
};

fs.readFile(files.src, 'utf8', function (err,data) {
  if (err) { return console.log(err); }
  var versionBumpedCode = updateVersion(data);
  writeFile(files.src, versionBumpedCode, function () {
    console.log('Version updated.');
    writeFile(files.dist, versionBumpedCode);
    writeFile(files.distMin, uglifyjs.minify(files.src, uglifyOptions).code);
  });
});

function updateVersion(data) {
  return data.replace(/(@version )\d\.\d\.\d\d?/, '$1' + pkg.version);
}

function writeFile(dest, code, callback) {
  fs.writeFile(dest, code, 'utf-8', function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('Wrote ' + dest);
    if (callback) {
      callback();
    }
  });
}
