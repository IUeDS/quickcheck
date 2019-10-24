# Quick Check

Quick Check is an LTI (Learning Tools Interoperability) tool for creating formative assessments inline with course content in Canvas. Quick Check is best used for frequent, low-stakes assessments. Students receive instant feedback on their responses and, optionally, automatic grading. Instructors can review detailed student results and analytics. Quick Check was built by eLearning Design and Services at Indiana University, in response to faculty need for a robust formative assessment tool.

[Watch the overview video](https://iu.mediaspace.kaltura.com/media/Quick+Check/1_yy7hbu19).

## Disclaimer on open source use

**This application was built primarily for use by faculty, staff, and students at Indiana University, and this will continue to be our main priority. Investing the resources necessary to ensure Quick Check meets the use cases of other institutions falls outside the scope of this project. The decision was made to release this tool as an open source project so that it might benefit other institutions with a similar instructional need. Ensuring that the tool works for every institution's specific hosting setup or instructional use case is not the responsibility of this project's maintainers. Although the project maintainers will do their best to respond to questions and issues, it may not always be possible to guarantee a response. We appreciate your interest in the project and hope that you understand our resources are limited. Thank you.**

## Getting started

The application can be run within a docker container or locally in a LAMP environment. Regardless of setup, the application will rely on an external mysql database, and the following steps should be taken first:

1. Create a mysql database in your local environment
2. Copy the .example.env file in the root directory to a new file called .env
3. Enter configuration information in the .env file, such as DB access creds, but wait to fill in `APP_KEY`, which will be generated later

## Docker install (recommended)

1. Make sure that Docker for Mac/Windows is running. To build the image: `docker build -t quickcheck:1.0 .`
2. Once built, the image can be run with the following command (replacing PATH_TO_APP with the absolute path to the application on your local filesystem, and assuming that the default port of 8000 is being used): `docker run -p 8000:80 -v PATH_TO_APP:/var/www/html:delegated -v /var/www/html/node_modules -v /var/www/html/vendor -v /var/www/html/public/assets/dist --rm quickcheck:1.0`
  -The `-v` flags are for mapping volumes from your local system to the docker container. The first volume argument allows for making changes to the code in your local filesystem and having the changes reflected inside the docker container. The remaining volume arguments ensure that all dependencies are isolated within the docker container instead of being on the local filesystem.
3. One-time setup is required for the app key and database: `exec` inside the running container, and run `php artisan key:generate` to generate an app key. (Alternatively, the command can be passed as the last argument to the `run` command to pass to the container on startup.)
4. Next, run `php artisan migrate --seed` to run database migrations/seeds.
5. The application should be ready and available at localhost:8000.

A `php.ini` file is located in `resources/php.ini`, which is copied into the docker container. Additional ini setup can be added to that file to suit additional configuration needs. An `.htaccess` file is located in the `public` folder for additional configuration.

## Local install

If installing locally, PHP >= 7.1.3 is required, as is [Composer](https://getcomposer.org). For front-end dependencies, node/npm is required.

### Back-end setup
1. In the root directory, run: `composer install` to install Laravel PHP dependencies
2. Run `php artisan key:generate` to generate an app key
3. Run `php artisan migrate --seed` to run database migrations/seeds

### Front-end setup
1. Install dependencies with `npm install` (run at the root of the repo)
2. The angular CLI is required to compile the scripts/styles. To install: `npm install -g @angular/cli`
3. To build the scripts for local testing: `npm run build`
4. To build the scripts for production use: `npm run build:prod`

### Running locally
1. Run `php artisan serve` in the app root to fire up a local server.
2. To use the app locally, enter the url home page in your browser (the default is http://localhost:8000 but can be altered in the .env file).
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

Required environments are "local" and "prod" but there are others that may also be defined. A "dev" environment can be created for development, and a "preview" environment can be created for testing out new functionality with faculty before moving to production. Updating the .env file in each new environment is required for these additional environments to function properly.

## App releases

Whenever a new version of the app is released, the following commands should be run to compile the updated assets:

 * Run `composer dump-autoload` in the app root to update the autoloaded classmap
 * Run `php artisan migrate` to run new database migrations, if any were added in the release
 * In public/assets, run `ng build --prod` to compile front-end assets

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
