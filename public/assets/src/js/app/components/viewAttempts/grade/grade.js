app.component('qcGrade', {
    controller: GradeController,
    controllerAs: 'vm',
    bindings: {
        attempt: '<qcAttempt',
        pointsPossible: '<qcPointsPossible',
        submissions: '<qcSubmissions',
        users: '<qcUsers',
        utils: '=qcUtils'
    },
    templateUrl: ['$rootScope', function($rootScope) {
        return $rootScope.getTemplatePath('gradeTemplate.html');
    }]
});

GradeController.$inject = ['Manage', 'Submission'];

function GradeController(Manage, Submission) {
    var vm = this;

    //variables
    vm.editedGradeValue = '';
    vm.editingGrade = false;
    vm.error = false;
    vm.gradeLoading = false;
    vm.isUserInCourse = true;
    vm.submission = null;

    //functions
    vm.$onChanges = $onChanges;
    vm.cancelGradeSubmit = cancelGradeSubmit;
    vm.editGrade = editGrade;
    vm.isGradeValid = isGradeValid;
    vm.isTestStudent = isTestStudent;
    vm.submitGrade = submitGrade;

    function $onChanges() {
        if (!vm.isTestStudent()) { //do not show test student as dropped; not in course roster
            vm.isUserInCourse = vm.users[vm.attempt.student.lti_custom_user_id] ? true : false;
        }
        vm.submission = new Submission(vm.attempt, vm.pointsPossible, vm.submissions);
    }

    function cancelGradeSubmit() {
        vm.error = false;
        vm.editingGrade = false;
        vm.gradeLoading = false;
    }

    function editGrade() {
        vm.error = false; //reset in case there was an error previously
        vm.editingGrade = true;
        vm.editedGradeValue = vm.submission.calculateGrade();
        vm.utils.focusToElement('#grade-submission-' + vm.attempt.id);
    }

    function isGradeValid() {
        if (isNaN(vm.editedGradeValue) || isNaN(parseInt(vm.editedGradeValue))) {
            vm.error = 'The grade must be a number!';
            return false;
        }

        var gradeInteger = parseInt(vm.editedGradeValue);

        if (gradeInteger > 100 || gradeInteger < 0) {
            vm.error = 'The grade must be between 0 and 100';
            return false;
        }

        return true;
    }

    //ensure that Canvas Test Student is not shown as dropped, since not in course
    function isTestStudent() {
        var student = vm.attempt.student;
        if (student.lis_person_name_given === 'Test' && student.lis_person_name_family === 'Student') {
            return true;
        }

        return false;
    }

    function submitGrade() {
        if (!vm.isGradeValid()) {
            return false;
        }

        //grades are displayed as 0-100 for instructor, but passed to back-end on a 0-1 scale
        var gradeData = { 'sourcedId': vm.attempt.lis_result_sourcedid, 'grade': vm.editedGradeValue / 100 };
        vm.gradeLoading = true;
        Manage.submitGrade(gradeData)
            .then(function(resp) {
                //if previously received an error, then undo it
                vm.error = false;
                vm.submission.update(vm.editedGradeValue);
                vm.gradeLoading = false;
                vm.editingGrade = false;
                vm.utils.focusToElement('#grade-' + vm.attempt.id);
            }, function(resp) {
                vm.error = vm.utils.getError(resp);
                vm.gradeLoading = false;
            });
    }
}