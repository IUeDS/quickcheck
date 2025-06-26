<?php

return [

    'caliper_enabled' => env('CALIPER_ENABLED', false), //whether Caliper is enabled in the app environment
    'caliper_sensor_host' => env('CALIPER_SENSOR_HOST', null), //host for the Caliper sensor, if enabled
    'canvas_api_token' => env('CANVAS_API_TOKEN', ''), //API token for Canvas
    'canvas_api_domain' => env('CANVAS_API_DOMAIN', 'https://iu.instructure.com/api/v1'), //domain for Canvas API calls
    'canvas_api_header' => env('CANVAS_API_HEADER', 'Authorization: Bearer '), //header for Canvas API calls
    'lti_client_id' => env('LTI_CLIENT_ID', ''), //LTI client ID for the app
    'lti_jwk_kid' => env('LTI_JWK_KID', ''), //LTI JWK key ID
    'lti_jwk_n' => env('LTI_JWK_N', ''), //LTI JWK n value
    'timeout_length' => env('TIMEOUT_LENGTH', 60), //timeout length in seconds for students retrying too many times
    'image_upload_file_driver' => env('IMAGE_UPLOAD_FILE_DRIVER', 'local'), //file driver for image uploads, local default, s3 for AWS, etc.

];