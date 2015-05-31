'use strict';

import debug from 'debug';

export default (imagePath) => {
  if (__BROWSER) {
    debug('dev')('`image-resolver` should not be used in browser, something went wrong');
    throw new Error('image-resolver called on browser');
  }
  else {
    // Load images compiled from `webpack-stats`
    // don't cache the `webpack-stats.json` on dev
    // so we gonna read the file on each request
    let images;
    if (__DEBUG) {
      const fs = require('fs');
      const path = require('path');
      images = fs.readFileSync(path.resolve(__dirname, '../../server/webpack-stats.json'));
      images = JSON.parse(images).images;
    }
    // on production, use simple `require` to cache the file
    else {
      images = require('../../server/webpack-stats.json').images;
    }

    // Find the correct image
    const regex = new RegExp(`${imagePath}$`);
    const image = images.find(img => regex.test(img.original));

    if (image) {
      return image.compiled;
    }
    else {
      // Serve a not-found asset maybe?
      return '';
    }
  }
};
