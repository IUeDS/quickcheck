angular
    .module('submissionFactory', [])
    .factory('Submission', QcSubmission);

QcSubmission.$inject = [];

function QcSubmission() {
    //instantiate and return the new object
    function Submission(attempt, pointsPossible, submissions) {
        var vm = this;

        //variables
        vm.attempt = attempt;
        vm.pointsPossible = pointsPossible;
        vm.userSubmission = submissions ? submissions[vm.attempt.student.lti_custom_user_id] : null;

        //functions
        vm.calculateGrade = calculateGrade;
        vm.isGradeable = isGradeable;
        vm.isGraded = isGraded;
        vm.needsGrade = needsGrade;
        vm.update = update;

        function calculateGrade() {
            if (!vm.userSubmission) {
                return '';
            }

            var score = vm.userSubmission.score / vm.pointsPossible * 100,
                roundedScore = Math.round(score * 100) / 100;

            return roundedScore;
        }

        function isGradeable() {
            if (!vm.attempt.lis_result_sourcedid) { //instructor/designer OR ungraded
                return false;
            }
            if (vm.pointsPossible === 0) {
                return false;
            }

            return true;
        }

        function isGraded() {
            if (!vm.isGradeable()) {
                return false;
            }

            if (!vm.userSubmission) {
                return false; //if user not found
            }

            if (vm.userSubmission.workflow_state === 'graded') {
                return true;
            }

            return false; //user in course, graded assignment, but no graded submission
        }

        function needsGrade() {
            if (vm.isGradeable() && !vm.isGraded()) {
                return true;
            }
        }

        function update(score) {
            var grade = (+(score) / 100) * vm.pointsPossible;
            vm.userSubmission.score = grade;
            vm.userSubmission.workflow_state = 'graded';
        }
    }

    return Submission;
}