# Stage 1: Builder - for installing dependencies and building assets
# This stage contains all build tools and development dependencies.
FROM public.ecr.aws/docker/library/php:8.2-apache AS builder

# Set Environment Variables for non-interactive commands during build.
ARG DEBIAN_FRONTEND=noninteractive

# Switch to root user for installing packages and building the application.
USER root

# Install build tools and system dependencies required for PHP extensions and Node.js.
RUN apt-get update -yqq && \
  apt-get install -yqq --no-install-recommends \
    apt-utils \
    openssl \
    libzip-dev zip unzip \
    libmariadb-dev \
    libpng-dev

# Install PHP extensions required for the application.
RUN docker-php-ext-install pdo_mysql zip
RUN docker-php-ext-configure gd
RUN docker-php-ext-install gd

# Get Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Install Node.js, npm, and Angular CLI for frontend build.
# The NodeSource script adds the Node.js APT repository, then installs nodejs.
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get update -yqq && \
    apt-get install -yqq --no-install-recommends nodejs && \
    npm install -g @angular/cli

# Set Timezone for the builder stage. Default is US/Eastern, can be overridden during build.
ARG TZ=US/Eastern
ENV TZ ${TZ}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Use the default production configuration and copy custom settings afterward.
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY resources/php.ini $PHP_INI_DIR/conf.d/

# Create a blank .env file to satisfy Laravel's startup requirement.
# This file will NOT contain any secrets. Actual env vars come from the container definition or runtime.
RUN touch .env

# Define the application working directory.
ARG WORK_DIR=/var/www/html
# Set current working directory for subsequent commands within this stage.
WORKDIR ${WORK_DIR}

# Copy Composer and npm configuration files first. This allows Docker to cache the dependency
# installation steps if only the application code changes, not the dependencies themselves.
COPY composer.json composer.lock ./
COPY package.json package-lock.json ./

# Copy the rest of your entire application source code into the working directory.
# This makes the complete application code part of this immutable container image layer.
COPY . ${WORK_DIR}

# Install ALL Composer dependencies (including dev dependencies for local development consistency).
# --optimize-autoloader optimizes Composer's autoloader for faster execution.
ENV COMPOSER_HOME /composer
ENV PATH ./vendor/bin:/composer/vendor/bin:$PATH
ENV COMPOSER_ALLOW_SUPERUSER 1
RUN composer install --optimize-autoloader

# Install front-end (npm/Angular) dependencies and build the Angular application into static assets.
RUN npm install
RUN ng build --configuration "production"

# Copy hashed CSS output to a non-hashed file for TinyMCE editor compatibility.
RUN cp public/assets/dist/browser/styles-*.css public/assets/dist/browser/styles.css

# --- Stage 2: Production - The lean final image for deployment ---
# This stage starts from a fresh base image, ensuring no build tools are included.
FROM public.ecr.aws/docker/library/php:8.2-apache AS production

# Set Environment Variables for non-interactive commands.
ARG DEBIAN_FRONTEND=noninteractive

# Switch to root user for configuring the runtime environment.
USER root

# Set Timezone for the production stage. This is essential for correct logging timestamps etc.
ARG TZ=US/Eastern
ENV TZ ${TZ}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Copy custom php.ini settings for the production runtime.
COPY resources/php.ini $PHP_INI_DIR/conf.d/

# Configure Apache Logs to stdout/stderr. This is crucial for enabling a read-only root filesystem,
# as Apache will no longer attempt to write to local log files. Docker will capture these streams.
RUN sed -i 's!CustomLog \${APACHE_LOG_DIR}/access.log combined!CustomLog /proc/self/fd/1 combined!g' /etc/apache2/apache2.conf && \
    sed -i 's!ErrorLog \${APACHE_LOG_DIR}/error.log!ErrorLog /proc/self/fd/2!g' /etc/apache2/apache2.conf && \
    # Also adjust any site-specific log directives if they exist in sites-available.
    # Redirect the custom log to /dev/null to avoid writing to disk, it would otherwise log every request made to the app.
    find /etc/apache2/sites-available -type f -name "*.conf" -exec sed -i 's!CustomLog .*!CustomLog /dev/null combined!g' {} + && \
    find /etc/apache2/sites-available -type f -name "*.conf" -exec sed -i 's!ErrorLog .*!ErrorLog /proc/self/fd/2!g' {} + && \
    # Disable specific Apache configurations that might cause issues with read-only filesystems.
    a2disconf serve-cgi-bin.conf

# Set Apache's document root to Laravel's public directory.
ARG WORK_DIR=/var/www/html
ENV APACHE_DOCUMENT_ROOT ${WORK_DIR}/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
RUN a2enmod rewrite headers

# Create application directory structure. This ensures the target directory for copying exists.
RUN mkdir -p ${WORK_DIR}

# IMPORTANT: Install ALL runtime dependencies for PHP extensions in the production stage.
# These are the *runtime* libraries (non-dev versions) that the compiled .so files depend on.
# libpng16-16 for GD's PNG support
# libjpeg62-turbo for GD's JPEG support
# libwebp7 for GD's WebP support
# libxpm4 for GD's XPM support
# libfreetype6 for GD's FreeType (fonts) support
# libzip4 for PHP's ZIP extension
# libmariadb3 for PHP's PDO MySQL extension
RUN apt-get update -yqq && \
    apt-get install -yqq --no-install-recommends \
    libjpeg62-turbo \
    gosu \
    libpng16-16 \
    libwebp7 \
    libxpm4 \
    libfreetype6 \
    libzip4 \
    libmariadb3 \
    # OpenSSL runtime libraries and tools (CRUCIAL FOR JWT/LTI SSL VALIDATION)
    openssl \
    ca-certificates \
    libcurl4 \
    # Clean up apt cache immediately after install and other temporary files
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /var/log/lastlog /var/log/faillog

# Copy PHP extension .ini files from the builder stage
# These files tell PHP to load the extensions.
COPY --from=builder /usr/local/etc/php/conf.d/ /usr/local/etc/php/conf.d/
# Also copy the actual extension .so files if they are not part of the base image or were custom-built
COPY --from=builder /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/

# Copy the built application code and its production dependencies from the 'builder' stage.
# This crucial step ensures that build tools like Node.js, npm, and Composer are NOT included
# in the final production image, minimizing its size and attack surface.
COPY --from=builder ${WORK_DIR} ${WORK_DIR}

# --- Runtime Entrypoint for Writable Volumes ---
# This part is critical for setting permissions on volumes mounted at runtime.
# For Laravel's `storage/` directory to be writable, it MUST be mounted as a volume
# (e.g., as an ephemeral Docker volume or EFS).
# This `entrypoint.sh` script will run at container startup and set correct permissions
# for the `www-data` user on the *mounted* volume.

# Include and use the entrypoint script.
# NOTE: we will begin running the entrypoint script as root, but it will switch to the `www-data` user
# before starting the Apache service. This is a common pattern to ensure that the web server has
# the necessary permissions to write to the storage directory while still running with minimal privileges.
COPY setup.sh /usr/local/bin/setup.sh
RUN chmod +x /usr/local/bin/setup.sh

# Copy the migration entrypoint script, which will handle database migrations and other setup tasks.
# This script is only run if the task being run is a database migration as its own separate task.
# It is not run as part of the main application startup. A CMD override must be provided to run it.
COPY migrate_entrypoint.sh /usr/local/bin/migrate_entrypoint.sh
RUN chmod +x /usr/local/bin/migrate_entrypoint.sh

# Also copy the artisan entrypoint script, which is used for one-off artisan tasks.
COPY artisan_entrypoint.sh /usr/local/bin/artisan_entrypoint.sh
RUN chmod +x /usr/local/bin/artisan_entrypoint.sh

# Expose port 80 to indicate that the container listens on this port for incoming traffic.
EXPOSE 80

# We will use Docker's exec form ENTRYPOINT and pass our setup script as a command to it.
# The `docker-php-entrypoint` script (default ENTRYPOINT) handles user switching, permissions, etc.
# The setup script will run *before* apache.
# NO CUSTOM ENTRYPOINT HERE. Let the base image manage it.
# The`setup.sh` will be executed by the default `docker-php-entrypoint`
# before `apache2-foreground` is run.

# CMD is the setup script followed by the original Apache command
CMD ["/usr/local/bin/setup.sh", "apache2-foreground"]