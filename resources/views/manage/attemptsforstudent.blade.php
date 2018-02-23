@extends('layouts.master')

@section('title', 'Individual student attempts')

@section('content')
<main class="container-fluid">
    <qc-view-attempts-for-student></qc-view-attempts-for-student>
</main>
@stop