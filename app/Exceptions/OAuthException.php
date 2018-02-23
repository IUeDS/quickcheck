<?php

namespace App\Exceptions;

class OAuthException extends \Exception
{
    public function getStatusCode() {
        return 500;
    }
}