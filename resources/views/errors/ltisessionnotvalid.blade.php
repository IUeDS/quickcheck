@extends('layouts.master')

@section('title', 'User Not Found')

@section('content')
<main class="container-fluid">
    <div class="row">
        <div class="col-xs-12">
            <div class="alert alert-danger" role="alert">
                <p class="lead">Error: LTI Session Expired</p>
                <p>Your Canvas LTI session has expired. Please re-launch the tool in Canvas.</p>
            </div>
        </div>
    </div>
</main>


@stop