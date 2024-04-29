import { compose } from "redux"
import { setDisplayName } from "recompose"
import { connect } from "react-redux"
import { UserIsAuthenticated } from 'utils/router'
import moment from 'moment'
import { firestoreConnect } from "react-redux-firebase"
import { spinnerWhileLoading } from "utils/components"

// Redirect to /login if user is not logged in
// export default UserIsAuthenticated
export default compose(
  // Set component display name (more clear in dev/error tools)
  setDisplayName("EnhancedUserPageContent"),
  // redirect to /login if user is not logged in
  UserIsAuthenticated,
  firestoreConnect((props) => ([
    {
      collection: 'users',
      doc: props.userId,
      subcollections: [
        {
          collection: "locations",
          where: [
            ["location.timestamp", ">=", moment(props.selectedDate).set({ h: 0, m: 0, s: 0 }).utc().format()],
            ["location.timestamp", "<=", moment(props.selectedDate).set({ h: 23, m: 59, s: 59 }).utc().format()],
          ],
          "orderBy": ["location.timestamp", "asc"]
        }
      ],
      storeAs: "locationHistory"
    }
  ])),
  firestoreConnect((props) => ([
    {
      collection: 'users',
      doc: props.userId,
      subcollections: [
        {
          collection: "halts",
          where: [
            ["timestamp", ">=", moment(props.selectedDate).set({ h: 0, m: 0, s: 0 }).utc().format()],
            ["timestamp", "<=", moment(props.selectedDate).set({ h: 23, m: 59, s: 59 }).utc().format()],
          ],
          "orderBy": ["timestamp", "asc"]
        }
      ],
      storeAs: "haltsHistory"
    }
  ])),
  // Map projects from state to props
  connect(({ firestore: { data } }, props) => {
    return data
  }),
  // Show loading spinner while projects and collabProjects are loading
  spinnerWhileLoading(["locationHistory", "haltsHistory"]),
)
