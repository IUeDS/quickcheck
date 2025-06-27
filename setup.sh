#!/bin/sh
set -e

echo "Running setup script (as user: $(whoami))..." # Check who is running it

# Define your application's root directory and user (will be www-data by base entrypoint)
APP_ROOT="/var/www/html"
APP_USER="www-data" # This is the user the main process will run as

# 1. Ensure all primary writable directories (which are mounted volumes) exist and have correct permissions.
# The base image's entrypoint often ensures /var/www/html is owned by www-data.
# We just need to handle the specific mounted volumes.
echo "Setting permissions for mounted volumes: ${APP_ROOT}/storage, ${APP_ROOT}/bootstrap/cache, /tmp, /run/apache2..."

# These commands will run as root (or the user set by docker-php-entrypoint *before* it drops privileges).
# They *must* be run by a user with permission to chown/chmod these mount points.
# The base image's entrypoint is usually root for this initial setup phase.

# /var/www/html/storage
if [ -d "${APP_ROOT}/storage" ]; then
    chown -R "$APP_USER":"$APP_USER" "${APP_ROOT}/storage"
    chmod -R 775 "${APP_ROOT}/storage"
    echo "Permissions set for ${APP_ROOT}/storage"
else
    echo "Error: ${APP_ROOT}/storage does not exist. Ensure volume is correctly mounted in Task Definition."
    exit 1
fi

# /var/www/html/bootstrap/cache
if [ -d "${APP_ROOT}/bootstrap/cache" ]; then
    chown -R "$APP_USER":"$APP_USER" "${APP_ROOT}/bootstrap/cache"
    chmod -R 775 "${APP_ROOT}/bootstrap/cache"
    echo "Permissions set for ${APP_ROOT}/bootstrap/cache"
else
    echo "Error: ${APP_ROOT}/bootstrap/cache does not exist. Ensure volume is correctly mounted in Task Definition."
    exit 1
fi

# /tmp (needs permissions set by root)
if [ -d "/tmp" ]; then
    chown -R "$APP_USER":"$APP_USER" "/tmp"
    chmod -R 1777 "/tmp" # Standard /tmp permissions (sticky bit)
    echo "Permissions set for /tmp"
else
    echo "Error: /tmp does not exist. Ensure volume is correctly mounted in Task Definition."
    exit 1
fi

# /run/apache2 (needs permissions set by root)
if [ -d "/run/apache2" ]; then
    chown -R "$APP_USER":"$APP_USER" "/run/apache2"
    chmod -R 775 "/run/apache2" # Apache requires write permissions here
    echo "Permissions set for /run/apache2"
else
    echo "Error: /run/apache2 does not exist. Ensure volume is correctly mounted in Task Definition."
    exit 1
fi


# 2. Conditionally generate APP_KEY if not already set (for local dev)
# This will run as www-data by docker-php-entrypoint before php artisan.
# `php artisan` will handle the APP_KEY itself.
# We still need this check to export it for subsequent artisan commands in this script.
if [ -z "$APP_KEY" ]; then
    echo "APP_KEY is not set. Generating a new one..."
    GENERATED_KEY=$(gosu "$APP_USER" php artisan key:generate --show --no-ansi) # No gosu here, as script already running as www-data or root before privilege drop.
    export APP_KEY="$GENERATED_KEY"
    echo "Generated APP_KEY."
else
    echo "APP_KEY is already set."
fi

# 3. Generate Laravel cache files at runtime
echo "Generating Laravel cache files at runtime..."
# These commands will run as www-data (if the base entrypoint handles user switching before executing CMD).
gosu "$APP_USER" php artisan config:cache
gosu "$APP_USER" php artisan route:cache
gosu "$APP_USER" php artisan view:cache
gosu "$APP_USER" php artisan event:cache

# 4. Create storage symlink for public disk if it doesn't exist
echo "Checking and creating storage symlink..."
if [ ! -L "${APP_ROOT}/public/storage" ]; then
    if [ -d "${APP_ROOT}/public/storage" ]; then
        if [ -z "$(ls -A ${APP_ROOT}/public/storage)" ]; then
            echo "${APP_ROOT}/public/storage is an empty directory. Removing to create symlink."
            rmdir "${APP_ROOT}/public/storage"
        else
            echo "${APP_ROOT}/public/storage exists as a non-empty directory. Cannot create symlink. Manual intervention needed."
            exit 1
        fi
    fi
    gosu "$APP_USER" php artisan storage:link # This will run as www-data
    echo "Storage symlink created."
else
    echo "Storage symlink already exists."
fi

# 5. Execute the original Apache command.
# This will be the actual `apache2-foreground` command passed as an argument to this script.
# The base image's entrypoint will ensure this runs as www-data with correct file descriptors.
echo "Executing main application command: '$@'"
exec "$@" # Pass control to the final command (e.g., apache2-foreground)