<?php

namespace App\Exceptions;

class DeletedCollectionException extends \Exception
{
    public function __construct($message = null, $code = 0, Exception $previous = null) {
        $this->message = 'The set that this Quick Check belongs to has been deleted.';
        parent::__construct($this->message, $code, $previous);
    }

    public function getStatusCode() {
        return 404;
    }
}
