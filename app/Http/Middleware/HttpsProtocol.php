<?php

namespace App\Http\Middleware;

use Closure;

class HttpsProtocol {
    //require SSL redirect if not in local environment and not a basic health check
    public function handle($request, Closure $next)
    {
        $env = env('APP_ENV');
        $path = $request->getRequestUri();
        if (!$request->secure() && $env !== 'local' && !strpos($path, 'health')) {
            return redirect()->secure($path);
        }

        return $next($request);
    }
}