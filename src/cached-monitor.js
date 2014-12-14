/*
 * wait-for-it
 * https://github.com/brightcove/wait-for-it
 *
 * Copyright (c) 2014 Brightcove
 * All rights reserved.
 */

 'use strict';

var
  Monitor = require('./monitor.js'),
  util = require('util'),

  activityComplete = function _activityComplete (activityName, handlerFn, err) {
    var args = Array.prototype.slice.call(arguments, 2);

    // We don't cache error responses so that we give future activities a
    // chance to retry the request
    if (!err) {
      this._cachedResponses[activityName] = args;
    }

    return handlerFn.apply(null, args);
  };

/** CachedMonitor 
 * 
 * Extends Monitor with the ability to cache the result of executing the action
 * and returns that cached response to all subsequent requests for the same
 * resources. 
 **/

function CachedMonitor (activityType, logger) {
  this._cachedResponses = {};

  Monitor.apply(this, arguments);
}

util.inherits(CachedMonitor, Monitor);

CachedMonitor.prototype.add = function (activityName, continuation) {
  // If a response is already in the cache, simply schedule immediately
  if (activityName in this._cachedResponses) {
    var args = [null].concat(this._cachedResponses[activityName]);
    var applied = Function.bind.apply(continuation, args);
    setImmediate(applied);
    return null;
  }

  // Otherwise, defer until the activity has generated a response
  var handlerFn = Monitor.prototype.add.apply(this, arguments);

  if (typeof handlerFn === 'function') {
    return activityComplete.bind(this, activityName, handlerFn);
  } else {
    return null;
  }
};

CachedMonitor.prototype.invalidate = function (activityName) {
  return delete this._cachedResponses[activityName];
};

CachedMonitor.prototype.flush = function () {
  this._cachedResponses = {};
};

module.exports = CachedMonitor;
