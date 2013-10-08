module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      //restart server when anything changed in code
      serverSide: {  
        files: [
          'server.js',
          'api/**/*.js'
        ],
        tasks: ['develop'],
        options: { nospawn: true }
      },
      //active livereload to refresh browser when anything changed in code 
      browserSide: {  
        files: [
          'app/**/*.html',
          'app/css/**/*.css',
          'app/js/**/*.js',
          'app/img/**/*.{png,jpg,jpeg,gif,webp,svg}'        
        ],
        options: { livereload: true }
      }
    },
    develop: {
      server: {
        file: './scripts/web-server.js'
//        env: { NODE_ENV: 'development' }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-develop');
  grunt.registerTask('default', [
    'develop',
    'watch']);
};
