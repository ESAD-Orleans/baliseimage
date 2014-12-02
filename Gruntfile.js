module.exports = function (grunt) {

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		sass: {
			dist: {
				option: 'compressed',
				files: {
					'styles/main.css': 'styles/main.scss'
				}
			}
		},

		autoprefixer: {
			sourcemap: {
				options: {
					map: true
				},
				src: 'styles/main.css',
				dest: 'styles/main.css'
			}
		},

		requirejs: {
			compile: {
				options: {
					mainConfigFile: 'main.js',
					baseUrl: ".",
					name: "main",
					out: 'public/main.min.js'
				}
			}
		},

		copy: {
			require: {files:[{
				src:'bower_components/requirejs/require.js',
				dest:'public/require.js'
			}

			]},
			styles:{
				files: [
					{expand: true, src: ['styles/*'], dest: 'public/', filter: 'isFile'}
				]
			}
		},

		watch: {
			css: {
				files: ['styles/*.scss'],
				tasks: ['sass', 'autoprefixer','copy'],
				options: {
					spawn: false,
					livereload: true
				}
			},
			js: {
				files: ['app/*.js','main.js'],
				tasks: ['requirejs','copy:require']
			}
		}

	})

	// 3. Where we tell Grunt we plan to use this plug-in.
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-autoprefixer');
	//
	grunt.registerTask('default', ['watch']);

}