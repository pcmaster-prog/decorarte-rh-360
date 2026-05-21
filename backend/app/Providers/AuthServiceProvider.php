<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Super-admin check
        Gate::before(function ($user, $ability) {
            if ($user->hasRole('admin')) {
                return true;
            }
        });

        // Dynamic permission checking
        Gate::define('has-permission', function ($user, string $permission) {
            return $user->hasPermission($permission);
        });
    }
}
