//source: https://docs.angularjs.org/error/ngModel/numfmt
app.directive('stringToNumber', QcStringToNumber);
//also, prevent input[type="number"] from changing the value on scroll
//source: https://gist.github.com/pererinha/aaef044b021bbf7372e5
//tinkered with it to make it more accessible and performant, rather than using blur(),
//and rather than binding all scroll events, just check to see if focused, and if
//scrolling, prevent the default behavior. It does prevent scrolling if focused and
//the mouse is hovering over the element; hoping that won't confuse anyone. Should be
//a minor case, and I don't want to throw off accessibility by removing focus.

function QcStringToNumber() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            var isFocused = false;

            ngModel.$parsers.push(function(value) {
                return '' + value;
            });
            ngModel.$formatters.push(function(value) {
                return parseFloat(value, 10);
            });

            element.bind('focus', function(event) {
                isFocused = true;
            });

            element.bind('focusout', function(event) {
                isFocused = false;
            });

            element.bind('mousewheel', function(event) {
                if (isFocused) {
                    event.preventDefault();
                }
            });
        }
    };
}
