import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

/**
 * Handle listUsers onCall HTTP request
 *
 * @param {object} data - Data passed into httpsCallable by client
 * @param {functions.https.CallableContext} context - Function event context
 * @param {object} context.auth - Cloud function context
 * @param {object} context.auth.uid - UID of user that made the request
 * @returns {Promise} Resolves after handling request
 */

function checkClaims(inputObj, wholeObj) {
  if (wholeObj == null) {
    wholeObj = {}
  }

  if (inputObj == null) {
    inputObj = {}
  }
  for (var key in inputObj) {
    if (inputObj[key] != wholeObj[key]) {
      return false
    }
  }
  return true
}


export async function listUsersRequest(data, context) {

  return new Promise(function (resolve, reject) {
    console.log("data", data)
    var users = []
    admin
      .auth()
      .listUsers()
      .then((listUsersResult) => {
        listUsersResult.users.forEach((userRecord) => {
          if (checkClaims(data.customClaims, userRecord.customClaims) && (data.disabled == null || userRecord.disabled == data.disabled) && (data.team_ids == null || data.team_ids.indexOf(userRecord.customClaims.team_id) != -1 )) {
            users.push(userRecord.toJSON())
          }
        });
        resolve(users)
      })
      .catch((error) => {
        console.log('Error listing users:', error);
        reject(error)
      });
  })
}

/**
 * Cloud Function triggered by HTTP request
 *
 * Trigger: `HTTPS - onCall`
 *
 * @name listUsers
 * @type {functions.CloudFunction}
 */
// export default functions.region("asia-east2").https.onCall(listUsersRequest)
export default functions.region("asia-east2").https.onCall(listUsersRequest)

