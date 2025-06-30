<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/********************************************************************/
/****** PUBLIC VIEWS ************************************************/
/********************************************************************/

Route::get('/health', function () {
    config()->set('session.driver', 'array'); //disable sessions on health check
    return response('OK', 200);
});

//taking an assessment
Route::get('assessment/{id?}', 'AssessmentController@show'); //option to include id as query param instead of in route
Route::post('assessment/', 'AssessmentController@showLTI'); //id included as query param for LTI tool

//LTI config
Route::get('lticonfig', 'LtiController@returnLtiConfig');
Route::post('logininitiations', 'LtiController@initializeOIDC');

//errors
Route::get('usernotfound', 'UserController@userNotFound');
Route::get('sessionnotvalid', 'UserController@sessionNotValid');
Route::get('ltisessionnotvalid', 'UserController@ltiSessionNotValid');
Route::get('error', function() {
    return displaySPA();
});

//documentation
Route::get('documentation', function() {
    return displaySPA();
});

//establish cookie trust (in Safari)
Route::get('establishcookietrust', function() {
    return displaySPA();
});

/********************************************************************/
/****** MANAGE HOMEPAGE AND STUDENT VIEW ****************************/
/********************************************************************/

Route::group(['middleware' => ['manageAuth']], function() {
    Route::post('home', 'HomeController@home'); //LTI manage launch URL
    Route::get('student', 'ReleaseController@contextReleaseIndex'); //student home page (redirected from home)
});

/********************************************************************/
/****** INSTRUCTOR VIEWS ********************************************/
/********************************************************************/

Route::group(array('middleware' => array('auth')), function() {

    //assessment views
    Route::get('assessment/{id}/edit', 'AssessmentController@edit');

    //collection views
    Route::get('collection', 'CollectionController@indexView');
    Route::get('collection/{id}', 'CollectionController@show');

    //CSV downloads
    Route::get('attempts/csv/download/{context_id}/{student_id?}', 'CSVController@exportCourseAttempts');
    Route::get('attempts/csv/download/context/{context_id}/assessment/{assessment_id}', 'CSVController@exportAssessmentAttempts');
    Route::get('responses/csv/download/assessment/{assessment_id}/context/{context_id}', 'CSVController@exportAssessmentResponses');
    Route::get('users/csv/groups/course/{courseId}', 'CSVController@getUsersInGroups');

    //home page
    Route::get('home', 'HomeController@home');
    Route::get('/', 'HomeController@home');

    //manage views
    //instructor manage view to see overview of student results; includes query param for LTI context ID
    Route::get('manage', 'AttemptController@manageOverview');
    //instructor manage view to see attempts for a specific assessment in an LTI context
    Route::get('assessment/{id}/attempts/{assignmentId?}/{resourceLinkId?}', 'AttemptController@manageAttempts');
    //instructor manage view to see attempts for a specific student in an LTI context
    Route::get('student/{studentId}/attempts', 'AttemptController@viewAttemptsForStudent');

    //QTI downloads
    Route::post('exportQTI', 'QtiController@exportQTI');

    //select an LTI link in Canvas
    Route::post('select', 'CollectionController@selectLink');
    Route::get('select', 'CollectionController@viewSelectLink');
});

//Rate limit 404s to prevent malicious bots/crawling
Route::fallback(function () {
    abort(404, 'Page not found.');
})->middleware('throttle:global_web_protection');