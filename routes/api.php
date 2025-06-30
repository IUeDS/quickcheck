<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/********************************************************************/
/****** PUBLIC API **************************************************/
/********************************************************************/

//Initializing an attempt
Route::post('attempt/{assessmentId}', 'AttemptController@launchAttempt');

//Quiz-taking
Route::get('assessment/{id}/questions', 'AssessmentController@getAssessmentQuestions');
Route::post('question/{id}/submit', 'QuestionController@submit');

//Custom activities
Route::post('attempt/update/{id}', 'AttemptController@updateAttempt');
Route::post('response/{id}', 'StudentResponseController@insertResponse');

//Grade passback (requires existing attempt in the database)
Route::post('grade/passback', 'GradeController@passback');

//API error for instructors with an expired session
Route::get('sessionnotvalid', 'UserController@apiSessionNotValid');

//Third party cookie check
Route::get('checkcookies', 'UserController@checkCookies');

/********************************************************************/
/****** MANAGE HOMEPAGE AND STUDENT VIEW ****************************/
/********************************************************************/

Route::group(['middleware' => ['manageAuth']], function() {
    Route::get('assessment/{id}/attempt/{context_id}', 'AttemptController@getStudentAssessmentAttempts');
    Route::get('release/{context_id}', 'ReleaseController@getReleasedAssessments');
});

/********************************************************************/
/****** INSTRUCTOR API ********************************************/
/********************************************************************/

Route::group(array('middleware' => array('auth')), function() {

    //assessment endpoints
    Route::get('assessment/{id}', 'AssessmentController@getAssessment');
    Route::put('assessment/{id}', 'AssessmentController@update');
    Route::delete('assessment/{id}', 'AssessmentController@destroy');
    Route::post('assessment', 'AssessmentController@store');
    Route::post('assessment/{id}/copy', 'AssessmentController@copy');
    Route::post('assessment/imageupload', 'AssessmentController@imageUpload');

    //assessment group endpoints
    Route::post('assessmentgroup', 'AssessmentGroupController@store');
    Route::put('assessmentgroups/{id}', 'AssessmentGroupController@update');
    Route::delete('assessmentgroups/{id}', 'AssessmentGroupController@destroy');

    //collection endpoints
    Route::get('collection/{id}', 'CollectionController@getCollection');
    Route::get('collections/{assessments?}', 'CollectionController@index');
    Route::get('user/collection/{id}', 'CollectionController@getUserPermissions');
    Route::post('collection', 'CollectionController@store');
    Route::put('collection/{id}', 'CollectionController@update');
    Route::delete('collection/{id}', 'CollectionController@destroy');
    Route::post('quickadd', 'CollectionController@quickAdd');
    Route::post('collection/{id}/search', 'CollectionController@search');
    Route::post('createDeepLinkingJwt', 'CollectionController@createDeepLinkingJwt');

    //public collection endpoints
    Route::get('publiccollections', 'CollectionController@publicIndex');
    Route::put('publiccollection/{collectionId}', 'CollectionController@publicToggle');

    //collection feature endpoints
    Route::get('features/collection/{collectionId}', 'CollectionFeatureController@getFeatures');
    Route::put('feature/{id}', 'CollectionFeatureController@update');

    //membership endpoints
    Route::get('memberships/{assessments?}', 'MembershipController@index');
    Route::post('membership', 'MembershipController@store');
    Route::get('membership/collection/{id}', 'MembershipController@getCollectionMembership');
    Route::put('membership/collection/{id}', 'MembershipController@updateCollectionMembership');

    //public collection membership endpoints
    Route::post('publicmembership/collection/{collectionId}', 'PublicMembershipController@store');
    Route::delete('publicmembership/collection/{collectionId}', 'PublicMembershipController@destroy');

    //custom activity endpoints
    Route::get('customActivities', 'CustomActivityController@index');
    Route::post('customActivity', 'CustomActivityController@store');
    Route::put('customActivity/{id}', 'CustomActivityController@update');
    Route::delete('customActivity/{id}', 'CustomActivityController@destroy');

    //grade endpoints
    Route::get('assessment/{id}/attempts/context/{context_id}/submissions/{assignmentId?}', 'GradeController@index');
    Route::get('assessment/{assessmentId}/attempts/{contextId}/submission/{studentId}', 'GradeController@show');
    Route::post('attempts/gradepassback', 'GradeController@store');
    Route::post('attempts/autograde', 'GradeController@autoGrade');

    //QTI endpoints
    Route::post('importQTI', 'QtiController@importQTI');
    Route::post('createImportedQuizzes', 'QtiController@createImportedQuizzes');

    //release endpoints
    Route::post('release', 'ReleaseController@createRelease');
    Route::delete('release/{id}', 'ReleaseController@rollbackRelease');

    //results endpoints
    Route::get('attempts/{id}', 'AttemptController@getAttemptsForContext');
    Route::get('assessment/{id}/attempts/context/{context_id}/{assignmentId?}/{resourceLinkId?}', 'AttemptController@getAttemptsForAssessment');
    Route::get('attempt/{id}/responses', 'StudentResponseController@getAttemptResponses');
    Route::get('responses/analytics/assessment/{id}/context/{context_id}/assignment/{assignment_id?}/resourceLinkId/{resource_link_id?}', 'StudentResponseController@calculateAnalytics');
    Route::get('attempts/{contextId}/student/{studentId}', 'AttemptController@getAttemptsForStudentInCourse');
    Route::get('analytics/context/{contextId}/student/{studentId}', 'StudentController@calculateStudentAnalytics');

    //student endpoints
    Route::get('students/context/{contextId}', 'StudentController@getStudentsByContext');

    //user endpoints
    Route::get('user', 'UserController@show');
    Route::get('user', 'UserController@show');
    Route::post('user/addAdmin', 'UserController@addAdmin');
    Route::post('user/validate', 'UserController@validateUser');
    Route::get('users/course/{id}', 'UserController@getUsersInCourse');
});

Route::fallback(function () {
    return response()->json(['message' => 'API endpoint not found.'], 404);
})->middleware('throttle:api_protection');