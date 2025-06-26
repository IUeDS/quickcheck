<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class HttpsProtocol {
    //require SSL redirect if not in local environment and not a basic health check
    public function handle($request, Closure $next)
    {
        $env = config('app.env');
        $path = $request->getRequestUri();
        //if this line not included, then AWS load balancer not considered secure by Laravel due to header differences
        $request->setTrustedProxies([$request->getClientIp()], Request::HEADER_X_FORWARDED_AWS_ELB);

        if (!$request->secure() && $env !== 'local' && !strpos($path, 'health')) {
            return redirect()->secure($path);
        }

        return $next($request);
    }
}