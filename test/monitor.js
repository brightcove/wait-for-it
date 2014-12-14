/*
 * wait-for-it
 * https://github.com/brightcove/wait-for-it
 *
 * Copyright (c) 2014 Brightcove
 * All rights reserved.
 */

 'use strict';

var
  assert = require('assert'),
  sinon = require('sinon'),
  Monitor = require('../').uncached,
  noop = function () {};

describe('Monitor', function () {
  var mon;

  beforeEach('initialize a new monitor', function () {
    mon = new Monitor('test monitor');
  });

  it('should return a function first and null second', function () {
    var fn = mon.add('test activity', noop);
    var nil = mon.add('test activity', noop);

    assert.equal(typeof fn, 'function');
    assert.equal(nil, null);
  });

  it('should schedule deferred function when done passing all arguments', function (done) {
    var A = sinon.spy();
    var B = sinon.spy();
    var fn = mon.add('test activity', A);
    var nil = mon.add('test activity', B);

    fn(null, 1, 2, 3);

    setTimeout(function () {
      assert(A.calledWith(null, 1, 2, 3));
      assert(B.calledWith(null, 1, 2, 3));
      done();
    }, 100);
  });

  it('should schedule once even if called multiple times', function (done) {
    var A = sinon.spy();
    var B = sinon.spy();
    var fn = mon.add('test activity', A);
    var nil = mon.add('test activity', B);

    fn(null);
    fn(null);

    setTimeout(function () {
      assert(A.calledOnce);
      assert(B.calledOnce);
      done();
    }, 100);
  });
});
