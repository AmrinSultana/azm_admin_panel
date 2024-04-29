import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import moment from 'moment';

async function deleteQuery(db, querySet, batchSize) {
  // const collectionRef = db.collection(collectionPath);
  // const query = collectionRef.orderBy('__name__').limit(batchSize);
  const query = querySet.limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  // console.log(`Deleting older data: ${batchSize}`);
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

/**
 * Handle cleanData pub sub event
 * @param {functions.pubsub.Context} context - Function context
 * @returns {Promise}
 */
async function cleanDataEvent(context) {
  // console.log('Pub Sub message: ', { context })
  const cleanupDays = 60;
  let startdate = moment();
  startdate = startdate.subtract(cleanupDays, "days").utc().format();
  let db = admin.firestore();

  console.log(`Deleting locations older than ${cleanupDays} days: ${startdate}`);
  let query = await db.collectionGroup('locations').where('location.timestamp', '<=', startdate)
  await deleteQuery(admin.firestore(), query, 500)

  console.log(`Deleting halts older than ${cleanupDays} days: ${startdate}`);
  query = await db.collectionGroup('halts').where('timestamp', '<=', startdate)
  await deleteQuery(admin.firestore(), query, 500)

  console.log(`Deleting selfieTimes older than ${cleanupDays} days: ${startdate}`);
  query = await db.collectionGroup('selfieTimes').where('timestamp', '<=', startdate)
  await deleteQuery(admin.firestore(), query, 500)

  console.log(`Deleting visits older than ${cleanupDays} days: ${startdate}`);
  query = await db.collectionGroup('visits').where('checkedOutTimeStamp', '<=', startdate)
  await deleteQuery(admin.firestore(), query, 500)
  // End function execution by returning
  return null
}

const schedule = '0 */3 * * *'

/**
 * Cloud Function triggered on a specified CRON schedule
 *
 * Trigger: `PubSub - onRun`
 * 
 * @name cleanData
 * @type {functions.CloudFunction}
 */
export default functions.runWith({ timeoutSeconds: 540 }).region("asia-east2").pubsub.schedule(schedule).timeZone('Asia/Kuwait').onRun(cleanDataEvent)
