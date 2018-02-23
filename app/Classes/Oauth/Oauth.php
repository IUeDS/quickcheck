<?php

namespace App\Classes\Oauth;

use App\Exceptions\OAuthExpiredTimestampException;
use App\Exceptions\OAuthException;

class Oauth
{
    private $consumerKey;
    private $request;
    private $secret;
    private $signatureMethod = "HMAC-SHA1";
    private $timestampThreshold = 300; //in seconds, 5 minutes
    private $version = "1.0";

    public function __construct($consumerKey, $request, $secret)
    {
        $this->consumerKey = $consumerKey;
        $this->request = $request;
        $this->secret = $secret;

        if (!$this->consumerKey) {
            throw new OAuthException("Consumer key not supplied.");
        }

        if (!$this->secret) {
            throw new OAuthException("Tool installation secret not supplied.");
        }
    }

    /**
    * Verify that the OAuth launch information is valid
    *
    * @return void
    */

    public function verify()
    {
        $version = $this->getOauthVersion();
        $this->checkTimestamp();
        $this->checkSignatureMethod();
        $this->checkSignature();
    }

    /**
    * Build the OAuth signature string and hash
    *
    * @return string
    */

    private function buildSignature()
    {
        $method = strtoupper($this->request->method()) . '&';
        $url = rawurlencode($this->request->url()) . '&';
        $parameters = $this->encodeLaunchParameters();
        $signatureString = "{$method}{$url}{$parameters}"; //combine all parts

        //encode the signature
        $key = rawurlencode($this->secret) . '&';
        $hashedSignature = base64_encode(hash_hmac('sha1', $signatureString, $key, true));
        return $hashedSignature;
    }

    /**
    * Check that the signature sent in POST matches with our generated signature
    *
    * @return void
    */

    private function checkSignature()
    {
        $signature = $this->request->input('oauth_signature');
        $builtSignature = $this->buildSignature();

        if ($signature !== $builtSignature) {
            throw new OAuthException("Invalid oauth signature.");
        }
    }

    /**
    * Check that the signature method for the hash in the POST launch vars matches ours
    *
    * @return void
    */

    private function checkSignatureMethod()
    {
        $signatureMethod = $this->request->input('oauth_signature_method');
        if ($signatureMethod !== $this->signatureMethod) {
            throw new OAuthException('Oauth signature method is invalid.');
        }
    }

    /**
    * Check that the timestamp was sent recently
    *
    * @return void
    */

    private function checkTimestamp()
    {
        $timestamp = $this->request->input('oauth_timestamp');
        $now = time();
        if ($now - $timestamp > $this->timestampThreshold) {
            throw new OAuthExpiredTimestampException;
        }
    }

    /**
    * Launch parameters should be url encoded in a string with ampersand between params
    *
    * @return string
    */

    private function encodeLaunchParameters()
    {
        $parameters = $this->request->all();

        // Parameters are sorted by name, using lexicographical byte value ordering.
        // Ref: Spec: 9.1.1 (1)
        uksort($parameters, 'strcmp');

        //params should be url encoded and in format of: key1=value1&key2=value2, etc.
        $encodedParameters = [];
        foreach($parameters as $key => $value) {
            // Ref: Spec: 9.1.1 ("The oauth_signature parameter MUST be excluded.")
            if ($key === 'oauth_signature') {
                continue;
            }

            $parameterString = rawurlencode($key);
            $parameterString .= rawurlencode('=');
            //apparently must be encoded twice to be counted as valid?
            //was running into errors when value was only encoded once.
            $value = rawurlencode($value);
            $parameterString .= rawurlencode($value);
            array_push($encodedParameters, $parameterString);
        }

        //return in format with url encoded & character between params
        return implode($encodedParameters, '%26'); //urlencoded &
    }

    /**
    * Ensure that the oauth version in the launch POST params matches ours
    *
    * @return string
    */

    private function getOauthVersion()
    {
        $version = $this->request->input('oauth_version');
        if (!$version) {
            $version = $this->version;
        }

        if ($version != $this->version) {
            throw new OAuthException("OAuth version '$version' not supported");
        }

        return $version;
    }
}
