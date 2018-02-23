@extends('layouts.master')

@section('title', 'User Not Found')

@section('content')
<main class="container-fluid">
    <div class="row">
        <div class="col-xs-12">
            <div class="alert alert-danger" role="alert">
                <p class="lead">Error: User not Found</p>
                <p>Only verified instructors and course designers can access this page. If you are an instructor or course designer, please access the Quick Check tool in the left nav of Canvas first, to verify your role, before attempting to access this page.</p>
            </div>
        </div>
    </div>
</main>


@stop