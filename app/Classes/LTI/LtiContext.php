<?php

namespace App\Classes\LTI;
use App\Classes\LTI\BLTI;
use App\Classes\LTI\LTIAdvantage;
use Log;
use Illuminate\Http\Request;
use App\Models\CourseContext;
use App\Models\Student;
use App\Models\User;
use App\Exceptions\LtiLaunchDataMissingException;

class LtiContext {

    private $contextKey = "https://purl.imsglobal.org/spec/lti/claim/context";
    private $customKey = "https://purl.imsglobal.org/spec/lti/claim/custom";
    private $endpointKey = "https://purl.imsglobal.org/spec/lti-ags/claim/endpoint";
    private $lisKey = "https://purl.imsglobal.org/spec/lti/claim/lis";
    private $namesRolesServiceKey = "https://purl.imsglobal.org/spec/lti-nrps/claim/namesroleservice";
    private $resourceLinkKey = "https://purl.imsglobal.org/spec/lti/claim/resource_link";
    private $rolesKey = "https://purl.imsglobal.org/spec/lti/claim/roles";

    private $launchValues = [];

    /************************************************************************/
    /* PUBLIC FUNCTIONS *****************************************************/
    /************************************************************************/

    /**
    * Create a line item (which will generate an assignment in Canvas)
    *
    * @param  string $lineItemsUrl
    * @param  int    $scoreMaximum
    * @param  string $label
    * @return []     $result (data converted to associative array from JSON)
    */

    public function createLineItem($lineItemsUrl, $scoreMaximum = 0, $label = 'Quick Check')
    {
        $lti = new LTIAdvantage();
        $result = $lti->createLineItem($lineItemsUrl, $scoreMaximum, $label);
        return $result;
    }

    /**
    * Get all line items (gradeable assignments) for the course
    *
    * @param  string $lineItemsUrl
    * @return []     $result (data converted to associative array from JSON)
    */

    public function getAllLineItems($lineItemsUrl)
    {
        $lti = new LTIAdvantage();
        $result = $lti->getAllLineItems($lineItemsUrl);
        return $result;
    }

    /**
    * From the initial launch params passed along in the request, retrieve allowed attempts
    *
    * @return int or null
    */
    public function getAllowedAttempts()
    {
        if (!$this->launchValues) {
            return false;
        }

        $allowedAttempts = $this->launchValues[$this->customKey]->custom_canvas_allowed_attempts;
        if ($allowedAttempts === '$Canvas.assignment.allowedAttempts') {
            return null;
        }

        if (!$allowedAttempts) {
            return null;
        }

        return (int) $allowedAttempts;
    }

    /**
    * From the initial launch params passed along in the request, retrieve assignment ID
    *
    * @return int
    */

    public function getAssignmentId()
    {
        if (!$this->launchValues) {
            return false;
        }

        $assignmentId = $this->launchValues[$this->customKey]->canvas_assignment_id;
        if ($assignmentId === '$Canvas.assignment.id') {
            return null;
        }

        return $assignmentId;
    }

    /**
    * From the initial launch params passed along in the request, retrieve assignment title
    *
    * @return string
    */

    public function getAssignmentTitle()
    {
        if (!$this->launchValues) {
            return false;
        }

        $assignmentTitle = $this->launchValues[$this->customKey]->canvas_assignment_title;
        if ($assignmentTitle === '$Canvas.assignment.title') {
            return null;
        }

        return $assignmentTitle;
    }

    /**
    * Get current context
    *
    * @return string $context_id
    */

    public function getContextId()
    {
        if (!$this->launchValues) {
            return false;
        }

        return $this->launchValues[$this->contextKey]->id;
    }

    /**
    * Get the Canvas course ID
    *
    * @return string
    */

    public function getCourseId()
    {
        if (!$this->launchValues) {
            return false;
        }

        return $this->launchValues[$this->customKey]->canvas_course_id;
    }

    /**
    * Get the course offering sourcedid for the current launch
    *
    * @return string
    */

    public function getCourseOfferingSourcedid()
    {
        if (!$this->launchValues) {
            return false;
        }

        return $this->launchValues[$this->lisKey]->course_offering_sourcedid;
    }

    /**
    * If a deep link request, we should redirect to this URL once the item has been selected.
    *
    * @return string
    */

    public function getDeepLinkingRedirectUrl()
    {
        if (!$this->launchValues) {
            return false;
        }

        $deepLinkSettings = $this->launchValues['https://purl.imsglobal.org/spec/lti-dl/claim/deep_linking_settings'];
        if (!$deepLinkSettings) {
            return false;
        }

        return $deepLinkSettings->deep_link_return_url;
    }

    /**
    * From the initial launch params passed along in the request, retrieve deployment ID
    *
    * @return string
    */

    public function getDeploymentId()
    {
        if (!$this->launchValues) {
            return false;
        }

        return $this->launchValues['https://purl.imsglobal.org/spec/lti/claim/deployment_id'];
    }

    /**
    * Get due at value for current launch
    *
    * @return string
    */

    public function getDueAt()
    {
        if (!$this->launchValues) {
            return false;
        }

        $dueAt = $this->launchValues[$this->customKey]->canvas_assignment_dueat;
        //not sure why, but Canvas gives this value instead of NULL if no due date set! bizarre!
        if ($dueAt == '$Canvas.assignment.dueAt.iso8601') {
            return null;
        }

        return $dueAt;
    }

    /**
    * Get student's given name for the current launch
    *
    * @return string
    */

    public function getGivenName()
    {
        if (!$this->launchValues) {
            return false;
        }

        return $this->launchValues['given_name'];
    }

    /**
    * Get student's family name for the current launch
    *
    * @return string
    */

    public function getFamilyName()
    {
        if (!$this->launchValues) {
            return false;
        }

        return $this->launchValues['family_name'];
    }

    /**
    * Get decoded launch values from JWT after it's been unencrypted
    *
    * @return []
    */

    public function getLaunchValues()
    {
        return $this->launchValues;
    }

    /**
    * The first step of the LTI launch: Canvas sends params to our tool and we need to redirect back
    *
    * @param  string $lineItemUrl
    * @return []     $data (data converted to associative array from JSON)
    */

    public function getLineItem($lineItemUrl)
    {
        $lti = new LTIAdvantage();
        $data = $lti->getLineItem($lineItemUrl);

        return $data;
    }

    /**
    * From the initial launch params passed along in the request, retrieve line item URL
    *
    * @return string
    */

    public function getLineItemUrl()
    {
        if (!$this->launchValues) {
            return false;
        }

        $urls = $this->launchValues[$this->endpointKey];
        if (!property_exists($urls, 'lineitem')) {
            return false;
        }

        return $urls->lineitem;
    }

    /**
    * Use names and roles provisioning service to retrieve all course memberships
    *
    * @param  string $membershipsUrl
    * @return []     $result (data converted to associative array from JSON)
    */

    public function getMemberships($membershipsUrl)
    {
        $lti = new LTIAdvantage();
        $result = $lti->getMemberships($membershipsUrl);
        return $result;
    }

    /**
    * Get the nonce for the current launch
    *
    * @return string
    */

    public function getNonce()
    {
        if (!$this->launchValues) {
            return false;
        }

        return $this->launchValues['nonce'];
    }

    /**
    * From the initial launch params passed along in the request, retrieve names and role provisioning service link
    *
    * @return string
    */

    public function getNRPSLink()
    {
        if (!$this->launchValues) {
            return false;
        }

        return $this->launchValues[$this->namesRolesServiceKey]->context_memberships_url;
    }

    /**
    * Get the person sourcedid for the current logged-in user
    *
    * @return string
    */

    public function getPersonSourcedid()
    {
        if (!$this->launchValues) {
            return false;
        }

        return $this->launchValues[$this->lisKey]->person_sourcedid;
    }

    /**
    * From the initial launch params passed along in the request, retrieve assignment points possible
    *
    * @return int
    */

    public function getPointsPossible()
    {
        if (!$this->launchValues) {
            return false;
        }

        return $this->launchValues[$this->customKey]->canvas_assignment_pointspossible;
    }

    /**
    * Get the resource link ID for the current launch
    *
    * @return string
    */

    public function getResourceLinkId()
    {
        if (!$this->launchValues) {
            return false;
        }

        return $this->launchValues[$this->resourceLinkKey]->id;
    }

    /**
    * Get the result of a line item for a specific student
    *
    * @param  string $lineItemUrl
    * @param  int    $userId
    * @return []     $result (data converted to associative array from JSON)
    */

    public function getResult($lineItemUrl, $userId)
    {
        $lti = new LTIAdvantage();
        $result = $lti->getResult($lineItemUrl, $userId);
        return $result;
    }

    /**
    * Get section ID for the current launch
    *
    * @return string
    */

    public function getSectionId()
    {
        if (!$this->launchValues) {
            return false;
        }

        return $this->launchValues[$this->customKey]->canvas_coursesection_id;
    }

    /**
    * Get user's Canvas ID for the current launch
    *
    * @return string
    */

    public function getUserId()
    {
        if (!$this->launchValues) {
            return false;
        }

        return $this->launchValues[$this->customKey]->canvas_user_id;
    }

    /**
    * Get the user's login ID to Canvas from LTI context
    *
    * @return string $custom_canvas_user_login_id
    */

    public function getUserLoginId()
    {
        if (!$this->launchValues) {
            return false;
        }

        return $this->launchValues[$this->customKey]->canvas_user_login_id;
    }

    /**
    * Initialize a new LTI advantage context based on POST params
    *
    * @return void
    */

    public function initContext(Request $request)
    {
        $lti = new LTIAdvantage();
        $lti->validateLaunch();
        $launchValues = $lti->getLaunchValues();
        $this->setLaunchValues($launchValues);
        $this->validateLaunchParams();
        $this->initUserContext();
        $this->initCourseContext();
    }

    /**
    * Determine if we are in a BLTI context (otherwise, anonymous attempt)
    *
    * @return boolean
    */

    public function isInLtiContext()
    {
        if ($this->launchValues) {
            return true;
        }

        return false;
    }

    /**
    * Check for instructor/admin/designer in launch data
    *
    * @return boolean
    */

    public function isInstructor()
    {
        if (!$this->launchValues) {
            return false;
        }

        $roles = $this->launchValues[$this->rolesKey];
        foreach ($roles as $role) {
            $role = strtolower($role);
            if (strpos($role, 'membership#instructor')) {
                return true;
            }

            if (strpos($role, 'membership#contentdeveloper')) {
                return true;
            }

            if (strpos($role, 'administrator')) {
                return true;
            }
        }

        return false;
    }

    /**
    * Given an array of LTI launch values (after being decoded in JWT), set them on the object
    * for future calls to retrieve launch values
    *
    * @param  []  $launchValues
    * @return void
    */

    public function setLaunchValues($launchValues)
    {
        $this->launchValues = $launchValues;
    }

    public function startSubmission($lineItemUrl, $userId)
    {
        $lti = new LTIAdvantage();
        $activityProgress = 'Started';
        $gradingProgress = 'NotReady';
        $lti->postScore($lineItemUrl, $userId, $activityProgress, $gradingProgress);
    }

    public function submitGrade($lineItemUrl, $userId, $scoreGiven, $scoreMaximum)
    {
        $lti = new LTIAdvantage();
        $activityProgress = 'Completed';
        $gradingProgress = 'FullyGraded';
        $result = $lti->postScore($lineItemUrl, $userId, $activityProgress, $gradingProgress, $scoreGiven, $scoreMaximum);

        return $result;
    }

    /**
    * Ensure all required launch params are present; abort if not present
    *
    * @return void
    */

    public function validateLaunchParams()
    {
        $missingValue = false;
        $logMessage = 'LTI launch data missing for the following value: ';

        if (!$this->getContextId()) {
            Log::info($logMessage + 'context ID');
            $missingValue = true;
        }

        if (!$this->getCourseId()) {
            Log::info($logMessage + 'course ID');
            $missingValue = true;
        }

        if (!$this->getUserId()) {
            Log::info($logMessage + 'user ID');
            $missingValue = true;
        }

        if (!$this->getUserLoginId()) {
            Log::info($logMessage + 'user login ID');
            $missingValue = true;
        }

        if (!$this->getGivenName()) {
            Log::info($logMessage + 'given name');
            $missingValue = true;
        }

        if ($missingValue) {
            throw new LtiLaunchDataMissingException;
        }
    }

    /************************************************************************/
    /* PRIVATE FUNCTIONS ****************************************************/
    /************************************************************************/

    /**
    * Find existing course context or create a new one if one does not yet exist
    *
    * @return void
    */

    private function initCourseContext()
    {
        $ltiContextId = $this->getContextId();
        $courseContext = CourseContext::where('lti_context_id', '=', $ltiContextId)->first();
        if (!$courseContext) {
            $courseContext = new CourseContext();
            $courseId = $this->getCourseId();
            $sourcedId = $this->getCourseOfferingSourcedid();
            $courseContext->initialize($ltiContextId, $courseId, $sourcedId);
        }

        //M. Mallon, 5/26/20: course sourced ID was not being previously saved, may need to update existing courses in DB;
        //we can remove this in the future after a semester or two
        if (!$courseContext->getCourseOfferingSourcedid()) {
            $sourcedId = $this->getCourseOfferingSourcedid();
            $courseContext->setCourseOfferingSourcedid($sourcedId);
        }
    }

    /**
    * Find existing instructor or create a new one if one does not yet exist
    *
    * @return void
    */

    private function initInstructorContext()
    {
        $loginId = $this->getUserLoginId();
        $user = User::getUserFromUsername($loginId);
        if (!$user) {
            $user = User::saveUser($loginId);
        }
    }

    /**
    * Find existing student or create a new one if one does not yet exist
    *
    * @return void
    */

    private function initStudentContext()
    {
        $canvasUserId = $this->getUserId();
        $student = Student::where('lti_custom_user_id', '=', $canvasUserId)->first();
        if (!$student) {
            $student = new Student();
            $givenName = $this->getGivenName();
            $familyName = $this->getFamilyName();
            $canvasUserId = $this->getUserId();
            $canvasLoginId = $this->getUserLoginId();
            $personSourcedId = $this->getPersonSourcedid();
            $student->initialize($givenName, $familyName, $canvasUserId, $canvasLoginId, $personSourcedId);
        }

        //M. Mallon, 5/26/20: person sourced ID was not previously saved, so add to existing users if needed.
        //in the future, we can remove this when we're pretty confident we only have new/updated user cohorts.
        if (!$student->getLisPersonSourcedId()) {
            $sourcedId = $this->getPersonSourcedid();
            $student->setLisPersonSourcedId($sourcedId);
        }
    }

    /**
    * Find existing student or create a new entry if one does not yet exist
    *
    * @return void
    */

    private function initUserContext()
    {
        if ($this->isInstructor()) {
            $this->initInstructorContext();
        }

        //also initialize the instructor as a student if they are testing quick checks;
        //this merely saves a row in the database and doesn't affect session values
        $this->initStudentContext();
    }
}