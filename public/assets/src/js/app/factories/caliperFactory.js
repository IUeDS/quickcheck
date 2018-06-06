angular
    .module('caliperFactory', [])
    .factory('Caliper', QcCaliper);

QcCaliper.$inject = ['CaliperForwarder'];

function QcCaliper(CaliperForwarder) {
    //instantiate and return the new object
    function Caliper(caliperData) {
        var vm = this;

        //variables
        vm.enabled = caliperData.isEnabled;
        vm.sensorHost = caliperData.sensorHost;

        //functions
        vm.forwardEvent = forwardEvent;
        vm.isEnabled = isEnabled;

        function isEnabled() {
            return vm.enabled;
        }

        function forwardEvent(caliperData) {
            if (!caliperData.data) {
                return false;
            }

            if (!vm.sensorHost) {
                return false;
            }

            //succeed or fail silently in the background
            CaliperForwarder.forwardEvent(vm.sensorHost, caliperData).then(function(resp) {
                return true;
            }, function(resp) {
                return false;
            });
        }
    }

    return Caliper;
}