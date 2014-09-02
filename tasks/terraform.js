/*
 * grunt-terraform
 * 
 *
 * Copyright (c) 2014 Gavin Ballard
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var terraform = require('terraform');
  var path = require('path');

  grunt.registerMultiTask('terraform', 'Compile assets using Harp\'s terraform pipeline.', function() {

    // Set options, including `data` (the template context).
    var options = this.options({
      data: {}
    });

    // Mark task as asynchronous.
    var async = grunt.util.async;
    var done = this.async();

    async.forEach(this.files, function(f, asyncCallback) {
      grunt.log.writeln('File "' + f.src[0] + '" read.');

      var rootDirectory = path.resolve(path.dirname(f.src[0])),
          templateName  = path.basename(f.src[0]);

      // Instantiate the Terraform root.
      var root = terraform.root(rootDirectory, options.data);

      // Render the template file and write to destination.
      root.render(templateName, {}, function(error, output) {
        if(error) {
          grunt.warn(f.src[0] + '\n' + error);
          return asyncCallback(error);
        }

        grunt.file.write(f.dest, output);
        grunt.log.writeln('Compiled ' + f.dest);

        asyncCallback();
      });
    }, function(error) {
      done(!error);
    });
  });

};
