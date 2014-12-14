/*
 * wait-for-it
 * https://github.com/brightcove/wait-for-it
 *
 * Copyright (c) 2014 Brightcove
 * All rights reserved.
 */

 'use strict';

  // This function is partially-applied and returned from the `add` function
  // Calling it signals that the shared resource is ready or that the activity
  // has completed and the deferred processes can be scheduled
  var activityComplete = function _activityComplete (activityName, err, result) {
    var
      numPending,
      deferredFnList = this._deferredFunctions[activityName],
      args = Array.prototype.slice.call(arguments, 1);

    args.unshift(null);

    // If the deferred list doesn't exist then we probably were already called
    if (Array.isArray(deferredFnList)) {
      numPending = deferredFnList.length;

      this.logger(this.constructor.name, '>>', this.name, '>> executing all deferred actions for "' +
        activityName + '" (' + numPending + ')');

      deferredFnList.forEach(function (continuation) {
        // Use setImmediate NOT process.nextTick to schedule the deferred
        // requests at the end of the current event queue instead of at the
        // beginning which might potentially hold up important IO requests.
        var applied = Function.bind.apply(continuation, args);
        setImmediate(applied);
      });

      // Delete the activity since we are no longer deferring requests
      delete this._deferredFunctions[activityName];
    }
  };

/** Monitor
 *
 * Allows you to defer multiple accesses to a shared resource or activity until
 * the resource is ready or the activity has completed.
 *
 * Many times the first request for a resource triggers some sort of async
 * process (template fetches, directory creation, etc.) that MUST be completed
 * before we are able to service ANY request for that resource. If the async
 * process is executed more than once, it might return an error or throw an
 * exception.
 *
 * This module allows you to defer future requests until the resource is ready
 * or an action has completed. Once completed, all deferred requests are
 * scheduled to continue.
 **/

function Monitor (activityType, logger) {
  Object.defineProperty(this, 'name',
    {value: activityType, configurable: false});
  this.logger = logger || console.log.bind(console);
  this._deferredFunctions = {};
}

// Adds an action requesting access to a shared resource or activity
//
// Returns a function or null:
//   function  - On the first request, for a particular activity a function
//               is returned signaling that the caller should start the async
//               process and then call the returned function to signal that
//               any deferred requests should be executed.
//
//   null      - Subquent requests to the same activity receive null to signal
//               that further action by the caller is not necessary.

Monitor.prototype.add = function (activityName, continuation) {
  if (Array.isArray(this._deferredFunctions[activityName])) {
    // This activity is already being executed so simply defer this request
    var numPending = this._deferredFunctions[activityName].push(continuation);

    this.logger(this.constructor.name, '>>', this.name, '>> deferring action on "' +
      activityName + '" for later (' + numPending + ')');

    return null;
  } else {
    // This is the first request for the activity so we return a function that
    // MUST be called to signal when the activity has completed
    this._deferredFunctions[activityName] = [continuation];

    this.logger(this.constructor.name, '>>', this.name, '>> initalizing action "' +
      activityName + '"');

    return activityComplete.bind(this, activityName);
  }
};

module.exports = Monitor;
