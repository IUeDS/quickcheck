<?php

use App\Classes\ExternalData\QTI as QTI;
use Illuminate\Http\UploadedFile;

class QtiController extends \BaseController
{

    /************************************************************************/
    /* API ENDPOINTS ********************************************************/
    /************************************************************************/

    /**
    * If there is a critical error on import and the user still wants to save remaining quizzes
    *
    * @return Response
    */

    public function createImportedQuizzes() {
        $input = Input::all();
        $qti = new QTI();
        $response = $qti->saveImportedQuizzes($input);
        return response()->success($response);
    }

    /**
    * Export selected quick checks into a QTI package
    *
    * @return Response (download, .zip file)
    */

    public function exportQTI() {
        //NOTE: assuming that on the front-end, only non-custom-assessments were selectable
        $input = Input::all();
        $qti = new QTI();
        $downloadLocation = $qti->exportQTI($input);
        if ($downloadLocation) {
            return Response::download($downloadLocation);
        }
        else {
            return response()->error(400, ['There was an error exporting the QTI package.']);
        }
    }

    /**
    * Import uploaded QTI file and convert to quick checks
    *
    * @return Response
    */

    public function importQTI() {
        $zipName = 'importFile';
        if (Input::file($zipName)->getClientOriginalExtension() === 'zip') {
            $input = Input::all();
            $zipFile = Input::file($zipName);
            $qti = new QTI();
            $response = $qti->importQTI($input, $zipFile);
            return response()->success($response);
        }
        else {
            return response()->error(400, ['reason' => 'Uploaded file was not a .zip file']);
        }
    }
}
