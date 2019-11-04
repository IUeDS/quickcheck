<?php

namespace App\Exceptions;

class GradePassbackException extends \Exception
{
    public function __construct($message = 'Error sending grade to Canvas.', $code = 0, Exception $previous = null) {
        $this->message = $message;
        parent::__construct($this->message, $code, $previous);
    }

    public function getStatusCode() {
        return 500;
    }
}
