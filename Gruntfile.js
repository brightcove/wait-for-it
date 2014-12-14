/*
 * wait-for-it
 * https://github.com/brightcove/wait-for-it
 *
 * Copyright (c) 2014 Brightcove
 * All rights reserved.
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    simplemocha: {
      options: {
        ui: 'bdd',
        reporter: 'spec'
      },
      unit: {
        src: ['test/*.js']
      }
    },
    jshint: {
      main: {
        src: ['*.js','src/**/*.js'],
        options: {
          curly: true,
          expr: true,
          forin: true,
          latedef: true,
          noarg: true,
          // our coding style standard is 80 but be nice here
          maxlen: 120,
          quotmark: 'single',
          undef: true,
          // environment options to help determine what 'undef' should warn on
          devel: true,
          node: true,
          nonstandard: true
        }
      },
      tests: {
        src: ['test/*.js'],
        options: {
          curly: true,
          // Allow assignment-free expressions like result.should.be.true
          expr: true,
          forin: true,
          latedef: true,
          noarg: true,
          // our coding style standard is 80 but be nice here
          maxlen: 120,
          //quotmark: 'single',
          undef: true,
          // environment options to help determine what 'undef' should warn on
          devel: true,
          node: true,
          nonstandard: true,
          predef: [
            'callback', // Used by mocha
            'describe', // Used by mocha
            'it', // Used by mocha
            'before', // Used by mocha
            'beforeEach', // Used by mocha
            'after', // Used by mocha
            'afterEach' // Used by mocha
          ]
        }
      }
    }
  });

  // replaces grunt.loadNpmTasks('grunt-*')
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('unit', ['simplemocha:unit']);

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'simplemocha:unit']);
};
