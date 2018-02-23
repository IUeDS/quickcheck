app.component('qcRowFeedback', {
    controller: RowFeedbackController,
    controllerAs: 'vm',
    bindings: {
        feedback: '<qcFeedback',
        incorrectRows: '<qcIncorrectRows',
        isCorrect: '<qcIsCorrect',
        isNextBtnDisabled: '<qcIsNextBtnDisabled',
        onContinue: '&qcOnContinue',
        partialCredit: '<qcPartialCredit'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('rowFeedbackTemplate.html');
    }]
});

RowFeedbackController.$inject = ['Utilities'];

function RowFeedbackController(Utilities) {
    var vm = this;

    vm.utils = new Utilities();

    vm.$onInit = $onInit;
    vm.next = next;

    function $onInit() {
        vm.utils.formatMath(); //if equations shown in feedback
    }

    function next() {
        vm.onContinue();
    }
}