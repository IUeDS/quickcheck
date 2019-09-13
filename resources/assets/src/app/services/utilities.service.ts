import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {environment} from '../../environments/environment';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  //vars
  contextId = null;
  errorFound = false;
  errorList = [];
  isLti = false;
  loading = false;
  scrollingLtiHeight = 0;
  sessionExpired = false;

  constructor(private route: ActivatedRoute) {
    let params = this.route.snapshot.queryParamMap;

    let contextId = params.get('context');
    if (contextId) {
      this.contextId = contextId;
      this.isLti = true;
    }

    let sessionExpired = params.get('sessionexpired');
    if (sessionExpired) {
      this.sessionExpired = true;
    }
  }

  areCookiesEnabled() {
    if (navigator.cookieEnabled) {
      return true;
    }

    return false;
  }

  //http://stackoverflow.com/questions/3075577/convert-mysql-datetime-stamp-into-javascripts-date-format
  convertSqlTimestamp(timestamp) {
    var t = timestamp.split(/[- :]/),
      date = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

    return date;
  }

  convertTimeWithTimezone(timestamp, timezone, notInDefaultTimeZone = false) {
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

  focusToElement(element) {
    setTimeout(() => {
      document.querySelector(element).focus();
    }, 0);
  }

  formatDateDiff(seconds) {
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
  formatDuration(seconds) {
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

  formatMath() {
    //see: http://docs.mathjax.org/en/latest/advanced/typeset.html
    setTimeout(() => {
      //original MathJax, compiler error with typescript, trying more ts-friendly alternative
      //see: https://stackoverflow.com/questions/12709074/how-do-you-explicitly-set-a-new-property-on-window-in-typescript
      //MathJax.Hub.Queue(['Typeset',MathJax.Hub]);
      window['MathJax'].Hub.Queue(['Typeset',window['MathJax'].Hub]);
    }, 0);
  }

  formatTimeWithTimeZone(timestamp, timezone) {
    var convertedTime = this.convertTimeWithTimezone(timestamp, timezone);

    return convertedTime.format('MM/DD/YY h:mm A');
  }

  getCookieErrorMsg() {
    var errorMessage = 'Error: cookies (including third-party cookies) need to be enabled. For instructions, ' +
    '<a href="https://support.google.com/accounts/answer/61416?hl=en" target="_blank">read this article for Chrome</a>, ' +
    ' and <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank">' +
    'read this article for Firefox</a>. You may need to restart your browser for the changes to take effect.';

    return errorMessage;
  }

  //for cases where the error is in a non-centralized location (i.e., showing an error
  //just within a certain component, like a grade, rather than at the top of the page),
  //get the error data so the component can display it to the user
  getError(resp) {
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

  getQuizError(resp) {
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
  getResponseData(resp) {
    return resp.data;
  }

  //look for module item id in query string to determine if presently in a module
  isInCanvasModule() {
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

  isInIframe() {
    if (self == top) {
      return false;
    }
    else {
      return true;
    }
  }

  isLtiContext() {
    return this.isLti;
  }

  isRegressionEnv() {
    if (environment.regression) {
      return true;
    }

    return false;
  }

  isSessionExpired() {
    return this.sessionExpired;
  }

  //there are some spots where the call is technically successful but still classified
  //as an "error" -- for instance, when validating an invited user, the check was
  //successful, just the user isn't valid. In cases like this, we need to check for
  //a specific success/error structure in the API response.
  isSuccessResponse(resp) {
    if (resp.success) {
      return true;
    }
    return false;
  }

  loadingFinished(focusElement = false) {
    this.loading = false;
    if (focusElement) {
      this.focusToElement(focusElement);
    }
    this.setLtiHeight();
  }

  loadingStarted() {
    this.loading = true;
    this.errorFound = false; //reset if it had been set in a previous failed request
  }

  removeScrollHeight() {
    this.scrollingLtiHeight = 0;
    this.setLtiHeight();
  }

  scrollToLtiTop() {
    setTimeout(() => {
      window.parent.postMessage(JSON.stringify({subject: 'lti.scrollToTop'}), '*');
    }, 0);
  }

  setContextLink(link) {
    if (this.isLti) {
      link += ('?context=' + this.contextId);
    }
    return link;
  }

  //for custom/front-end errors, manually set the error message
  setError(error) {
    //mock the back-end format so it can be passed in to the same centralized function
    var errorResponse = { data: { errorList: [ error ]}};
    this.showError(errorResponse);
  }

  setLtiHeight() {
    if (!this.isInIframe()) {
      return;
    }

    setTimeout(() => {
      //default to the exact iframe height, plus a sliver extra just in case
      var height = document.querySelector('body').clientHeight + 75;

      //if page accessed from the left nav of Canvas, add 1000px of extra space to
      //ensure that we don't have scroll bars (since there is nothing below the
      //LTI iframe in this case, completely exact height isn't necessary and can
      //cause problems if even off by a few pixels due to small UI actions)
      if (this.isLti) {
        height = document.querySelector('body').clientHeight + 1000;
      }

      //in some cases, such as in the results view, there is lazy loading on scroll;
      //if the iframe does not have scroll bars, then we can't lazy load. if this is
      //the case, make the iframe smaller than expected to enable scrolling.
      if (this.scrollingLtiHeight > 0) {
        height = document.querySelector('body').clientHeight - this.scrollingLtiHeight;
      }

      window.parent.postMessage(JSON.stringify({subject: 'lti.frameResize', height: height}), '*');
    }, 0);
  }

  setScrollingLtiHeight(height) {
    this.scrollingLtiHeight = height;
  }

  showError(resp) {
    const data = resp.error;
    const defaultMessage = 'There was an error processing your request.';

    if (!data) {
      this.errorList = [defaultMessage];
    }
    else if (data.errorList) {
      this.errorList = data.errorList;
    }
    else {
      this.errorList = [defaultMessage];
    }

    this.errorFound = true;
    this.loadingFinished();
    this.focusToElement('.error-message');
  }

  shuffle(o) {
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }
}
