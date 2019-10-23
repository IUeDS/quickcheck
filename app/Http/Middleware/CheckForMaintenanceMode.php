<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Http\Exceptions\MaintenanceModeException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpFoundation\IpUtils;

class CheckForMaintenanceMode
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $maintenanceMode = false;
        $maintenance = DB::table('maintenance')->first();
        //check to see that DB row exists; if not, allow to continue on
        if ($maintenance) {
            $maintenanceMode = $maintenance->is_maintenance_mode;
            $allowedIp = $maintenance->allowed_ip;
        }

        if ($maintenanceMode) {
            if (isset($allowedIp) && IpUtils::checkIp($request->ip(), $allowedIp)) {
                return $next($request);
            }

            if ($request->is('health') || $request->is('error')) {
                return $next($request);
            }

            $time = time();
            throw new MaintenanceModeException($time);
        }

        return $next($request);
    }
}
