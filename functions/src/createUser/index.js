import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';

/**
 * Handle createUser request
 * @param {object} data - Data passed into httpsCallable by client
 * @param {object} context - Cloud function context
 * @param {object} context.auth - Cloud function context
 * @param {object} context.auth.uid - UID of user that made the request
 * @param {object} context.auth.name - Name of user that made the request
 * @returns {Promise} Resolves after handling request
 */
export async function createUserRequest(data, context) {
  if (!context.auth)
    return { status: "error", code: 401, message: "Not signed in" };
  if (!(context.auth && context.auth.token && context.auth.token.superuser)) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Must be an superuser user to initiate delete.'
    );
  }
  // Return data back to client to end function execution
  console.log("createUserRequest", data);
  // claims = { app: true } { admin: true } { superuser: true }
  const photoURL = `https://firebasestorage.googleapis.com/v0/b/azm-sales-inspector-baf39.appspot.com/o/ProfilePics%2F${data.uid}-0001.jpg?alt=media`;
  try {

    const storage = new Storage();
    const srcFileName = `TempProfilePicUpload/${data.uid}-0001.jpg`
    const destFileName = `ProfilePics/${data.uid}-0001.jpg`
    const defaultBucket = admin.storage().bucket();
    await storage.bucket(defaultBucket.name).file(srcFileName).move(destFileName);

    const userRecord = await admin
      .auth()
      .createUser({
        uid: data.uid,
        email: data.email,
        emailVerified: false,
        password: data.password,
        displayName: data.name,
        phoneNumber: data.phoneNumber,
        photoURL,
        disabled: false
      })
    await admin.auth().setCustomUserClaims(userRecord.uid, data.claims)
    console.log("Successfully created new user:", userRecord.uid);
    return userRecord;
  } catch (error) {
    console.log("Error creating new user:", error);
    if (error.code == "auth/uid-already-exists") {
      throw new functions.https.HttpsError("already-exists", error.message)
    }
    throw new functions.https.HttpsError("internal", error.message)
  }
}

/**
 * @name createUser
 * Cloud Function triggered by HTTP request
 * @type {functions.CloudFunction}
 */
export default functions
  .region("asia-east2")
  .https
  .onCall(createUserRequest);
