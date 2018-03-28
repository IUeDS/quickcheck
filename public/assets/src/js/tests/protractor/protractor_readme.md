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

2. In public/assets/src/js/tests/protractor, add a usercreds.js file with the following code to include information on the various guest accounts used while testing (make sure to fill in the values with the credential information):

```
module.exports = {
    'admin': {
        'username': '',
        'password': '',
        'id': '80001101342',
        'first': 'IUeDS',
        'last': 'Testuser'
    },
    'instructor': {
        'username': '',
        'password': '',
        'id': '80001101345',
        'first': 'IUeDS',
        'last': 'Testinstructor'
    },
    'student': {
        'username': '',
        'password': '',
        'id': '80001101347',
        'first': 'IUeDS',
        'last': 'Teststudent'
    }
};
```

3. Make sure that the regression version of the app has the most recent updates, as they would be in production, to make sure that what is being run is the exact same as what will be in production. The front-end assets should be compiled for production (with minification, etc.; use the default `grunt` command to do so), and the composer autoload classmap should be updated by running `composer dump-autoload` in the root of the app.
4. In a separate terminal window, navigate to the regression app root on the server and run `php artisan migrate:refresh --seed` to reset the database. *Make sure you are in the regression app on the server and not in the production app.* The prod app should throw an error if a command is run to reset the database, because the DB user should not have sufficient permissions to do so. Still, best to use caution just in case.
5. In the regression testing course, make sure that all assignments and modules are deleted, if they are still present from previous tests. This course has the regression version of the app installed.
6. In a separate terminal window, run `webdriver-manager start` to fire up the local selenium server. If you encounter an error, you may need to run `webdriver-manager update` first.
7. In a separate terminal window, navigate to the app root locally, then navigate to public/assets/src/js/tests/protractor, and then run `protractor conf.js`
7. 4 test suites will be run within Canvas, in the regression testing course. Tests typically take 8-10 minutes. IU guest accounts are used for instructor, student, and admin roles. If you need to run tests multiple times while developing a feature, make sure to refresh/reseed the database on the server and delete all assignments/modules in the test course before running the test suite again.