module.exports = (grunt) ->
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-coffee'

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    concat:
      js:
        src: [
          'Resources/assets/js/bootstrap.min.js'
          'Resources/assets/js/bootbox.min.js'
          'Resources/assets/js/dropzone.min.js'
          'Resources/assets/js/typeahead-bs2.min.js'
          'Resources/assets/js/jquery-ui-1.10.4.custom.min.js'
          'Resources/assets/js/jquery.ui.touch-punch.min.js'
          'Resources/assets/js/chosen.jquery.min.js'
          'Resources/assets/js/fuelux/fuelux.spinner.min.js'
          'Resources/assets/js/date-time/moment.min.js'
          'Resources/assets/js/date-time/daterangepicker.min.js'
          'Resources/assets/js/bootstrap-colorpicker.min.js'
          'Resources/assets/js/jquery.knob.min.js'
          'Resources/assets/js/jquery.autosize.min.js'
          'Resources/assets/js/jquery.inputlimiter.1.3.1.min.js'
          'Resources/assets/js/jquery.maskedinput.min.js'
          'Resources/assets/js/bootstrap-tag.min.js'
          'Resources/assets/js/bootstrap-wysiwyg.min.js'
          'Resources/assets/js/fuelux/fuelux.tree.min.js'
          'Resources/assets/js/ace-elements.min.js'
          'Resources/assets/js/ace.min.js'
          'Resources/assets/js/custom.js'
          'Resources/assets/js/jquery.portfolio.js'
          'Resources/assets/js/jquery.colorbox-min.js'
          'Resources/assets/js/jquery.gritter.min.js'
          'Resources/assets/js/spin.min.js'
          'Resources/assets/js/jqGrid/jquery.jqGrid.min.js'
          'Resources/assets/js/jqGrid/custom.js'
          'Resources/assets/js/jquery.carouFredSel.js'
          'Resources/assets/coffee/*.js'
        ]
        dest: 'Resources/public/js/scripts.js'
      css:
        src: [
          'Resources/assets/css/bootstrap.min.css'
          'Resources/assets/css/font-awesome.min.css'
          'Resources/assets/css/jquery-ui-1.10.4.custom.min.css'
          'Resources/assets/css/chosen.css'
          'Resources/assets/css/datepicker.css'
          'Resources/assets/css/bootstrap-timepicker.css'
          'Resources/assets/css/daterangepicker.css'
          'Resources/assets/css/colorpicker.css'
          'Resources/assets/css/ace-fonts.css'
          'Resources/assets/css/ui.jqgrid.css'
          'Resources/assets/css/ace-skins.min.css'
          'Resources/assets/css/jquery.gritter.css'
          'Resources/assets/css/colorbox.css'
          'Resources/assets/css/ace.min.css'
          'Resources/assets/css/custom.css'
        ]
        dest: 'Resources/public/css/styles.css'
    cssmin:
      main:
        files:
          'Resources/public/css/styles.min.css': ['Resources/public/css/styles.css']
    uglify:
      main:
        options:
          compress:
            drop_console: true
        files:
          'Resources/public/js/scripts.min.js': 'Resources/public/js/scripts.js'
    coffee:
      front:
        expand: true
        flatten: true
        src: ['Resources/assets/coffee/*.coffee']
        dest: 'Resources/assets/js/coffee/'
        ext: '.js'

  grunt.registerTask('default', ['coffee', 'concat', 'javascript', 'css'])
  grunt.registerTask('javascript', ['uglify'])
  grunt.registerTask('css', ['cssmin'])