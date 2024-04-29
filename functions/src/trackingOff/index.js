import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { to } from "utils/async";

const eventName = "trackingOff";

/**
 * @param  {admin.Change} change - Function change interface containing state objects
 * @param {admin.firestore.DataSnapshot} change.before - State prior to the event.
 * @param {Function} change.before.data - Value before change event
 * @param {admin.firestore.DataSnapshot} change.after - State after the event.
 * @param {Function} change.after.data - Value after change event
 * @param {functions.EventContext} context - Function event context
 * @param {object} context.auth - Authentication information for the user that triggered the function
 * @returns {Promise}
 */
async function trackingOffEvent(change, context) {
  // const { params, auth, timestamp } = context
  const { before, after } = change;

  console.log("trackingOff onUpdate event:", {
    before: before.data(),
    after: after.data()
  });

  // Create Firestore Collection Reference for the response
  const documentRef = admin
    .firestore()
    .collection(`users/`)
    .doc(`${context.params.employeeUID}`);

  var sessionDuration =
    after.data().endTimeStamp._seconds - after.data().startTimeStamp._seconds;

  // const increment = firebase.firestore.FieldValue.increment(sessionDuration);

  const increment = admin.firestore.FieldValue.increment(sessionDuration);

  // Write data to Firestore
  const [writeErr] = await to(
    documentRef.update({
      trackingOn: false,
      todaysDuration: increment,
      lastTrackingSessionStartTimestamp: admin.firestore.FieldValue.delete()
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
 * @name trackingOff
 * @type {functions.CloudFunction}
 */
/* export default */ functions
  .region("asia-northeast1")
  .firestore.document(`users/{employeeUID}/tracking-sessions/{timestamp}`)
  .onUpdate(trackingOffEvent);
