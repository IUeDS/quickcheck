#!/bin/sh
set -e # Exit immediately if any command fails

# This script is only to be used for one-off artisan tasks in production.
echo "Starting artisan task setup..."

APP_ROOT="/var/www/html"
APP_USER="www-data" # The user your application expects to run as (Apache/PHP user)

# --- 1. Ensure Writable Volumes Exist and Have Correct Permissions ---
# These directories are mounted volumes. This script runs as root initially.
# We use `gosu root` for `chown`/`chmod` to ensure they execute with sufficient privileges,
# even if `docker-php-entrypoint` drops privileges earlier for subsequent commands.
echo "Setting permissions for mounted volumes: ${APP_ROOT}/storage, ${APP_ROOT}/bootstrap/cache, /tmp, /run/apache2..."

# /var/www/html/storage (main Laravel storage)
if [ -d "${APP_ROOT}/storage" ]; then
    gosu root chown -R "$APP_USER":"$APP_USER" "${APP_ROOT}/storage"
    gosu root chmod -R 775 "${APP_ROOT}/storage"
    echo "Permissions set for ${APP_ROOT}/storage"
else
    echo "Error: ${APP_ROOT}/storage does not exist. Ensure volume is correctly mounted in Task Definition."
    exit 1 # Critical failure
fi

# /var/www/html/bootstrap/cache (Laravel compiled cache)
if [ -d "${APP_ROOT}/bootstrap/cache" ]; then
    gosu root chown -R "$APP_USER":"$APP_USER" "${APP_ROOT}/bootstrap/cache"
    gosu root chmod -R 775 "${APP_ROOT}/bootstrap/cache"
    echo "Permissions set for ${APP_ROOT}/bootstrap/cache"
else
    echo "Error: ${APP_ROOT}/bootstrap/cache does not exist. Ensure volume is correctly mounted in Task Definition."
    exit 1 # Critical failure
fi

# /tmp (general temporary files)
if [ -d "/tmp" ]; then
    gosu root chown -R "$APP_USER":"$APP_USER" "/tmp"
    gosu root chmod -R 1777 "/tmp" # Standard /tmp permissions (sticky bit, globally writable)
    echo "Permissions set for /tmp"
else
    echo "Error: /tmp does not exist. Ensure volume is correctly mounted in Task Definition."
    exit 1 # Critical failure
fi

# /run/apache2 (Apache/system process files like locks/pids)
# Even if Apache isn't the primary process, some base system utilities might use /run,
# and it's a common default target for services that need ephemeral runtime files.
if [ -d "/run/apache2" ]; then
    gosu root chown -R "$APP_USER":"$APP_USER" "/run/apache2"
    gosu root chmod -R 775 "/run/apache2" # Writable by owner and group
    echo "Permissions set for /run/apache2"
else
    echo "Error: /run/apache2 does not exist. Ensure volume is correctly mounted in Task Definition."
    exit 1 # Critical failure
fi

echo "All required volume permissions set."

# --- 2. Generate Laravel Cache Files ---
# They are essential for Laravel's configuration and route loading during `artisan` execution.
echo "Generating Laravel cache files for artisan task..."
gosu "$APP_USER" php artisan config:cache
gosu "$APP_USER" php artisan route:cache # Even if less critical, ensures full boot context

echo "Laravel cache generation complete."

# --- 3. Run Artisan Command ---
echo "Running php artisan command..."
# Use `exec gosu` to ensure the artisan command runs as the app user,
# and its output/exit code are directly propagated to the container.
exec gosu "$APP_USER" php artisan "$@"

# The script will exit with the exit code of the command.
# If command succeeds, it exits 0. If it fails, it exits with Laravel's error code.
# Additional flags such as '--seed' can be passed as arguments to this script.
# Example: "command": ["/usr/local/bin/artisan_entrypoint.sh", ""]