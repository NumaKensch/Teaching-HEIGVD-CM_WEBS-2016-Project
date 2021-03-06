'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app.js'
      }
    },
    jshint: {options: { //ajout par après pour pas avoir d'erreurs
      node: true
    },
    all: [ "Gruntfile.js", "app/**/*.js", "public/js/**/*.js", "app.js" ]
  },
  apidoc: {
  myapp: {
    src: "app/",
    dest: "public/apidoc/"
  }
},
  stylus: {
    dist: {
      files: {
        'public/css/style.css': 'public/css/style.styl'
      }
    }
  },
  watch: {
    options: {
      nospawn: true,
      livereload: reloadPort
    },
    js: {
      files: [
      'app.js',
      'app/**/*.js',
      'config/*.js'
      ],
      tasks: ['jshint','develop', 'delayed-livereload']
    },
    css: {
      files: [
      'public/css/*.styl'
      ],
      tasks: ['stylus'],
      options: {
        livereload: reloadPort
      }
    },
    views: {
      files: [
      'app/views/*.jade',
      'app/views/**/*.jade'
      ],
      options: { livereload: reloadPort }
    }
  }
});

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
        var reloaded = !err && res.statusCode === 200;
        if (reloaded)
          grunt.log.ok('Delayed live reload successful.');
        else
          grunt.log.error('Unable to make a delayed live reload.');
        done(reloaded);
      });
    }, 500);
  });

  grunt.registerTask('default', [
    'stylus',
    'jshint',
    'develop',
    'watch'
    ]);
};
