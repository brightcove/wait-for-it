/*
 * wait-for-it
 * https://github.com/brightcove/wait-for-it
 *
 * Copyright (c) 2014 Brightcove
 * All rights reserved.
 */
'use strict';

module.exports = {
  uncached: require('./src/monitor.js'),
  cached: require('./src/cached-monitor.js')
};
