'use strict';

var fs = require('fs');
var uglifyjs = require('uglify-js');

var src = './src/kodash.js';
var uglifyOptions = {
  sourceMap: false,
  output: {
    comments: require('uglify-save-license')
  }
};

writeFile('./dist/kodash.min.js', uglifyjs.minify(src, uglifyOptions).code);
writeFile('./dist/kodash.js', fs.readFileSync(src, 'utf-8'));

function writeFile(dest, code) {
  fs.writeFile(dest, code, 'utf-8', function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('Wrote ' + dest);
  });
}
