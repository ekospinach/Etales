module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            //restart server when anything changed in code
            serverSide: {
                files: [
                    'server.js',
                    'api/**/*.js',
                ],
                tasks: ['develop'],
                options: {
                    nospawn: true
                }
            },
            //html
            html:{
                files:[
                    'app/partials/singleReportTemplate/*.html',
                    'app/partials/modal/*.html',
                    'app/partials/toolTip/*.html'
                ],
                tasks:['ngtemplates'],

            },
            //active livereload to refresh browser when anything changed in code 
            browserSide: {
                files: [
                    'app/index.html',
                    'app/css/**/*.css',
                    'app/js/**/*.js',
                    'app/img/**/*.{png,jpg,jpeg,gif,webp,svg}',
                    'views/*.ejs'
                ],
                options: {
                    livereload: true
                }
            }
        },
        develop: {
            server: {
                file: './server.js',
                env: {
                    NODE_ENV: 'development'
                }
            }
        },
        ngtemplates:  {
            templates: {
                cwd: 'app/partials',
                src: ['singleReportTemplate/*.html','modal/*.html','toolTip/*.html'],
                dest: 'app/js/templates.js',
                options:    {
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    },
                    module : 'myApp.templates',
                    standalone: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-develop');
    grunt.registerTask('default', [
        'develop','watch','ngtemplates'
    ]);
    //'watch'
};