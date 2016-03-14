'use strict';

var fs = require('fs');
var docdown = require('docdown');

var markdown = docdown({
  'path': './src/kompose.js',
  'url': 'https://github.com/pietvanzoen/knockout-kompose/blob/master/src/kompose.js'
});

fs.writeFile('./doc/README.md', markdown, 'utf-8', function(err) {
  if(err) {
    return console.error(err);
  }
  console.log('Docs updated.');
});
