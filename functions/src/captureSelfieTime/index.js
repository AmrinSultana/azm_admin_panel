import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import { to } from "utils/async";

const bucketName = "azm-sales-inspector-baf39.appspot.com";

/**
 * Handle storage onFinalize event
 * @param {functions.storage.Object} object - Object associated with storage event
 * @param {functions.EventContext} context - Function event context
 * @returns {Promise} After handling captureSelfieTime event
 */
async function captureSelfieTimeEvent(object, context) {
  const { name, contentType } = object;
  console.log("Storage onFinalize event:", { name, contentType, context });
  // context.timestamp: 2022-09-26T15:38:55.371Z
  // name: DailyPics/26-09-2022/OS01.jpg
  const regexpEmployeeUID = /DailyPics\/.*\/(\w+).jpg/;
  const match = name.match(regexpEmployeeUID);
  const employeeUID = match[1];

  const collectionRef = admin
    .firestore()
    .collection(`users/${employeeUID}/selfieTimes`);
  // Write data to Firestore
  const [writeErr] = await to(
    collectionRef.add({
      timestamp: firestore.FieldValue.serverTimestamp(),
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
}

/**
 * Cloud Function triggered by Cloud Storage onFinalize Event
 *
 * Trigger: `Storage - onFinalize`
 * @name captureSelfieTime
 * @type {functions.CloudFunction}
 * @public
 */
export default functions
  .region("asia-east2")
  .storage.bucket(bucketName)
  .object()
  .onFinalize(captureSelfieTimeEvent);
