import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { to } from "utils/async";

const eventName = "trackingOn";

/**
 *
 * @param {admin.firestore.DataSnapshot} snap - Data snapshot of the event
 * @param {Function} snap.data - Value of document
 * @param {functions.EventContext} context - Function event context
 * @param {object} context.auth - Authentication information for the user that triggered the function
 * @returns {Promise}
 */
async function trackingOnEvent(snap, context) {
  // const { params, auth, timestamp } = context
  console.log("trackingOn onCreate event:", snap.data());

  // Create Firestore Collection Reference for the response
  const documentRef = admin
    .firestore()
    .collection(`users/`)
    .doc(`${context.params.employeeUID}`);

  // Write data to Firestore
  const [writeErr] = await to(
    documentRef.update({
      trackingOn: true,
      lastTrackingSessionStartTimestamp: snap.data().startTimeStamp
    })
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
 * @name trackingOn
 * @type {functions.CloudFunction}
 */
/*export default */ functions
  .region("asia-northeast1")
  .firestore.document(`users/{employeeUID}/tracking-sessions/{timestamp}`)
  .onCreate(trackingOnEvent);
