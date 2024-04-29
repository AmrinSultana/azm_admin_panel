import { UserIsAuthenticated } from 'utils/router'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { setDisplayName } from 'recompose'
import { spinnerWhileLoading } from 'utils/components'

export default compose(
  // Set component display name (more clear in dev/error tools)
  setDisplayName('EnhancedUserHistoricMap'),
  // redirect to /login if user is not logged in
  UserIsAuthenticated,
  firestoreConnect([
  ]),
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid }, profile }}) => ({ uid, profile })),
  // Wait for uid to exist before going further
  spinnerWhileLoading(['uid', 'profile'])
)