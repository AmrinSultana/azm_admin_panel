import { compose } from 'redux'
import { connect } from 'react-redux'

import { withStateHandlers, setDisplayName } from 'recompose'
import { withRouter } from 'react-router-dom'
import { firestoreConnect } from 'react-redux-firebase'
import { spinnerWhileLoading } from 'utils/components'
import { UserIsAuthenticated } from 'utils/router'
// import { firebase } from 'config';

export default compose(
  // Set component display name (more clear in dev/error tools)
  setDisplayName('EnhancedSettingsPage'),
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
)
