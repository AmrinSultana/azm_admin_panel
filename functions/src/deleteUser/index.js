import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';

/**
 * Handle deleteUser onCall HTTP request
 *
 * @param {object} data - Data passed into httpsCallable by client
 * @param {functions.https.CallableContext} context - Function event context
 * @param {object} context.auth - Cloud function context
 * @param {object} context.auth.uid - UID of user that made the request
 * @returns {Promise} Resolves after handling request
 */
export async function deleteUserRequest(data, context) {
  // {
  //   "uid": "OS04",
  //   "email": "mohdsaleem07@gmail.com",
  //   "emailVerified": false,
  //   "displayName": "Mohd Saleem",
  //   "photoURL": "https://firebasestorage.googleapis.com/v0/b/azm-sales-inspector-baf39.appspot.com/o/ProfilePics%2FOS04-0001.jpg?alt=media",
  //   "phoneNumber": "+917042338515",
  //   "disabled": false,
  //   "metadata": {
  //     "lastSignInTime": null,
  //     "creationTime": "Fri, 26 Nov 2021 13:46:04 GMT"
  //   },
  //   "passwordHash": "xQERMwaLTJgpOPGQgO_T7UKRn1D3a52MOVUqYgGdiyObtcOayihgUcte0ZUfvfCrEOFYzIwFy2lr1X2fLkZFnA==",
  //   "passwordSalt": "TpaHJPY7gmgoJg==",
  //   "customClaims": {
  //     "app": false,
  //     "admin": false,
  //     "superuser": false,
  //     "team_id": "2"
  //   },
  //   "tokensValidAfterTime": "Fri, 26 Nov 2021 13:46:04 GMT",
  //   "tenantId": null,
  //   "providerData": [{
  //       "uid": "+917042338515",
  //       "displayName": null,
  //       "email": null,
  //       "photoURL": null,
  //       "providerId": "phone",
  //       "phoneNumber": "+917042338515"
  //     },
  //     {
  //       "uid": "mohdsaleem07@gmail.com",
  //       "displayName": "Mohd Saleem",
  //       "email": "mohdsaleem07@gmail.com",
  //       "photoURL": "https://firebasestorage.googleapis.com/v0/b/azm-sales-inspector-baf39.appspot.com/o/ProfilePics%2FOS04-0001.jpg?alt=media",
  //       "providerId": "password",
  //       "phoneNumber": null
  //     }
  //   ]
  // }
  console.log('request received', { data, context })
  if (!context.auth)
    return { status: "error", code: 401, message: "Not signed in" };
  if (!(context.auth && context.auth.token && context.auth.token.superuser)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Must be an superuser user to initiate delete.'
    );
  }
  try {
    await admin.firestore().collection('users').doc(data.uid).delete()
    await admin
      .auth()
      .deleteUser(data.uid)
    return { status: "success", code: 200, message: `User ${data.uid} deleted successfully` }
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message)
  }
}

/**
 * Cloud Function triggered by HTTP request
 *
 * Trigger: `HTTPS - onCall`
 *
 * @name deleteUser
 * @type {functions.CloudFunction}
 */
export default functions.region("asia-east2").https.onCall(deleteUserRequest)
