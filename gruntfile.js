module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

    grunt.initConfig({
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/main.css': 'src/main.scss'
                }
            }
        },

        ngtemplates: {
            'sw.components': {
                cwd: '',
                src: ['src/*.html'],
                dest: 'src/partials.js'
            }
        },

        concat: {
            main: {
                options: {
                    sourceMap: true
                },
                src: ['src/*.js'],
                dest: 'dist/sw-duration-selector.js'
            }
        },

        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 8000,
                    open: true
                }
            }
        },

        watch: {
            options: {
                spawn: true,
                interrupt: true
            },
            styles: {
                files: ['src/*.scss'],
                tasks: ['sass']
            }
        }
    });
    grunt.registerTask('default', ['sass', 'connect', 'watch']);
    grunt.registerTask('release', ['sass', 'ngtemplates', 'concat']);
};