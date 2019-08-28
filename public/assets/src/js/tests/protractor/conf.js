exports.config = {
    framework: 'jasmine2',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        'part1_instructor/1-initialization-spec.js',
        'part1_instructor/2-adding-and-editing-sets-spec.js',
        'part1_instructor/3-set-users-spec.js',
        'part1_instructor/4-set-features-spec.js',
        'part1_instructor/5-adding-and-editing-subsets-spec.js',
        'part1_instructor/6-basic-quickcheck-editing-mechanics-spec.js',
        // 'part1_instructor/7-deletions-spec.js',
        // 'part1_instructor/8-adding-set-from-homepage-spec.js',
        // 'part1_instructor/9-editing-quickchecks-spec.js',
        // 'part1_instructor/10-copying-quickchecks-spec.js',
        // 'part1_instructor/11-importing-qti-spec.js',
        // 'part1_instructor/12-exporting-qti-spec.js',
        // 'part1_instructor/13-embedding-spec.js',
        // 'part1_instructor/14-releases-spec.js',
        // 'part2_student/1-qc-all-question-types-spec.js',
        // 'part2_student/2-qc-variations-spec.js',
        // 'part2_student/3-results-spec.js',
        // 'part3_admin/1-admin-view-and-users-spec.js',
        // 'part3_admin/2-public-sets-spec.js',
        // 'part3_admin/3-admin-features-spec.js',
        // 'part3_admin/4-adding-and-editing-custom-activities-spec.js',
        // 'part3_admin/5-embedding-custom-activities-spec.js',
        // 'part4_instructor/1-searching-results-spec.js',
        // 'part4_instructor/2-reviewing-results-spec.js',
        // 'part4_instructor/3-analytics-spec.js',
        // 'part4_instructor/4-nongraded-results-spec.js',
        // 'part4_instructor/5-grading-spec.js',
        // 'part4_instructor/6-individual-student-results.js',
        // 'part4_instructor/7-custom-activities-spec.js',
        // 'part4_instructor/8-public-sets-spec.js',
        // 'part4_instructor/9-timeout-feature-spec.js'
    ],
    SELENIUM_PROMISE_MANAGER: false,
    rootElement: 'main',
    params: {
        'inviteUser': 'mmallon',
        'browser2': null,
        'browser3': null
    },
    jasmineNodeOpts: {
        isVerbose: false,
        showColors: true,
        includeStackTrace: false,
        defaultTimeoutInterval: 30000
    },
    // capabilities: {
    //     browserName: 'chrome',
    //     chromeOptions: {
    //         'w3c': false
    //     }
    // },
//     capabilities: {
//         "browserName": "chrome",
//         "chromeOptions": {
//             "binary": "/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary"
//         }
//     },
    // capabilities: {
    //     "browserName": "chrome",
    //     "chromeOptions": {
    //         "binary": "/Applications/Google\ Chrome\ Beta.app/Contents/MacOS/Google\ Chrome"
    //     }
    // },
    onPrepare: function() {
        var width = 1200,
  		    height = 1200;
        browser.driver.manage().window().setSize(width, height);
        var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
        jasmine.getEnv().addReporter(new SpecReporter({
            displayStacktrace: 'none'
        }));
    }
}