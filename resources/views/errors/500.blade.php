@extends('layouts.master')

@section('title', 'Quick Check Error')

@section('content')
<main class="container-fluid">
    <div class="row">
        <div class="col-xs-12">
            <h1>Quick Check Error</h1>
            <div class="alert alert-danger" role="alert">
                <!--<p class="lead">Quick Check error:</p>-->
                <p>{{ $exception->getMessage() }}</p>
            </div>
        </div>
    </div>
</main>


@stop