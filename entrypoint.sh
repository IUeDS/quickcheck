#!/bin/sh
set -e

# 1. Ensure Laravel's writable directories exist and have correct permissions
# These will be mounted volumes, so permissions need to be set after mount.
echo "Setting permissions for Laravel writable directories..."
if [ -d "/var/www/html/storage" ]; then
    chmod -R 775 /var/www/html/storage
    chown -R www-data:www-data /var/www/html/storage
else
    echo "/var/www/html/storage does not exist, ensure volume is mounted."
fi

# bootstrap/cache also needs to be writable and is where config/route cache goes
if [ -d "/var/www/html/bootstrap/cache" ]; then
    chmod -R 775 /var/www/html/bootstrap/cache
    chown -R www-data:www-data /var/www/html/bootstrap/cache
else
    echo "/var/www/html/bootstrap/cache does not exist, ensure volume is mounted."
    exit 1 # Fail if cache isn't mounted as expected
fi

# 2. Generate Laravel cache files at runtime
# These commands must run *after* APP_KEY is available (from Task Definition / .env)
# and after writable volumes are ready.
echo "Generating Laravel cache files at runtime..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache # If you use event caching

# 3. Execute the original Apache command
exec "$@"