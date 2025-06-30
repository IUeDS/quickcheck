<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route; 
use App\Exceptions\RateLimitException;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        parent::boot();
        $this->configureRateLimiting(); //MGM 6/30/25: added this for rate limiting 404s to prevent malicious bot crawling
    }

    /**
     * Define the route model bindings, pattern filters, and other route configuration.
     */
    public function map(): void 
    {
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));

        Route::middleware('web')
            ->group(base_path('routes/web.php'));

        // If you have console or channels routes:
        Route::middleware('web') 
             ->group(base_path('routes/console.php')); 
    }

    protected function configureRateLimiting(): void
    {
        //NOTE: MGM, 6/30/25: Currently rate limiting is only used for 404s to prevent malicious scanning of URLs. 
        //The limit is intentionally set to be low. If rate limiting is used for named routes in the application, then
        //these rates should be increased to 60 for web and 30 for the API. Because the rate limiter depends on the
        //cache, this 404-only behavior is intended to limit interaction with the database cache so DB performance is
        //not negatively impacted, nor end users making legitimate requests. If redis is used for the cache in the
        //future, or similar, then adding global rate limiting may be effective without affecting performance.
        RateLimiter::for('global_web_protection', function (Request $request) {
            return Limit::perMinute(20)->by($request->ip())
                ->response(function (Request $request, array $headers) {
                    throw new RateLimitException;
                });
        });

        RateLimiter::for('api_protection', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip())
                ->response(function (Request $request, array $headers) {
                    throw new RateLimitException;
                });
        });
    }
}