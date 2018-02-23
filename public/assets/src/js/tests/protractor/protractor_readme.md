# Testing in Protractor

Acceptance/regression testing using Angular's Protractor service (built on top of Selenium) should be completed to ensure that the app is functional when new features are added, to prevent regression errors.

## Disclaimer: tests are for internal development use only!

The acceptance tests are configured to work specifically with IU systems, and should only be used for internal development use. Users of the open source app are not encouraged to make use of these tests. Unfortunately, it's impossible to anticipate which authentication mechanisms each individual institution uses to login to Canvas, and custom code would have to be written for Protractor for each different authentication form. This application relies on acceptance tests rather than unit tests due to heavy reliance on LTI and Canvas, and testing live in the browser is the only route to test against breaking changes in Canvas and its LTI implementation that would affect the application.

## Steps:

1. Install Protractor locally (instructions here: http://www.protractortest.org/#/). You may need to login to an admin account using `su` and then run the install command with `sudo`. If you are still running into issues, then try the following steps:

   1. `su [your admin username]`
   2. `brew update`
   3. `brew upgrade node`
   4. `npm install -g npm`
   5. `sudo npm install -g protractor`
   6. `sudo webdriver-manager update`
   7. Install the most recent JDK version from here: http://www.oracle.com/technetwork/java/javase/downloads/index.html

3. In a separate terminal window, navigate to the app root on the server and run `php artisan migrate:refresh --seed` to reset the database
4. In the regression testing course, make sure that all assignments and modules are deleted, if they are still present from previous tests.
5. In a separate terminal window, navigate to the app root locally, then navigate to public/assets/src/js/tests/protractor, and then run `protractor conf.js`
6. 4 test suites will be run within Canvas, in the regression testing course. Tests typically take 7-8 minutes. IU guest accounts are used for instructor, student, and admin roles. If you need to run tests multiple times while developing a feature, make sure to refresh/reseed the database on the server and delete all assignments/modules in the test course before running the test suite again.