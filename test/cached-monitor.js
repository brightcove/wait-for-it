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
  Monitor = require('../').cached,
  noop = function () {};

describe('CachedMonitor', function () {
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

  it('should call function on `add` immediately passing all cached arguments', function (done) {
    var A = sinon.spy();
    var B = sinon.spy();
    var fn = mon.add('test activity', A);

    fn(null, 1, 2, 3);

    setTimeout(function () {
      assert(A.calledWith(null, 1, 2, 3));
      mon.add('test activity', B);
      setTimeout(function () {
        assert(B.calledWith(null, 1, 2, 3));
        done();
      }, 100);
    }, 100);
  });

  it('should schedule once even if called multiple times', function (done) {
    var A = sinon.spy();
    var B = sinon.spy();
    var fn = mon.add('test activity', A);

    fn(null);
    fn(null);

    setTimeout(function () {
      var nil = mon.add('test activity', B);
      assert.equal(nil, null);
      setTimeout(function () {
        assert(A.calledOnce);
        assert(B.calledOnce);
        done();
      }, 100);
    }, 100);
  });

  it('should not cache responses on error', function (done) {
    var A = sinon.spy();
    var B = sinon.spy();
    var fn = mon.add('test activity', A);

    fn(new Error('oops!'));

    setTimeout(function () {
      var fn2 = mon.add('test activity', B);
      assert.equal(typeof fn2, 'function');
      setTimeout(function () {
        assert(A.calledOnce);
        assert.equal(B.callCount, 0);
        done();
      }, 100);
    }, 100);
  });
});
