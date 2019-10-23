<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
    * The application's global HTTP middleware stack.
    *
    * @var array
    */
    //updated middleware -- removed CSRF token middleware so app works in LTI iframe
    protected $middleware = [
        \App\Http\Middleware\TrustProxies::class,
        \App\Http\Middleware\CheckForMaintenanceMode::class,
        \App\Http\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \App\Http\Middleware\HttpsProtocol::class
    ];

    /**
    * The application's route middleware.
    *
    * @var array
    */
    protected $routeMiddleware = [
        'auth' => \App\Http\Middleware\Authenticate::class,
        'manageAuth' => \App\Http\Middleware\ManageAuthenticate::class,
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
    ];
}
