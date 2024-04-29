import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { to } from "utils/async";

const eventName = "updateUserLocation";

const addCustomUserClaims = (uid, claims) =>
  admin.auth().getUser(uid).then(({ customClaims }) =>
    admin.auth().setCustomUserClaims(uid, { ...customClaims, ...claims }))

/**
 *
 * @param {admin.firestore.DataSnapshot} snap - Data snapshot of the event
 * @param {Function} snap.data - Value of document
 * @param {functions.EventContext} context - Function event context
 * @param {object} context.auth - Authentication information for the user that triggered the function
 * @returns {Promise}
 */
async function updateUserLocationEvent(snap, context) {
  const { params, auth, timestamp } = context;
  let data = snap.data();
  // console.log("updateUserLocation onCreate event:", data);

  const documentRef = admin
    .firestore()
    .collection("users")
    .doc(params.employeeUID);


  addCustomUserClaims(params.employeeUID, { lastUpdatedAt: new Date(), lastLocation: data.location })

  // Write data to Firestore
  const [writeErr] = await to(
    documentRef.set(
      {
        lastLocation: data.location
      },
      { merge: true }
    )
  );

  // Handle errors writing data to Firestore
  if (writeErr) {
    console.error(
      `Error writing response: ${writeErr.message || ""}`,
      writeErr
    );
    throw writeErr;
  }

  // End function execution by returning
  return null;
}

/**
 * Cloud Function triggered by Firestore Event
 * @name updateUserLocation
 * @type {functions.CloudFunction}
 */
export default functions
  .region("asia-east2")
  .firestore.document(`users/{employeeUID}/locations/{locationUID}`)
  .onCreate(updateUserLocationEvent);
