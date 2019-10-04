#used this as my starting point: https://dev.to/mstrsobserver/how-would-you-dockerize-php-app-382i
#and referenced Laradock implementation to further optimize

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

ARG WORK_DIR=/var/www/html
#add the (optional) .env to the directory to access variables
ADD *.env ${WORK_DIR}
# Copy source files into working directory (only public directory exposed)
COPY . ${WORK_DIR}

# Install composer
ENV COMPOSER_HOME /composer
ENV PATH ./vendor/bin:/composer/vendor/bin:$PATH
ENV COMPOSER_ALLOW_SUPERUSER 1
RUN curl -s https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin/ --filename=composer

# Install front-end and back-end dependencies
WORKDIR ${WORK_DIR}
RUN npm install
RUN npm run build:prod
RUN composer install

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