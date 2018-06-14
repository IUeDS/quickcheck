app.component('qcTimeoutModal', {
    controller: TimeoutModalController,
    controllerAs: 'vm',
    bindings: {
        timeoutSecondsRemaining: '<qcTimeoutSecondsRemaining'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('timeoutModalTemplate.html');
    }]
});

TimeoutModalController.$inject = ['$timeout'];

function TimeoutModalController($timeout) {
    var vm = this;

    vm.countdownAnimation = null; //path for svg to animate
    vm.countdownIncrement = 0; //how much of the circle to increment each repaint; calculated in $onInit
    vm.countdownProgress = 0; //animation progress
    vm.countdownRadius = 50;
    vm.countdownRepaint = 60; //time in ms for animation to repaint
    vm.timeoutFinished = false;
    vm.timeoutFinishedTime = null;
    vm.timeoutMsRemaining = 0;
    vm.timeoutSecondsRemaining = 0;
    vm.timeoutStartedTime = null;

    vm.$onInit = $onInit;
    vm.incrementTimer = incrementTimer;
    vm.restart = restart;
    vm.runTimer = runTimer;

    function $onInit() {
        vm.timeoutStartedTime = moment();
        vm.timeoutFinishedTime = moment().add(vm.timeoutSecondsRemaining, 'seconds');
        vm.timeoutMsRemaining = vm.timeoutSecondsRemaining * 1000;
        //the amount of the circle that should be incremented on each repaint; calculated as
        //a proportion of total degrees in circle and repaint time divided by total time
        vm.countdownIncrement = (vm.countdownRepaint * 360) / vm.timeoutMsRemaining;
        $('#qc-assessment-timeout-modal').modal({backdrop: 'static', keyboard: false});
        vm.runTimer();
    }

    //adapted from: https://codepen.io/anon/pen/OERKRN
    //using time-specific animation with moment.js, because timeout functions will
    //be halted if the user switches tabs, leading to an inaccurate countdown graphic.
    //when user switches back to tab, accurate timer (or completed timer) will be shown.
    function incrementTimer() {
        var incrementsPassed,
            mid,
            now = moment(),
            r,
            timeDifference,
            x,
            y;

        if (now.isSameOrAfter(vm.timeoutFinishedTime)) {
            vm.timeoutFinished = true;
            return;
        }

        timeDifference = moment.duration(now.diff(vm.timeoutStartedTime)).asMilliseconds();
        incrementsPassed = timeDifference / vm.countdownRepaint;
        vm.countdownProgress = vm.countdownIncrement * incrementsPassed % 360;
        r = vm.countdownProgress * Math.PI / 180;
        x = Math.sin(r) * vm.countdownRadius;
        y = Math.cos(r) * - vm.countdownRadius;
        mid = (vm.countdownProgress > 180) ? 1 : 0;
        vm.countdownAnimation = 'M 0 0 v -' + vm.countdownRadius +
            ' A ' + vm.countdownRadius + ' ' + vm.countdownRadius +
            ' 1 ' + mid + ' 1 ' + x + ' ' + y + ' z';
        vm.runTimer();
    }

    function restart() {
        //hard page refresh to ensure a new attempt is created
        window.location.reload();
    }

    function runTimer() {
        $timeout(function() {
            vm.incrementTimer();
        }, vm.countdownRepaint);
    }
}