import { compose } from "redux";
import { connect } from "react-redux";
import { withHandlers, withStateHandlers, setDisplayName } from "recompose";
import { withRouter } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
// import { withNotifications } from '../../../../modules/notification'
import { spinnerWhileLoading } from "utils/components";
import { UserIsAuthenticated } from "utils/router";
import { firebase } from "config";

export default compose(
  // Set component display name (more clear in dev/error tools)
  setDisplayName("EnhancedDashboardPage"),
  // redirect to /login if user is not logged in
  UserIsAuthenticated,
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid }, profile } }) => ({ uid, profile })),
  // Wait for uid to exist before going further
  spinnerWhileLoading(["uid", "profile"]),
  // Create listeners based on current users UID
  firestoreConnect(({ uid }) => ["users"]),
  // // Map projects from state to props
  connect(({ firestore: { ordered } }) => ({
    users: ordered.users,
  })),
  // Show loading spinner while projects and collabProjects are loading
  spinnerWhileLoading(["uid", "users", "profile"]),
  // Add props.router
  withRouter,
  // Add props.showError and props.showSuccess
  //   withNotifications,
  // Add state and state handlers as props
  withStateHandlers(
    // Setup initial state
    ({ initialDialogOpen = false }) => ({
      newDialogOpen: initialDialogOpen,
    }),
    // Add state handlers as props
    {
      toggleDialog: ({ newDialogOpen }) => () => ({
        newDialogOpen: !newDialogOpen,
      }),
    }
  ),
  // Add handlers as props
  withHandlers({
    listappusers: (props) => async () => {
      let tokenResult = await props.firebase
        .auth()
        .currentUser.getIdTokenResult();
      console.log("tokenResult.claims", tokenResult.claims);
      let manages_team_ids = tokenResult.claims.manages_team_ids;
      console.log("manages_team_ids", manages_team_ids);
      manages_team_ids = manages_team_ids == null ? [] : manages_team_ids;
      return new Promise(function(resolve, reject) {
        props.firebase
          .app()
          .functions(firebase.region)
          .httpsCallable("listUsers")({
            customClaims: { app: true },
            team_ids: manages_team_ids,
          })
          .then((result) => {
            resolve(result);
          });
      });
    },
    // addProject: props => newInstance => {
    //   const { firestore, uid, showError, showSuccess, toggleDialog } = props
    //   if (!uid) {
    //     return showError('You must be logged in to create a project')
    //   }
    //   return firestore
    //     .add(
    //       { collection: 'projects' },
    //       {
    //         ...newInstance,
    //         createdBy: uid,
    //         createdAt: firestore.FieldValue.serverTimestamp()
    //       }
    //     )
    //     .then(() => {
    //       toggleDialog()
    //       showSuccess('Project added successfully')
    //     })
    //     .catch(err => {
    //       console.error('Error:', err) // eslint-disable-line no-console
    //       showError(err.message || 'Could not add project')
    //       return Promise.reject(err)
    //     })
    // },
    // deleteProject: props => projectId => {
    //   const { firestore, showError, showSuccess } = props
    //   return firestore
    //     .delete({ collection: 'projects', doc: projectId })
    //     .then(() => showSuccess('Project deleted successfully'))
    //     .catch(err => {
    //       console.error('Error:', err) // eslint-disable-line no-console
    //       showError(err.message || 'Could not delete project')
    //       return Promise.reject(err)
    //     })
    // },
    // goToProject: ({ history }) => projectId => {
    //   history.push(`${LIST_PATH}/${projectId}`)
    // }
  })
);
