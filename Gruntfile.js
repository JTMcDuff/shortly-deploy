module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: '\n',
      },
      dist: {
        src: ['public/client/*.js'],
        dest: 'dest/app.js'
      },
      vendor: {
        src: ['public/lib/*.js'],
        dest: 'dest/vendor.js'
      }

    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'dest/app.min.js': ['dest/app.js'],
          'dest/vendor.min.js': ['dest/vendor.js']
        }
      }
    },

    eslint: {
      target: [
        'public/client/*.js'
      ]
    },

    cssmin: {
      target: {
        files: {
      'dest/style.css': ['public/style.css']
    }
  }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat:dist',
          'concat:vendor',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git add . ; git commit -m "commited"; git push live head;',
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', ['eslint','concat:dist', 'concat:vendor', 'uglify', 'cssmin']);

  grunt.registerTask('default', [
    'server-dev'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
      console.log('prod prod prod')
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    'test',
    'build',
    'shell:prodServer'
  ]);

};
