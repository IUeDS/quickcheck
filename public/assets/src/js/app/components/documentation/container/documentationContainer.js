app.component('qcDocumentation', {
    controller: DocumentationController,
    controllerAs: 'vm',
    bindings: {},
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('documentationContainerTemplate.html');
    }]
});

DocumentationController.$inject = ['ENV', 'User', 'Utilities'];

function DocumentationController(ENV, User, Utilities) {
    var vm = this;

    //variables in scope
    vm.contactUsEmail = ENV.contactUsEmail;
    vm.currentPage = 'help';
    vm.isLoggedIn = false;
    vm.showOverviewVideo = ENV.showOverviewVideo;
    vm.supportCenterLink = ENV.supportCenterLink;
    vm.utils = new Utilities();

    //functions in scope
    vm.$onInit = $onInit;
    vm.getUser = getUser;

    function $onInit() {
        vm.getUser();
    }

    function getUser() {
        User.getUser()
            .then(function (resp) {
                vm.isLoggedIn = true;
                vm.utils.setLtiHeight();
            }, function (resp) {
                //just for the purposes of the documentation page, don't display an error if the user is
                //not logged-in, since this is a public resource; just hide the nav if not logged-in
                vm.isLoggedIn = false;
                vm.utils.setLtiHeight();
            });
    }

    // smooth scrolling for same page ID links
    // credit goes to Chris Coyier for the jquery: http://css-tricks.com/snippets/jquery/smooth-scrolling/ */
    $(function() {
        $('a[href*=\\#]:not([href=\\#])').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });
    });
}