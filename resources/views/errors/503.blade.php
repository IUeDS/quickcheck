@extends('layouts.master')

@section('title', 'Maintenance mode')

@section('content')
<main class="container-fluid">
    <div class="row">
        <div class="col-xs-12">
            <div class="alert alert-info" role="alert">
                <p class="lead">Scheduled maintenance in progress</p>
                <p>Quick Check is currently unavailable. Maintenance updates are currently being performed on the system, please try again later.</p>
            </div>
        </div>
    </div>
</main>


@stop