<?php

namespace App\Exceptions;

class SessionMissingAssessmentDataException extends \Exception
{
    public function __construct($message = null, $code = 0, Exception $previous = null) {
        $this->message = 'Necessary assessment data was missing from your session, please refresh the page.';
        parent::__construct($this->message, $code, $previous);
    }

    public function getStatusCode() {
        return 500;
    }
}