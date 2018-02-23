app.component('qcRichContentToggle', {
    controller: RichContentToggleController,
    controllerAs: 'vm',
    bindings: {
        onRichContentToggle: '&qcOnRichContentToggle',
        question: '<qcQuestion',
        toggleType: '<qcToggleType'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('richContentToggleTemplate.html');
    }]
});

function RichContentToggleController() {
    var vm = this;

    vm.isToggled = false;

    vm.toggle = toggle;

    function toggle() {
        var toggled;

        //string of true/false required in html element
        if (vm.isToggled == 'true') {
            vm.isToggled = 'false';
        }
        else {
            vm.isToggled = 'true';
        }

        //send boolean to parent
        toggled = vm.isToggled == 'true' ? true : false;
        vm.onRichContentToggle({
            $event: {
                'isToggled': toggled
            }
        });
    }
}