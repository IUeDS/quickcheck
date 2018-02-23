var quickCheckEnv = {
    //TO CONFIGURE:
    //Copy this file to a new file called env.js (in this same directory)
    //Fill in the values below in the new file
    urls: {
        //Each URL should include the protocol, which MUST be https, unless running locally
        //Do not include end slash or index.php
        //The url should be pointing to the "public" folder of the app
        //Example: https://quickcheck.institution.edu
        local: 'http://localhost:8000', //REQUIRED, included default for running locally
        prod: '', //REQUIRED production instance
        dev: '', //OPTIONAL development instance for tinkering
        preview: '', //OPTIONAL preview instance for testing out features with faculty, etc.
        reg: '', //INTERNAL USE ONLY AT IU for regression testing
    },
    contactUsEmail: '', //OPTIONAL email address for users to send questions/feedback
    supportCenterLink: '', //OPTIONAL link to institution's support center for help page
    showOverviewVideo: false, //an overview video on the help page is IU-specific, hide by default
};