import { compose } from "redux";
import { connect } from "react-redux";
import { spinnerWhileLoading } from "utils/components";
// import { UserIsAuthenticated } from 'utils/router'

export default compose(
  // Set component display name (more clear in dev/error tools)
  //   setDisplayName('EnhancedProjectsPage'),
  // redirect to /login if user is not logged in
  //   UserIsAuthenticated,
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  // Wait for uid to exist before going further
  spinnerWhileLoading(["uid"])
  // Create listeners based on current users UID
);
