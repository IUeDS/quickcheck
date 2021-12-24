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
    * Send OAuth-signed XML in POST message (typically for reading/sending grade)
    *
    * @param  string  $endpoint
    * @param  string  $postBody
    * @return string
    */

    public function sendXmlInPost($endpoint, $postBody)
    {
        $contentType = "Content-type: application/xml";
        $header = $this->generateXmlHeader($endpoint, $postBody);

        $curlHeaders[0] = $header;
        $curlHeaders[1] = $contentType;

        $response = $this->curlPost($endpoint, $curlHeaders, $postBody);
        return $response;
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
    * @param  []      $rawParameters
    * @param  string  $url
    * @return string
    */

    private function buildSignature($rawParameters, $url)
    {
        $method = strtoupper($this->request->method()) . '&';
        $url = rawurlencode($url) . '&';
        $parameters = $this->encodeParameters($rawParameters);
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
        $builtSignature = $this->buildSignature($this->request->all(), $this->request->url());

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
    * Send a cURL POST request
    *
    * @param  string  $endpoint
    * @param  []      $headers
    * @param  string  $xml
    * @return string
    */

    private function curlPost($endpoint, $headers, $xml)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $endpoint);
        curl_setopt ($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }

    /**
    * Launch parameters should be url encoded in a string with ampersand between params
    *
    * @param  []  $parameters
    * @return string
    */

    private function encodeParameters($parameters)
    {
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

        //return in format with ampersand joining params
        $ampersand = rawurlencode('&');
        return implode($ampersand, $encodedParameters);
    }

    /**
    * Encode the XML header string when sending a signed XML request
    *
    * @param  []  $headers
    * @return string
    */

    private function encodeXmlHeader($headers)
    {
        $header = 'Authorization: OAuth realm=""';
        foreach($headers as $headerKey => $headerValue) {
            $key = ',' . rawurlencode($headerKey) . '=';
            $value = '"' . rawurlencode($headerValue) . '"';
            $header .= "{$key}{$value}";
        }

        return $header;
    }

    /**
    * Generate a nonce out of the current time, a random integer, and a hash
    *
    * @return string
    */

    private function generateNonce()
    {
        $time = microtime();
        $randomInt = random_int(0, 1000);
        return md5($time . $randomInt);
    }

    /**
    * Generate a header for signed XML requests
    *
    * @param  string  $endpoint
    * @param  string  $postBody
    * @return string
    */

    private function generateXmlHeader($endpoint, $postBody)
    {
        $bodyHash = base64_encode(sha1($postBody, true));
        $headers = [
            'oauth_version' => $this->version,
            'oauth_nonce' => $this->generateNonce(),
            'oauth_timestamp' => time(),
            'oauth_consumer_key' => $this->consumerKey,
            'oauth_body_hash' => $bodyHash,
            'oauth_signature_method' => $this->signatureMethod,
        ];
        $signature = $this->buildSignature($headers, $endpoint);
        $headers['oauth_signature'] = $signature;

        $header = $this->encodeXmlHeader($headers);
        return $header;
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
