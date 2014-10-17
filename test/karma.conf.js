/* jshint node:true */
'use strict';

module.exports = function (config) {
  var browser = process.env.BROWSER

  config.set({
    frameworks: ['mocha', 'chai'],
    reporters: ['dots'],
    files: [
      '../whitespace.min.js',
      './**/*.spec.js'
    ],
    singleRun: true
  })

  browser = process.env.BROWSER || 'chrome'
  browser = browser[0].toUpperCase() + browser.substr(1).toLowerCase()

  config.browsers = [browser]
}
