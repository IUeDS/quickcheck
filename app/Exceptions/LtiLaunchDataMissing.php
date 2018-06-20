<?php

namespace App\Exceptions;

class LtiLaunchDataMissingException extends \Exception
{
    public function __construct($message = null, $code = 0, Exception $previous = null) {
        $this->message = 'Necessary data from Canvas was missing in the Quick Check tool launch, please refresh the page.';
        parent::__construct($this->message, $code, $previous);
    }

    public function getStatusCode() {
        return 500;
    }
}
