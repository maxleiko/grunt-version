/*
 * grunt-version
 * https://github.com/kswedberg/grunt-version
 *
 * Copyright (c) 2013 Karl Swedberg
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Test targets to be merged into grunt.config.version
  var version_tests = {
    prefix_option: {
      options: {
        prefix: 'version[\'"]?( *=|:) *[\'"]',
      },
      src: ['tmp/testing.js', 'tmp/testingb.js'],
    },
    prerelease: {
      options: {
        release: 'prerelease',
        pkg: 'test/fixtures/test-pkg-pre.json'
      },
      src: 'tmp/test-pkg-pre.json'
    },
    patch: {
      options: {
        release: 'patch'
      },
      src: [
        'tmp/123.js',
        'tmp/456.js',
        'tmp/test-package.json'
      ]
    },
    prerelease_build: {
      options: {
        release: 'prerelease',
        pkg: 'test/fixtures/test-pkg-prerelease_build.json'
      },
      src: [
        'tmp/test-pkg-prerelease_build.json',
        'tmp/test-prerelease_build.js'
      ]
    },
    minor: {
      options: {
        release: 'minor',
        pkg: 'test/fixtures/test-pkg-vc.json'
      },
      src: ['tmp/test-pkg-vc.json', 'tmp/testingc.js']
    },
    literal: {
      options: {
        release: '3.2.1',
        pkg: grunt.file.readJSON('test/fixtures/test-package-v.json')
      },
      src: [
        'tmp/test-package-v.json'
      ]
    },
    ignore_default: {
      options: {
          pkg: grunt.file.readJSON('test/fixtures/test-package.json')
      },
      src: [
        'tmp/456.js',
        'tmp/node_modules/test-package.json'
      ]
    },
    ignore_list: {
      options: {
        pkg: grunt.file.readJSON('test/fixtures/test-package.json'),
        release: 'minor',
        ignore: ['ignored_dir', 'node_modules']
      },
      src: [
        'tmp/456.js',
        'tmp/node_modules/test-package.json',
        'tmp/ignored_dir/test-package.json',
      ]
    }
  };

  // Project configuration.
  var gruntConfig = {
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },
    copy: {
      tests: {
        files: [{
          cwd: 'test/fixtures/',
          src: ['**'],
          dest: 'tmp/',
          expand: true
        }]
      }
    },

    version: {
      options: {
        pkg: grunt.file.readJSON('test/fixtures/test-package.json')
      },
      // Not for testing
      patch: {
        options: {
          release: 'patch',
          pkg: grunt.file.readJSON('package.json')
        },
        src: [
          'package.json'
        ]
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  };

  grunt.util._.extend(gruntConfig.version, version_tests);

  grunt.initConfig( gruntConfig );

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [
    'clean',
    'copy',
    'version:prefix_option',
    'version:patch',
    'version:prerelease',
    'version:literal',
    'version:minor',
    'version:prerelease_build',
    'nodeunit'
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
