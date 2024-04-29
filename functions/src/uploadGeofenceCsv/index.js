import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const bucketName = "azm-sales-inspector-geofences"
const collectionName = "geofences"

function readCSVContent(fileName) {
  return new Promise((resolve, reject) => {
    const bucket = admin.storage().bucket(bucketName)

    let fileContents = new Buffer('');
    bucket.file(fileName).createReadStream()
      .on('error', function (err) {
        reject('The Storage API returned an error: ' + err);
      })
      .on('data', function (chunk) {
        fileContents = Buffer.concat([fileContents, chunk]);
      })
      .on('end', function () {
        let content = fileContents.toString('utf8');
        console.log("CSV content read as string : " + content);
        resolve(content);
      });
  });
}

async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
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

function csvToArray(str, delimiter = ",") {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  str = str.replace(/(\r)/gm, "");
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      if (header != undefined && values[index] != undefined) {
        object[header.trim()] = values[index].trim();
      }
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
}

async function getTemplate() {
  var config = admin.remoteConfig();
  return await config.getTemplate();
}

/**
 * Handle storage onFinalize event
 * @param {functions.storage.Object} object - Object associated with storage event
 * @param {functions.EventContext} context - Function event context
 * @returns {Promise} After handling uploadGeofenceCsv event
 */
async function uploadGeofenceCsvEvent(object, context) {
  const { name, contentType } = object
  console.log('Storage onFinalize event:', { name, contentType, context })
  if (!name.endsWith(".csv")) {
    console.log("Not a .csv file, ignoring.");
    return;
  }
  let data = await readCSVContent(name);
  console.log("typeof readCSVContent", typeof (data), data.length)
  console.log("readCSVContent", data)
  let arr = csvToArray(data);
  console.log("csvToArray", arr)

  await deleteCollection(admin.firestore(), collectionName, 100)

  arr.map(async doc => {
    if (doc.locationCode != "") {
      const documentRef = admin
        .firestore()
        .collection(collectionName)
        .doc(doc.locationCode);
      await documentRef.set(
        {
          itemID: doc.locationCode,
          location: new admin.firestore.GeoPoint(Number(doc.latitude), Number(doc.longitude)),
          locationCode: doc.locationCode,
          name: doc.name,
          radius: Number(doc.radius)
        }
      )
    }
  });
  let template = await getTemplate();
  console.log('ETag from server: ' + template.etag);
  console.log(JSON.stringify(template));
  const newValue = parseInt(template.parameters['last_geofences_updated_remotely_at'].defaultValue.value) + 1;
  template.parameters['last_geofences_updated_remotely_at'] = {
    defaultValue: {
      value: newValue.toString(),
    },
    valueType: 'NUMBER'
  };
  var config = admin.remoteConfig();
  await config.publishTemplate(template)
}

/**
 * Cloud Function triggered by Cloud Storage onFinalize Event
 *
 * Trigger: `Storage - onFinalize`
 * @name uploadGeofenceCsv
 * @type {functions.CloudFunction}
 * @public
 */
export default functions.region("asia-east2").storage
  .bucket(bucketName)
  .object()
  .onFinalize(uploadGeofenceCsvEvent)
