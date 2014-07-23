var Version = require('./utils/version');

module.exports = function (grunt) {
    grunt.registerMultiTask('version', 'Configures version.', function () {
        if (this.target === 'bump') {
            bump(this.data, arguments);
        } else if (this.target === 'apply') {
            apply(this.data, arguments);
        }
    });

    function bump(data, args) {
        try {
            var pkg = grunt.file.readJSON('./package.json');

            var vers = new Version(pkg.version);
            grunt.log.writeln('Current version: ' + vers);
            var part = args[0] || data.part;
            vers.bump(part);
            grunt.log.writeln('Updated version: ' + vers);

            pkg.version = vers.toString();
            grunt.config.pkg.version = pkg.version;
            grunt.file.write('./package.json', JSON.stringify(pkg, undefined, 2));
        } catch (err) {
            grunt.fail.fatal('Error bumping version.', err);
        }

    }

    function apply(data, args) {
        var pkg = grunt.file.readJSON('./package.json');
        var template = grunt.file.read(data.src);
        var output = template.replace('%VERSION%', pkg.version);
        grunt.file.write(data.dest, output);
    }
};