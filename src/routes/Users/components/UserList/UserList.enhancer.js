import { compose } from "redux";
import { connect } from "react-redux";
import { withHandlers, withStateHandlers, setDisplayName } from "recompose";
import { withRouter } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
// import { withNotifications } from '../../../../modules/notification'
import { spinnerWhileLoading } from "utils/components";
import { UserIsAuthenticated } from "utils/router";
import { firebase } from 'config';


export default compose(
  // Set component display name (more clear in dev/error tools)
  setDisplayName("EnhancedUserListPage"),
  // redirect to /login if user is not logged in
  UserIsAuthenticated,
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  // Wait for uid to exist before going further
  spinnerWhileLoading(["uid"]),
  // Create listeners based on current users UID
  firestoreConnect([
    "uid",
    "teams"
  ]),
  // // Map projects from state to props
  connect(({ firestore: { ordered } }) => ({
    teams: ordered.teams
  })),
  // Show loading spinner while projects and collabProjects are loading
  spinnerWhileLoading(["uid"]),
  // Add props.router
  withRouter,
  // Add props.showError and props.showSuccess
  // withNotifications,
  // Add state and state handlers as props
  withStateHandlers(
    // Setup initial state
    ({ initialDialogOpen = false }) => ({
      newDialogOpen: initialDialogOpen
    }),
    // Add state handlers as props
    {
      toggleDialog: ({ newDialogOpen }) => () => ({
        newDialogOpen: !newDialogOpen
      })
    }
  ),
  // Add handlers as props
  withHandlers({
    listusers: props => async () => {
      let tokenResult = await props.firebase.auth().currentUser.getIdTokenResult();
      console.log('tokenResult.claims', tokenResult.claims);
      let manages_team_ids = tokenResult.claims.manages_team_ids;
      console.log('manages_team_ids', manages_team_ids);
      manages_team_ids = (manages_team_ids == null) ? [] : manages_team_ids
      return new Promise(function (resolve, reject) {
        props.firebase.app().functions(firebase.region).httpsCallable("listUsers")({ customClaims: {}, team_ids: manages_team_ids })
          .then((result) => {
            resolve(result)
          })
      })
    },
    createTeam: props => (teamData) => {
      console.log("createTeam", props)
      console.log("createTeam", teamData)
      props.firestore.collection('teams').doc(teamData.teamID).set({
        team_id: teamData.teamID,
        team_name: teamData.teamName,
        managers: teamData.managers ? teamData.managers.map(manager => manager.uid) : [],
      })
    },
    deleteTeam: props => (teamData) => {
      console.log("deleteTeam", props)
      console.log("deleteTeam", teamData)
      // teamData
      // {
      //   "id": "3",
      //   "team_name": "cream",
      //   "managers": [
      //     "OS01"
      //   ],
      //   "team_id": "3"
      // }
      props.firestore.collection('teams').doc(teamData.id).delete()
    },
    deleteUser: props => async (userData) => {
      console.log("deleteUser", props)
      console.log("deleteUser", userData)
      return await props.firebase.app().functions(firebase.region).httpsCallable("deleteUser")(userData)
    }
  })
);
