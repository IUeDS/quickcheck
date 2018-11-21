<?php

namespace App\Exceptions;

use Exception;
use Log;
use Request;
use Session;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use App\Classes\LTI\LtiContext;

class Handler extends ExceptionHandler
{
    /**
    * A list of the exception types that should not be reported.
    *
    * @var array
    */
    protected $dontReport = [
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
        ValidationException::class,
        DeletedCollectionException::class,
        LtiLaunchDataMissingException::class,
        SessionMissingAssessmentDataException::class,
        SessionMissingStudentDataException::class,
        SessionMissingLtiContextException::class,
        OAuthExpiredTimestampException::class
    ];

    /**
    * Report or log an exception.
    *
    * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
    *
    * @param  \Exception  $e
    * @return void
    */
    public function report(Exception $e)
    {
        if (!$this->shouldReport($e)) {
            return;
        }

        //include additional request data and url as info in log for any
        //exceptions that are thrown by default exception in Laravel.
        $info = $e->getMessage();
        $info .= $this->getErrorRequest();
        Log::info($info);

        return parent::report($e);
    }

    /**
    * Render an exception into an HTTP response.
    *
    * @param  \Illuminate\Http\Request  $request
    * @param  \Exception  $e
    * @return \Illuminate\Http\Response
    */
    public function render($request, Exception $e)
    {
        $errorId = uniqid();
        $message = '';
        $statusCode = 500; //default

        switch($e) {
            case ($e instanceof LtiLaunchDataMissingException):
                //error is thrown before the page loads rather than through the API;
                //creating a new exception was the only way I could find to set a standard message
                $message = $e->getMessage();
                $this->logNotice($message, $errorId);
                $message .= $this->addErrorIdMessage($errorId); //add error ID for user
                $newException = new LtiLaunchDataMissingException($message);
                return response()->view('errors.500', ['exception' => $newException]);
                break;
            case ($e instanceof SessionMissingAssessmentDataException):
                $message = $e->getMessage();
                $this->logNotice($message, $errorId);
                break;
            case ($e instanceof SessionMissingStudentDataException):
                $message = $e->getMessage();
                $this->logNotice($message, $errorId);
                break;
            case ($e instanceof SessionMissingLtiContextException):
                $message = $e->getMessage();
                $this->logNotice($message, $errorId);
                break;
            case ($e instanceof OAuthExpiredTimestampException):
                //this error is thrown before the page loads rather than through the API;
                //creating a new exception was the only way I could find to set a standard message
                $message = $e->getMessage();
                $this->logNotice($message, $errorId);
                $message .= $this->addErrorIdMessage($errorId); //add error ID for user
                $newException = new OAuthExpiredTimestampException($message);
                return response()->view('errors.500', ['exception' => $newException]);
                break;
            case ($e instanceof OAuthException):
                $message = $e->getMessage();
                $this->logError($message, $errorId, $e->getTrace());
                return response()->view('errors.500', ['exception' => $e]);
                break;
            case ($e instanceof DeletedCollectionException):
                $message = $e->getMessage();
                $this->logNotice($message, $errorId);
                break;
            case ($e instanceof NotFoundHttpException):
                $message = '404 for path: ' . $request->path();
                $this->logNotice($message, $errorId);
                break;
            case ($e instanceof HttpException):
                $message = $e->getMessage();
                $this->logError($message, $errorId, $e->getTrace());
                break;
            case ($e instanceof ModelNotFoundException):
                $message = $e->getMessage();
                $e = new NotFoundHttpException($message, $e);
                break;
        }

        //return errors from API in a consistent fashion
        if ($this->isApiCall($request)) {
            $message .= $this->addErrorIdMessage($errorId); //add error ID for user
            return response()->error($statusCode, [ $message ]);
        }

        return parent::render($request, $e);
    }

    /**
    * Add a unique error ID to the error message.
    *
    * @param  string  $errorId
    * @return void
    */

    private function addErrorIdMessage($errorId)
    {
        return ' Your error ID is: ' . $errorId . '.';
    }

    /**
    * Get error request information
    *
    * @return string
    */

    private function getErrorRequest()
    {
        $requestInfo = "\nUrl: " . Request::url();
        $requestInfo .= "\nInput: " . json_encode(Request::all());
        $requestInfo .= "\nSession: " . json_encode(Session::all());
        $requestInfo .= "\nUser agent: " . Request::header('User-Agent') . "\n";
        return $requestInfo;
    }

    /**
    * Get the message to output to the log
    *
    * @param  string  $errorMessage
    * @param  string  $errorId
    * @return string
    */

    private function getLogMessage($errorMessage, $errorId)
    {
        $errorMessage .= ' Error ID: ' . $errorId;
        $ltiContext = new LtiContext();
        $userId = $ltiContext->getUserLoginId();
        if ($userId) {
            $errorMessage .= '. User ID: ' . $userId;
        }
        return $errorMessage;
    }

    /**
    * Get stack trace in plain text
    *
    * @param  []  $stackTrace
    * @return string
    */

    private function getStackTrace($stackTrace)
    {
        $fullText = "\nStack trace: \n";

        foreach($stackTrace as $index => $stackTraceItem) {
            $text = ("\n#" . $index . ": ");

            if (array_key_exists('file', $stackTraceItem)) {
                $location = $stackTraceItem['file'] . ":" . $stackTraceItem['line'] . ": ";
            }
            else {
                $location = "(internal function): ";
            }
            $text .= $location;

            if (array_key_exists('function', $stackTraceItem)) {
                $text .= ($stackTraceItem['function'] . "()\n");
            }

            if (array_key_exists('args', $stackTraceItem)) {
                $text .= "Arguments: \n";
                foreach($stackTraceItem['args'] as $argIndex => $arg) {
                    $text .= ("Arg #" . $argIndex . ": " . json_encode($arg) . "\n");
                }
            }

            $fullText .= $text;
        }

        return $fullText;
    }

    /**
    * Determine if error was triggered by an API call
    *
    * @param  \Illuminate\Http\Request  $request
    * @return boolean
    */

    private function isApiCall($request)
    {
        if (strpos($request->getUri(), '/api')) {
            return true;
        }

        return false;
    }

    /**
    * Log an error with identifiying information, if available
    *
    * @param  string  $errorMessage
    * @param  string  $errorId
    * @param  array $stackTrace
    * @return void
    */

    private function logError($errorMessage, $errorId, $stackTrace = false)
    {
        $errorMessage = $this->getLogMessage($errorMessage, $errorId);
        $errorMessage .= $this->getErrorRequest();

        if ($stackTrace) {
            $errorMessage .= $this->getStackTrace($stackTrace);
        }

        Log::error($errorMessage);
    }

    /**
    * Log an notice with identifiying information, if available
    *
    * @param  string  $errorMessage
    * @param  string  $errorId
    * @return void
    */

    private function logNotice($errorMessage, $errorId)
    {
        $errorMessage = $this->getLogMessage($errorMessage, $errorId);
        Log::notice($errorMessage);
    }
}
