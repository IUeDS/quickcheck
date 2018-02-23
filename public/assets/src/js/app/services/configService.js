angular
    .module('configService', [])
    .factory('Config', ConfigService);

ConfigService.$inject = ['$location', 'ENV'];

function ConfigService($location, ENV) {
    var service = {
        environment: 'local', //default
        getEnvironment: getEnvironment,
        getPageRoot: getPageRoot,
        getImgRoot: getImgRoot,
        pageUrl: 'http://localhost:8000' //default
    };

    return service;

    function getEnvironment() {
        var location = $location.absUrl(),
            urls = ENV.urls;

        if (location.indexOf(urls.local) !== -1 && urls.local) {
            service.environment = 'local';
            service.pageUrl = urls.local;
        }
        else if (location.indexOf(urls.dev) !== -1 && urls.dev) {
            service.environment = 'dev';
            service.pageUrl = urls.dev;
        }
        else if (location.indexOf(urls.preview) !== -1 && urls.preview) {
            service.environment = 'preview';
            service.pageUrl = urls.preview;
        }
        else if (location.indexOf(urls.reg) !== -1 && urls.reg) {
            service.environment = 'reg';
            service.pageUrl = urls.reg;
        }
        else if (location.indexOf(urls.prod) !== -1 && urls.prod) {
            service.environment = 'prod';
            service.pageUrl = urls.prod;
        }

        return service.environment;
    }

    function getPageRoot() {
        return service.pageUrl + '/index.php';
    }

    function getImgRoot() {
        return service.pageUrl + '/assets/dist/img';
    }
}