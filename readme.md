# Quick Check

Quick Check is an LTI (Learning Tools Interoperability) tool for creating formative assessments inline with course content in Canvas. Quick Check is best used for frequent, low-stakes assessments. Students receive instant feedback on their responses and, optionally, automatic grading. Instructors can review detailed student results and analytics. Quick Check was built by eLearning Design and Services at Indiana University, in response to faculty need for a robust formative assessment tool.

[Watch the overview video](https://iu.mediaspace.kaltura.com/media/Quick+Check/1_yy7hbu19).

## Disclaimer on open source use

**This application was built primarily for use by faculty, staff, and students at Indiana University, and this will continue to be our main priority. Investing the resources necessary to ensure Quick Check meets the use cases of other institutions falls outside the scope of this project. The decision was made to release this tool as an open source project so that it might benefit other institutions with a similar instructional need. Ensuring that the tool works for every institution's specific hosting setup or instructional use case is not the responsibility of this project's maintainers. Although the project maintainers will do their best to respond to questions and issues, it may not always be possible to guarantee a response. We appreciate your interest in the project and hope that you understand our resources are limited. Thank you.**

## Requirements

* PHP >= 7.0.0
* MySQL >= 5.5
* Composer
* Canvas

### Dev/local:
* node/npm

## Getting started

### PHP setup
1. In the root directory, run: `composer install` to install Laravel PHP dependencies
2. Copy the .example.env file in the root directory to a new file called .env
3. Run `php artisan key:generate` to generate an app key
4. Enter the rest of your configuration information in the .env file.
    - The initial values default to running the application locally, using MAMP for a MySQL database, but these values of course can be configured otherwise, depending on your setup.
    - Note: values in the .env file that contain spaces must be contained within quotes, i.e., "my passphrase." Otherwise, quotes are not necessary.

### Database setup
1. Create a database in your environment that matches the name in the .env file you are using. If running locally, you may need to alter the database credentials in .env. They are based off of the default MAMP settings.
2. Run `php artisan migrate` to run database migrations.
3. Run `php artisan db:seed` to seed the database.

### Front-end setup
1. Install dependencies with `npm install` (run at the root of the repo)
2. The angular CLI is required to compile the scripts/styles. To install: `npm install -g @angular/cli`
3. To build the scripts for local testing: `npm run build`
4. To build the scripts for production use: `npm run build:prod`

### Running locally
1. Run `php artisan serve` in the app root to fire up a local server.
2. To use the app locally, enter the url home page in your browser (the default is http://localhost:8000 but can be altered in the .env and env.js files).
    - LTI-specific functionality, such as viewing student results, is not available locally. The application must be installed in a secure https environment and installed as an LTI tool in Canvas for all functionality to be available.

## Production use

On the production server, please ensure that there is a new .env file with configuration information that is specific to the production environment. It is best practice to not sync the local .env file to the production server, because the configuration values will be different depending on the environment.

Front-end and back-end dependencies should be installed, and database migrations/seeding on the production database should be initialized.

Hosting should be configured to point the application root URL to the "public" directory in the application. This is common practice for Laravel applications. If this step is not completed, and the "public" directory is visible in the URL, the app may not function properly.

The application must be served over a secure https connection in order to function as an LTI tool. See the next section on how to configure and install Quick Check in your Canvas instance.

## LTI Configuration

First, ensure that an `LTI_KEY` and `LTI_SECRET` have been set in the .env file on the server. These should be secure values (i.e., don't use "test" for the key and secret), and this information should only be made available to system admins responsible for installing the tool.

In Canvas, when adding the app, use the following values:

 * Configuration Type: By URL
 * Name: Quick Check
 * Consumer Key: [enter the value in the .env file]
 * Shared Secret: [enter the value in the .env file]
 * Config Url: [enter the app endpoint at /index.php/lticonfig to generate an XML file; example: https://quickcheck.institution.edu/index.php/lticonfig]

The tool is hidden by default in the left navigation. Make the application visible in the left nav to access it. Quick Checks can still be embedded and taken by students even if the tool remains hidden in the left nav. The left nav link is used for creating quick checks and reviewing results.

## Canvas API dependency

Quick Check relies on the Canvas API to function properly. An admin token is required, so that information can be retrieved across multiple courses. The following is a list of the primary uses for the Canvas API:

 * Get an assignment
 * Get a course
 * Get course groups
 * Get an assignment's submissions
 * Get a user/users

Canvas API functionality is contained within the CanvasAPI class, which can be found in app/Classes/ExternalData/CanvasAPI.php.

## Environments

Required environments are "local" and "prod" but there are others that may also be defined. A "dev" environment can be created for development, and a "preview" environment can be created for testing out new functionality with faculty before moving to production. Updating the .env and env.js files in each new environment is required for these additional environments to function properly.

## App releases

Whenever a new version of the app is released, the following commands should be run to compile the updated assets:

 * Run `composer dump-autoload` in the app root to update the autoloaded classmap
 * Run `php artisan migrate` to run new database migrations, if any were added in the release
 * In public/assets, run `grunt` to compile front-end assets

## Helpful tips for server configuration

Server/host configuration needs may vary, and we are not attempting to anticipate every scenario. You may have additional needs than what we have specified here. However, the following configuration rules have proven helpful in our experience running the application in an Apache environment:

### php.ini

```
# up the session max lifetime to 6 hours
session.gc_maxlifetime = 21600;

# for saving large quick checks/QTI imports, more POST input vars may be needed
max_input_vars = 2500;
```

### .htaccess

```
#allow SVGs to be displayed as images
AddType image/svg+xml .svg .svgz

#catch URLs that start with www, remove it, redirect to https
RewriteCond %{HTTP_HOST} ^www\.(.+)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

#Added safeguard: Deny all requests for *.env files where sensitive credentials are stored.
<Files "*.env">
Order Allow,Deny
Deny from all
</Files>

```

The proper location of these files will depend on how your host is configured, and may vary.

## License
Quick Check is open-sourced software licensed under the [Educational Community License, Version 2.0](https://opensource.org/licenses/ECL-2.0).

Copyright 2018 The Trustees of Indiana University Licensed under the
  Educational Community License, Version 2.0 (the "License"); you may
  not use this file except in compliance with the License. You may
  obtain a copy of the License at

http://www.osedu.org/licenses/ECL-2.0

  Unless required by applicable law or agreed to in writing,
  software distributed under the License is distributed on an "AS IS"
  BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
  or implied. See the License for the specific language governing
  permissions and limitations under the License.
