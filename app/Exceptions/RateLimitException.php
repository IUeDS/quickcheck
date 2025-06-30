<?php

namespace App\Exceptions;

class RateLimitException extends \Exception
{
    public function __construct($message = null, $code = 0, Exception $previous = null) {
        $code = 429;
        $this->message = 'Too many web requests. Please try again later.';
        parent::__construct($this->message, $code, $previous);
    }

    public function getStatusCode() {
        return 429;
    }

}