angular
    .module('envService', [])
    .factory('ENV', EnvService);

function EnvService() {
    //quickCheckEnv is defined globally, and located in public/assets/config
    //it is an object composed of front-end environment variables
    var env = quickCheckEnv,
        service = env;

    return service;
}