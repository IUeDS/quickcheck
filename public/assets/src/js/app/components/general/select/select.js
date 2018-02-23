//Update bound model in select element on keypress, to make it accessible
//Source: http://stackoverflow.com/questions/22630744/ng-options-model-not-updated-when-use-arrow-keyboard-instead-of-mouse
app.directive('select', QcSelect);

function QcSelect() {
    return {
        restrict: 'E',
        require: '?ngModel',
        scope: false,
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) {
                return;
            }
            element.bind('keyup', function() {
                element.triggerHandler('change');
            });
        }
    };
}
