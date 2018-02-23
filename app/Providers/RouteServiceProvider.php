<?php

namespace App\Providers;

use Illuminate\Routing\Router;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
    * This namespace is applied to the controller routes in your routes file.
    *
    * In addition, it is set as the URL generator's root namespace.
    *
    * @var string
    */
    //changed this to null, as instructed to in the 4.2 -> 5 upgrade guide
    //protected $namespace = 'App\Http\Controllers';
    protected $namespace = null;

    /**
    * Define your route model bindings, pattern filters, etc.
    *
    * @return void
    */
    public function boot()
    {
        //

        parent::boot();
    }

    /**
    * Define the routes for the application.
    *
    * @param  \Illuminate\Routing\Router  $router
    * @return void
    */
    public function map(Router $router)
    {
        $router->group(['namespace' => $this->namespace], function ($router) {
            require app_path('Http/routes.php');
        });
    }
}
