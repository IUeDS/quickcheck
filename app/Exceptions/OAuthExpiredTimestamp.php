<?php

namespace App\Exceptions;

class OAuthExpiredTimestampException extends \Exception
{
    public function __construct($message = null, $code = 0, Exception $previous = null) {
        $this->message = 'Your external tool launch timestamp has expired, please refresh the page.';
        parent::__construct($this->message, $code, $previous);
    }

    public function getStatusCode() {
        return 500;
    }

}