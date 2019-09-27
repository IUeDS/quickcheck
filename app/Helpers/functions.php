<?php
//see Arian Acosta's answer for source: https://stackoverflow.com/questions/32419619/how-do-i-make-global-helper-functions-in-laravel-5
use Illuminate\Support\Facades\File;

function displaySPA() {
    return File::get(public_path() . '/assets/dist/index.html');
}