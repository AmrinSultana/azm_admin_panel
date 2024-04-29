import { compose } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'

import { withHandlers, withStateHandlers, setDisplayName } from 'recompose'
import { withRouter } from 'react-router-dom'
import { firestoreConnect } from 'react-redux-firebase'
import { spinnerWhileLoading } from 'utils/components'
import { UserIsAuthenticated } from 'utils/router'
import { firebase } from 'config';

export default compose(
  // Set component display name (more clear in dev/error tools)
  setDisplayName('EnhancedDownloadPage'),
  // redirect to /login if user is not logged in
  UserIsAuthenticated,
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid }, profile } }) => ({ uid, profile })),
  // Wait for uid to exist before going further
  spinnerWhileLoading(['uid', 'profile']),
  firestoreConnect(({ uid }) => [
  ]),
  // Add props.router
  withRouter,
  // Add props.showError and props.showSuccess
  //   withNotifications,
  // Add state and state handlers as props
  withStateHandlers(
  ),
  // Add handlers as props
  withHandlers({
    listappusers: props => () => {
      return new Promise(function (resolve, reject) {
        props.firebase.app().functions(firebase.region).httpsCallable("listUsers")({ customClaims: { 'app': true } })
          .then((result) => {
            resolve(result)
          })
      })
    },
    getData: props => (startDate, endDate, selectedAppUserIds, type) => {
      // type=locations/geofences/halts

      return Promise.all(selectedAppUserIds.map(userid => {
        return new Promise(function (resolve, reject) {
          var timestampField = (type === 'halts') ? "timestamp" : "location.timestamp";
          props.firestore.collection(`users/${userid}/${type}/`)
            .where(timestampField, ">=", moment(startDate).set({ h: 0, m: 0, s: 0 }).format())
            .where(timestampField, "<=", moment(endDate).set({ h: 23, m: 59, s: 59 }).format())
            .get()
            .then(function (querySnapshot) {
              resolve({ querySnapshot, userid })
            })
            .catch(function (error) {
              console.log("Error getting documents: ", error);
            });
        })
      }))
    }
  })
)
