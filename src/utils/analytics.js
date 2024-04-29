import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/analytics'
import { version } from '../../package.json'
import * as config from 'config' // eslint-disable-line import/no-unresolved
import ANALYTICS_EVENT_NAMES from 'constants/analytics'

/**
 * Set User info to analytics context
 * @param {Object} auth - User auth object
 * @param {String} auth.uid - Current user's UID
 */
export function setAnalyticsUser(auth) {
  // Only set user if UID exists
  if (auth && auth.uid) {
    // Only set user if measurementId exists
    if (config.firebase.measurementId) {
      firebase.analytics().setUserId(auth.uid);
      firebase.analytics().setUserProperties({
        name: auth.displayName,
        email: auth.email,
        avatar: auth.photoURL,
        version
      })
    }
  }
}

/**
 * Trigger analytics event within Firebase Analytics
 * @param {Object} eventData - Data associated with the event.
 */
export function triggerAnalyticsEvent(eventNameKey, eventData) {
  const eventDataWithVersion = { ...eventData, version };
  if (!window.Cypress) {
    const standardizedEventName =
      ANALYTICS_EVENT_NAMES[eventNameKey] || eventNameKey
    firebase.analytics().logEvent(standardizedEventName, eventDataWithVersion)
  } else {
    console.debug('Analytics Event:', { name: eventNameKey, data: eventDataWithVersion }) // eslint-disable-line no-console
  }
}

/**
 * Initialize Analytics libraries if within production environment
 * except Firebase Analytics which are initialized in containers/App.js
 */
export function init() {
  
}
