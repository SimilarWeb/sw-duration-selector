module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

    grunt.initConfig({
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'src/main.css': 'src/main.scss'
                }
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
};