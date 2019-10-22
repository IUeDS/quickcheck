# Used this as starting point: https://dev.to/mstrsobserver/how-would-you-dockerize-php-app-382i
# and referenced Laradock implementation to further optimize

# Use an official PHP runtime as a parent image
FROM php:7.3-apache-stretch

# Set Environment Variables
ARG DEBIAN_FRONTEND=noninteractive

# Start as root
USER root

# Install any needed packages
RUN apt-get update -yqq && \
  apt-get install -yqq --no-install-recommends \
    apt-utils \
    openssl \
    libzip-dev zip unzip \
    libpng-dev
RUN docker-php-ext-configure zip --with-libzip
RUN docker-php-ext-install pdo_mysql zip
RUN docker-php-ext-configure gd
RUN docker-php-ext-install gd

# Install node/npm/angular CLI
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get update && apt-get install -y nodejs
RUN npm install -g @angular/cli

# Set Timezone, default EST (can be overriden in build command with --build-arg TZ=${INSERT_TIMEZONE_STRING})
ARG TZ=US/Eastern
ENV TZ ${TZ}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set up php.ini
# Use the default production configuration
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
# Override with custom settings
COPY resources/php.ini $PHP_INI_DIR/conf.d/

ARG WORK_DIR=/var/www/html
ARG LABS_DIR=/var/www/html/public/customActivities/jsomelec/labs
# Add the (optional) .env to the directory to access variables
ADD *.env ${WORK_DIR}
# Copy source files into working directory (only public directory exposed)
COPY . ${WORK_DIR}

# Install composer
ENV COMPOSER_HOME /composer
ENV PATH ./vendor/bin:/composer/vendor/bin:$PATH
ENV COMPOSER_ALLOW_SUPERUSER 1
RUN curl -s https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin/ --filename=composer

# Install front-end dependencies
WORKDIR ${WORK_DIR}
RUN npm install
# Up the memory size for the build process to make it run faster than the default, which is quite slow
RUN node --max_old_space_size=4096 ./node_modules/@angular/cli/bin/ng build --prod
#copy hashed css output to non-hashed file for inclusion with tinymce editor (which has a set config and can't guess the hash)
RUN cp public/assets/dist/styles.*.css public/assets/dist/styles.css
# Delete node modules after compiling front-end assets to save disk space
RUN rm -rf node_modules

# Specific to IU: install/compile dependencies for custom activity angular project; if not present, will skip
RUN bash -c 'if [ -d "${LABS_DIR}" ]; then echo "Installing labs dependencies"; cd ${LABS_DIR}; npm install; node --max_old_space_size=4096 ./node_modules/@angular/cli/bin/ng build --prod --base-href="/customActivities/jsomelec/labs/dist/"; rm -rf node_modules; cd ${WORK_DIR}; fi'

# Install back-end dependencies
RUN composer install

# Set file permissions for www-data user (otherwise app will error out after a fresh install)
# See: https://laracasts.com/discuss/channels/general-discussion/laravel-framework-file-permission-security
RUN chgrp -R www-data storage bootstrap/cache
RUN chmod -R ug+rwx storage bootstrap/cache

# Set document root for apache
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
RUN a2enmod rewrite

# Clean up
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    rm /var/log/lastlog /var/log/faillog

# Apache will run commands as non-privileged user
RUN usermod -u 1000 www-data