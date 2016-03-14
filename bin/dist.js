'use strict';

var fs = require('fs');
var uglifyjs = require('uglify-js');

var src = './src/kompose.js';
var uglifyOptions = {
  sourceMap: false,
  output: {
    comments: require('uglify-save-license')
  }
};

writeFile('./dist/kompose.min.js', uglifyjs.minify(src, uglifyOptions).code);
writeFile('./dist/kompose.js', fs.readFileSync(src, 'utf-8'));

function writeFile(dest, code) {
  fs.writeFile(dest, code, 'utf-8', function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('Wrote ' + dest);
  });
}
