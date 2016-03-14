'use strict';

var fs = require('fs');
var docdown = require('docdown');

var markdown = docdown({
  'path': './src/kodash.js',
  'url': 'https://github.com/pietvanzoen/kodash/blob/master/kodash.js'
});

fs.writeFile('./doc/README.md', markdown, 'utf-8', function(err) {
  if(err) {
    return console.error(err);
  }
  console.log('Docs updated.');
});
