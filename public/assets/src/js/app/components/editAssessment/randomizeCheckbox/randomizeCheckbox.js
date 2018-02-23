app.component('qcRandomizeCheckbox', {
    controller: RandomizeCheckboxController,
    controllerAs: 'vm',
    bindings: {
        onQuestionEdited: '&qcOnQuestionEdited',
        question: '<qcQuestion',
        readOnly: '<qcReadOnly'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('randomizeCheckboxTemplate.html');
    }]
});

function RandomizeCheckboxController() {
    var vm = this;

    vm.isRandomized = isRandomized;
    vm.onEdited = onEdited;
    vm.toggleRandomized = toggleRandomized;

    function isRandomized() {
        if (vm.question.randomized == 'true') {
            return true;
        }

        return false;
    }

    function onEdited() {
        vm.onQuestionEdited({
            $event: {
                question: vm.question
            }
        });
    }

    function toggleRandomized() {
        if (vm.question.randomized == 'true') {
            vm.question.randomized = 'false';
        }
        else {
            vm.question.randomized = 'true';
        }

        vm.onEdited();
    }
}