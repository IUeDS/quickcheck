//cross-app modules
angular.module('qcApp.shared', [
    //angular modules
    'ngAria',
    'ngSanitize',
    //3rd-party modules
    'angular-svg-round-progressbar',
    'infinite-scroll',
    'ngFileUpload',
    'ui.tinymce'
]);

//services
angular.module('qcApp.services', [
    'assessmentService',
    'assessmentEditService',
    'caliperForwarderService',
    'collectionService',
    'configService',
    'customActivityService',
    'envService',
    'httpService',
    'manageService',
    'userService'
]);

//factories
angular.module('qcApp.factories', [
    'caliperFactory',
    'editAssessmentConfigFactory',
    'submissionFactory',
    'utilitiesFactory'
]);

//main app module
var app = angular
    .module('qcApp', ['qcApp.shared', 'qcApp.services', 'qcApp.factories'], ['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode({enabled: true, requireBase: false});
    }])
    .run(runBlock);


runBlock.$inject = ['$rootScope', 'Config'];

function runBlock($rootScope, Config) {
    //config setup for environment
    $rootScope.environment = Config.getEnvironment();
    $rootScope.page_root = Config.getPageRoot();
    $rootScope.img_root = Config.getImgRoot();

    //define icon paths so we can include them in multiple views without repeating ourselves; we need
    //the URLs so that we can ng-include the SVG files and thus manipulate the paths using CSS
    $rootScope.iconArrowUpPath = $rootScope.img_root + '/icons/icon_arrow_up.svg';
    $rootScope.iconArrowDownPath = $rootScope.img_root + '/icons/icon_arrow_down.svg';
    $rootScope.iconEditPath = $rootScope.img_root + '/icons/icon_pencil.svg';
    $rootScope.iconDeletePath = $rootScope.img_root + '/icons/icon_trash.svg';
    $rootScope.iconViewPath = $rootScope.img_root + '/icons/icon_eye.svg';
    $rootScope.iconCopyPath = $rootScope.img_root + '/icons/icon_copy.svg';

    //get last modified time of js from DOM (output by PHP) for cache-busting of angular directive templates;
    //the html files are cached mercilessly, especially in Chrome, requiring hard refreshes from instructors
    //when a directive in the app is updated. since the directive js files can't access last modified time of
    //their own files, we supply them with the last modified time of the concatenated js file. alternatively,
    //we could just require the template be reloaded every time, with a query string of the current time, but
    //that would be detrimental to performance (although not hugely, so the option is there if we need it).
    $rootScope.lastModified = $('.qc-last-modified-js').text();

    //set all template html files here; access public files path, then template folder, appending a query
    //string of when the js was last modified for cache-busting
    $rootScope.getTemplatePath = function(fileName) {
        var split_page_root = this.page_root.split('/index.php');
        return split_page_root[0] + '/assets/dist/js/templates/' + fileName + '?v=' + this.lastModified;
    };
}