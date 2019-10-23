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
            if ($request->is('health') || $request->is('error')) {
                return $next($request);
            }

            if (isset($allowedIp) && IpUtils::checkIp($this->getIp(), $allowedIp)) {
                return $next($request);
            }

            $time = time();
            throw new MaintenanceModeException($time);
        }

        return $next($request);
    }

    //Laravel's built-in function get IP is not accurate behind a load balancer
    //source: https://stackoverflow.com/questions/33268683/how-to-get-client-ip-address-in-laravel-5/41769505
    public function getIp(){
        foreach (['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR'] as $key){
            if (array_key_exists($key, $_SERVER) === true){
                foreach (explode(',', $_SERVER[$key]) as $ip){
                    $ip = trim($ip); // just to be safe
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false){
                        return $ip;
                    }
                }
            }
        }
    }
}
