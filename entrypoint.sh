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

# 2. Conditionally generate APP_KEY if not already set
# This handles fresh local development setups.
# In production, APP_KEY will be provided as an env var and this step will be skipped.
if [ -z "$APP_KEY" ]; then
    echo "APP_KEY is not set. Generating a new one..."
    # Generate APP_KEY. This will *not* write to the .env file in the read-only container,
    # but rather output to stdout, and then capture it to set in the current shell's env.
    # It will also implicitly be picked up by the artisan commands that follow.
    GENERATED_KEY=$(php artisan key:generate --show --no-ansi)
    export APP_KEY="$GENERATED_KEY"
    echo "Generated APP_KEY."
else
    echo "APP_KEY is already set."
fi

# 3. Generate Laravel cache files at runtime
# These commands must run *after* APP_KEY is available (from Task Definition / .env)
# and after writable volumes are ready.
echo "Generating Laravel cache files at runtime..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache # If you use event caching

# 4. Create storage symlink for public disk if it doesn't exist
# Check if /var/www/html/public/storage is a symlink or a directory
echo "Checking and creating storage symlink..."
if [ ! -L "/var/www/html/public/storage" ]; then
    # If it's not a symlink, check if it's a directory (and remove it if it's an empty one)
    if [ -d "/var/www/html/public/storage" ]; then
        # This handles cases where a developer might accidentally create the folder manually
        # or if a previous build step left a non-symlink directory behind.
        # Only remove if it's empty to avoid data loss.
        if [ -z "$(ls -A /var/www/html/public/storage)" ]; then
            echo "/var/www/html/public/storage is an empty directory. Removing to create symlink."
            rmdir "/var/www/html/public/storage"
        else
            echo "/var/www/html/public/storage exists as a non-empty directory. Cannot create symlink. Manual intervention needed."
            exit 1 # Fail if it's a non-empty directory that can't be linked
        fi
    fi
    # Attempt to create the symlink
    php artisan storage:link
    echo "Storage symlink created."
else
    echo "Storage symlink already exists."
fi

# 5. Execute the original Apache command
exec "$@"