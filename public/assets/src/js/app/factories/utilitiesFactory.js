angular
    .module('utilitiesFactory', [])
    .factory('Utilities', QcUtils);

QcUtils.$inject = ['$timeout', '$location', '$window', '$rootScope'];

//right now I am requiring that each controller instantiate its own instance of Utils through:
//`utils = new Utilities();`
//which makes it a little more flexible for creating multiple instances; probably not necessary, however,
//as utils is usually just a singleton; still, keeping it as is for flexibility if it is ever needed
function QcUtils($timeout, $location, $window, $rootScope) {
    function Utilities(params) {
        //diverging slightly from the angular styleguide here:
        //1) why repeat the variable declaration and the declaration in the object? seems like it
        //would be very easy to forget adding/deleting in two places rather than one.
        //2) sticking to a classic constructor and this rather than creating an object literal,
        //as it is necessary for this class to check for LTI as soon as it's created, meaning
        //a constructor function has to be called, which, as far as I know, can't be done in object literal
        var utils = this;

        //optional constructor vars
        if (params) {
            utils.scrollingLtiHeight = params.scrollingLtiHeight ? params.scrollingLtiHeight : false;
        }

        //vars
        utils.loading = false;
        utils.errorFound = false;
        utils.errorList = [];
        utils.isLti = false;
        utils.contextId = null;

        //functions
        utils.areCookiesEnabled = areCookiesEnabled;
        utils.checkForLti = checkForLti;
        utils.convertSqlTimestamp = convertSqlTimestamp;
        utils.convertTimeWithTimezone = convertTimeWithTimezone;
        utils.focusToElement = focusToElement;
        utils.formatDateDiff = formatDateDiff;
        utils.formatDuration = formatDuration;
        utils.formatMath = formatMath;
        utils.formatTimeWithTimeZone = formatTimeWithTimeZone;
        utils.getCookieErrorMsg = getCookieErrorMsg;
        utils.getError = getError;
        utils.getQuizError = getQuizError;
        utils.getResponseData = getResponseData;
        utils.getUrlQueryParameter = getUrlQueryParameter;
        utils.isInIframe = isInIframe;
        utils.isInCanvasModule = isInCanvasModule;
        utils.isRegressionEnv = isRegressionEnv;
        utils.isSuccessResponse = isSuccessResponse;
        utils.loadingFinished = loadingFinished;
        utils.loadingStarted = loadingStarted;
        utils.scrollToLtiTop = scrollToLtiTop;
        utils.setContextLink = setContextLink;
        utils.setError = setError;
        utils.setLtiHeight = setLtiHeight;
        utils.showError = showError;
        utils.shuffle = shuffle;

        utils.checkForLti();
        utils.setLtiHeight();

        function areCookiesEnabled() {
            if (navigator.cookieEnabled) {
                return true;
            }

            return false;
        }

        //if reached through an LTI post, then a context ID will be appended as a query string
        function checkForLti() {
            var queryParams = $location.search();
            if (queryParams.context) {
                utils.contextId = queryParams.context;
                utils.isLti = true;
            }
        }

        //http://stackoverflow.com/questions/3075577/convert-mysql-datetime-stamp-into-javascripts-date-format
        function convertSqlTimestamp(timestamp) {
            var t = timestamp.split(/[- :]/),
                date = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
            return date;
        }

        function convertTimeWithTimezone(timestamp, timezone, notInDefaultTimeZone) {
            var defaultTimezone = 'America/New_York',
                time = null,
                convertedTime = null;

            //if already in the default timezone, set that; otherwise, set as specified timezone
            if (notInDefaultTimeZone) {
                time = moment.tz(timestamp, timezone);
            }
            else {
                time = moment.tz(timestamp, defaultTimezone);
            }

            convertedTime = time.clone().tz(timezone);

            return convertedTime;
        }

        function focusToElement(element) {
            $timeout(function() {
                $(element).focus();
            }, 0, false);
        }

        function formatDateDiff(seconds) {
            var minutes = Math.floor(seconds / 60),
                hours = Math.floor(minutes/60),
                days = Math.floor(hours/24),
                qualifier = '';
            if (days >= 1) {
                qualifier = (days == 1 ? 'day' : 'days');
                return days + ' ' + qualifier;
            }
            else if (hours >= 1) {
                qualifier = (hours == 1 ? 'hour' : 'hours');
                return hours + ' ' + qualifier;
            }
            else if (minutes >= 1) {
                qualifier = (minutes == 1 ? 'minute' : 'minutes');
                return minutes + ' ' + qualifier;
            }
            else if (seconds >= 1) {
                qualifier = (seconds == 1 ? 'second' : 'seconds');
                return seconds + ' ' + qualifier;
            }
            else {
                return '';
            }
        }

        //this is unfortunately rather involved; it's pretty shocking that
        //moment.js does not have this functionality; its humanization feature
        //will only show 1 qualifier rather than several, which makes it not
        //very accurate (big difference between 1 day, and 1 day 13 hours)
        function formatDuration(seconds) {
            var minutes = Math.floor(seconds/60),
                hours = Math.floor(minutes/60),
                days = Math.floor(hours/24),
                duration = '',
                qualifier = '';

            if (!seconds || seconds <= 0) {
                return 'NA';
            }

            if (days >= 1) {
                qualifier = (days == 1 ? 'day' : 'days');
                duration += days + ' ' + qualifier;
                hours -= (days * 24); //adjust hours
                minutes -= (days * 24 * 60); //adjust minutes
            }

            if (hours >= 1) {
                if (duration.length) {
                    duration += ', ';
                }
                qualifier = (hours == 1 ? 'hour' : 'hours');
                duration += hours + ' ' + qualifier;
                minutes -= (hours * 60); //adjust minutes
            }

            if (minutes >= 1) {
                if (duration.length) {
                    duration += ', ';
                }
                qualifier = (minutes == 1 ? 'minute' : 'minutes');
                duration += minutes + ' ' + qualifier;
            }

            //we don't want to get into the weeds with 3 days, 4 hours, 2 minutes, 36 seconds...
            //so just show seconds if nothing else better is available
            if (days < 1 && hours < 1 && minutes < 1) {
                qualifier = (seconds == 1 ? 'second' : 'seconds');
                duration = Math.floor(seconds) + ' ' + qualifier;
            }

            return duration;

            //the less accurate version from moment.js, just in case:
            //return moment.duration(seconds, 'seconds').humanize();
        }

        function formatMath() {
            //see: http://docs.mathjax.org/en/latest/advanced/typeset.html
            $timeout(function() {
                MathJax.Hub.Queue(['Typeset',MathJax.Hub]);
            }, 0, false);
        }

        function formatTimeWithTimeZone(timestamp, timezone) {
            var convertedTime = utils.convertTimeWithTimezone(timestamp, timezone);

            return convertedTime.format('MM/DD/YY h:mm A');
        }

        function getCookieErrorMsg() {
            var errorMessage = 'Error: cookies (including third-party cookies) need to be enabled. For instructions, ' +
            '<a href="https://support.google.com/accounts/answer/61416?hl=en" target="_blank">read this article for Chrome</a>, ' +
            ' and <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank">' +
            'read this article for Firefox</a>. You may need to restart your browser for the changes to take effect.';

            return errorMessage;
        }

        //for cases where the error is in a non-centralized location (i.e., showing an error
        //just within a certain component, like a grade, rather than at the top of the page),
        //get the error data so the component can display it to the user
        function getError(resp) {
            var errors = resp.data.errorList,
                error = 'There was an error processing your request.'; //default

            if (errors) {
                error = '';
                errors.forEach(function(errorListItem) {
                    error += (errorListItem + ' '); //if multiple items, add a space
                });
            }

            return error;
        }

        function getQuizError(resp) {
            if (resp.data) {
                if (resp.data.errorList) {
                    return resp.data.errorList[0]; //should really only be a single error point here
                }
            }

            if (resp.status === -1) { //if Angular aborted
                return 'Request aborted, most likely due to a timeout. This is likely happening because of a ' +
                'slow internet connection. If your internet is otherwise working fine, then the server ' +
                'may be encountering difficulties. Please refresh the page and try again.';
            }

            return false;
        }

        //all of the successful API calls conform to the same structure, of:
        //success => true, data => []
        //let's keep that logic in one place, so it's not duplicated in hundreds
        //of returned promises, so it will be easy to change the structure in the future if needed
        function getResponseData(resp) {
            return resp.data.data;
        }

        function getUrlQueryParameter(param) {
            var queryParams = $location.search();
            if (queryParams[param]) {
                return queryParams[param];
            }
            return false;
        }

        //look for module item id in query string to determine if presently in a module
        function isInCanvasModule() {
            //source: https://stackoverflow.com/questions/3420004/access-parent-url-from-iframe
            var url = (window.location != window.parent.location) ?
            document.referrer : document.location.href;

            //for resources that can live outside of modules (assignments, pages, etc.)
            if (url.includes('module_item_id=')) {
                return true;
            }

            //for resources such as external links that can only be accessed through a module
            if (url.includes('modules/items/')) {
                return true;
            }

            return false;
        }

        function isInIframe() {
            if (self == top) {
                return false;
            }
            else {
                return true;
            }
        }

        function isRegressionEnv() {
            var env = $rootScope.environment;
            if (env === 'reg') {
                return true;
            }
            return false;
        }

        //there are some spots where the call is technically successful but still classified
        //as an "error" -- for instance, when validating an invited user, the check was
        //successful, just the user isn't valid. In cases like this, we need to check for
        //a specific success/error structure in the API response.
        function isSuccessResponse(resp) {
            if (resp.data.success) {
                return true;
            }
            return false;
        }

        function loadingFinished(focusElement) {
            utils.loading = false;
            if (focusElement) {
                utils.focusToElement(focusElement);
            }
            utils.setLtiHeight();
        }

        function loadingStarted() {
            utils.loading = true;
            utils.errorFound = false; //reset if it had been set in a previous failed request
        }

        function scrollToLtiTop() {
            $timeout(function() {
                window.parent.postMessage(JSON.stringify({subject: 'lti.scrollToTop'}), '*');
            }, 0, false);
        }

        function setContextLink(link) {
            if (utils.isLti) {
                link += ('?context=' + utils.contextId);
            }
            return link;
        }

        //for custom/front-end errors, manually set the error message
        function setError(error) {
            //mock the back-end format so it can be passed in to the same centralized function
            var errorResponse = {};
            errorResponse.data = {};
            errorResponse.data.errorList = [error];
            utils.showError(errorResponse);
        }

        function setLtiHeight(leaveScrollSpace) {
            if (!utils.isInIframe()) {
                return;
            }

            $timeout(function() {
                //default to the exact iframe height, plus a sliver extra just in case
                var height = $('body').height() + 75;

                //if page accessed from the left nav of Canvas, add 1000px of extra space to
                //ensure that we don't have scroll bars (since there is nothing below the
                //LTI iframe in this case, completely exact height isn't necessary and can
                //cause problems if even off by a few pixels due to small UI actions)
                if (utils.isLti) {
                    height = $('body').height() + 1000;
                }

                //in some cases, such as in the results view, there is lazy loading on scroll;
                //if the iframe does not have scroll bars, then we can't lazy load. if this is
                //the case, make the iframe smaller than expected to enable scrolling.
                if (utils.scrollingLtiHeight) {
                    height = $('body').height() - utils.scrollingLtiHeight;
                }

                window.parent.postMessage(JSON.stringify({subject: 'lti.frameResize', height: height +'px'}), '*');
            }, 0, false);
        }

        function showError(resp) {
            var errors = resp.data.errorList;
            if (errors) {
                utils.errorList = errors;
            }
            else {
                utils.errorList = ['There was an error processing your request.'];
            }
            utils.errorFound = true;
            utils.loadingFinished();
            utils.focusToElement('.error-message');
        }

        function shuffle(o) {
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }
    }

    return Utilities;
}