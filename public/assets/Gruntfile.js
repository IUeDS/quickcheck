//Gruntfile.js

var dependenciesDir = 'node_modules/',
    srcCssFontsDir = 'src/css/fonts',
    config = {
        jsDependencies: [
            dependenciesDir + 'jquery/dist/jquery.min.js',
            dependenciesDir + 'angular/angular.min.js',
            dependenciesDir + 'angular-sanitize/angular-sanitize.min.js',
            dependenciesDir + 'angular-aria/angular-aria.min.js',
            dependenciesDir + 'ng-file-upload/dist/ng-file-upload.min.js',
            dependenciesDir + 'angular-svg-round-progressbar/build/roundProgress.min.js',
            dependenciesDir + 'tinymce/tinymce.min.js',
            dependenciesDir + 'tinymce/themes/**/*.min.js',
            dependenciesDir + 'tinymce/plugins/**/*.min.js',
            dependenciesDir + 'angular-ui-tinymce/dist/tinymce.min.js',
            dependenciesDir + 'bootstrap/dist/js/bootstrap.min.js',
            dependenciesDir + 'moment/min/moment.min.js',
            dependenciesDir + 'moment-timezone/builds/moment-timezone-with-data.min.js',
            dependenciesDir + 'ng-infinite-scroll/build/ng-infinite-scroll.min.js',
            'src/js/app/**/*.js',
            'config/env.js',
            '!config/*.example.js',
            dependenciesDir + 'mathquill/build/mathquill.min.js'
        ],
        cssDependencies: [
            dependenciesDir + 'bootstrap/dist/css/bootstrap.min.css',
            dependenciesDir + 'animate.css/animate.min.css',
            dependenciesDir + 'components-font-awesome/css/font-awesome.min.css',
            dependenciesDir + 'tinymce/skins/**/*.min.css',
            'dist/css/main.css',
            dependenciesDir + 'mathquill/build/mathquill.css'
        ]
    };

//this wrapper exposes our configuration to the rest of the app
module.exports = function(grunt) {

	/****** CONFIGURE GRUNT ******/
	grunt.initConfig({

		//get configuration info from package.json
		pkg: grunt.file.readJSON('package.json'),

		//all of our configurations
		jshint: {
			options: {
				reporter: require('jshint-stylish') //use this to make our errors look and read good
			},
			//when this task is run, lint the Gruntfile and all js files in src
			build: ['Gruntfile.js', 'src/js/app/**/*.js']
		},

		uglify: {
			options: {
                sourceMap: true,
                sourceMapIncludeSources: true
			},
			dev: { //concatenate, but don't minify, for debugging while developing
				options: {
					report: false,
					mangle: false,
					compress: false,
					beautify: true
				},
				files: {
					'dist/js/scripts.min.js': config.jsDependencies
				}
			},
			prod: { //concatenate and minify for production
				options: {
					report: 'min',
					mangle: true,
					compress: true
				},
				files: {
					'dist/js/scripts.min.js': config.jsDependencies
				}
			}
		},

		sass: {
			build: {
				files: {
					'dist/css/main.css': 'src/css/main.scss'
				}
			}
		},

		sasslint: {
			options: {
				configFile: 'config/.sass-lint.yml'
			},
			target: ['src/css/**/*.scss']
		},

		autoprefixer: {
			dist: {
				files: {
					'dist/css/main.css': 'dist/css/main.css'
				}
			}
		},

		cssmin: {
            options: {
                //only font that needs a new path is font awesome fonts;
                //copying over rather than rebasing. otherwise, we would
                //need to include node_modules on server, which is unnecessary.
                rebase: false,
            },
			build: {
				files: {
					'dist/css/style.min.css': config.cssDependencies
				}
			}
		},

		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['img/**/*.{png,jpg,jpeg,gif,svg}'],
					dest: 'dist'
				}]
			}
		},

        //for tinymce, have to copy skin CSS files to js dist directory, otherwise they're not found
        //for angular components, copy the template html to dist
        //for css fonts, copy over font awesome fonts, tinymce fonts, and Benton Sans
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: dependenciesDir + 'tinymce/skins/',
                        src: ['**'],
                        dest: 'dist/js/skins/'
                    },
                    {
                        expand: true,
                        cwd: 'src/js/vendor/tinymce_plugins',
                        src: ['**'],
                        dest: 'dist/js/plugins/'
                    },
                    {
                        expand: true,
                        cwd: 'src/js/app/components',
                        src: ['**/*.html'],
                        dest: 'dist/js/templates/',
                        flatten: true
                    },
                    {
                        expand: true,
                        cwd: dependenciesDir + 'components-font-awesome/fonts/',
                        src: ['*'],
                        dest: 'dist/fonts/'
                    },
                    {
                        expand: true,
                        cwd: dependenciesDir + 'tinymce/skins/lightgray/fonts/',
                        src: ['*'],
                        dest: 'dist/css/fonts/'
                    },
                    {
                        expand: true,
                        cwd: srcCssFontsDir,
                        src: ['*'],
                        dest: 'dist/fonts/'
                    }
                ]
            }
        },

        eslint: {
        	options: {
        		configFile: 'eslint.json',
        		fix: true
        	},
        	target: ['src/js/app/**/*.js']
        },

        lintspaces: {
        	all: {
        		src: [
        			'src/js/app/components/templates/*.html',
        			'../../resources/views/**/*.php',
        			'../../app/**/*.php'
        		],
        		options: {
        			trailingspaces: true,
        			indentation: 'spaces',
        			spaces: 4
        		}
        	}
        },

		watch: {
			stylesheets: {
				files: ['src/**/*.css', 'src/**/*.scss'],
				tasks: ['sasslint', 'sass', 'autoprefixer', 'cssmin']
			},
			img: {
				files: ['src/img/**/*.{png,jpg,gif,svg}'],
				tasks: ['newer:imagemin'] //only minify new image files, to save time
			},
			scripts_dev: {
				files: ['src/js/app/**/*', 'config/env.js'],
				tasks: ['jshint', 'eslint', 'uglify:dev', 'copy']
			},
			scripts_prod: {
				files: ['src/js/app/**/*', 'config/env.js'],
				tasks: ['jshint', 'uglify:prod', 'copy']
			},
			lintspaces: {
				files: [
					'src/js/app/components/templates/*.html',
					'../../resources/views/**/*.php',
					'../../app/**/*.php'
				],
				tasks: ['lintspaces:all']
			}
		},

		//breaks watch task into segments for dev/prod
		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			dev: {
				tasks: ['watch:stylesheets', 'watch:img', 'watch:scripts_dev', 'watch:lintspaces']
			},
			prod: {
				tasks: ['watch:stylesheets', 'watch:img', 'watch:scripts_prod']
			}
		}

	});

	/******* LOAD GRUNT PLUGINS *****/
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-sass-lint');
    grunt.loadNpmTasks('grunt-lintspaces');

	// =================== CREATE TASKS ============== //
	grunt.registerTask('default', ['jshint', 'uglify:prod', 'sass', 'autoprefixer', 'cssmin', 'imagemin', 'copy']);
	grunt.registerTask('dev', ['concurrent:dev']);
	grunt.registerTask('prod', ['concurrent:prod']);
};
