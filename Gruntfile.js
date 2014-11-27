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

		watch: {
			css: {
				files: ['styles/*.scss'],
				tasks: ['sass', 'autoprefixer'],
				options: {
					spawn: false,
					livereload: true
				}
			}
		}

	})

	// 3. Where we tell Grunt we plan to use this plug-in.
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-autoprefixer');
	//
	grunt.registerTask('default', ['watch']);
}