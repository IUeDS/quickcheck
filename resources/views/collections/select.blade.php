@extends('layouts.master')

@section('title', 'Select External Tool Link')

@section('content')
<main class="container-fluid">
    <!-- put redirect and launch urs in hidden form input so we can redirect on selection -->
    <input type="hidden" value="{{$redirectUrl}}" id="redirect-url" />
    <input type="hidden" value="{{$launchUrlStem}}" id="launch-url-stem" />
    <app-root></app-root>
</main>

@stop