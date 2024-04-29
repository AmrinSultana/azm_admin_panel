import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';

/**
 * Handle Firestore onWrite event
 *
 * @param {functions.Change} change - Function change interface containing state objects
 * @param {admin.firestore.DataSnapshot} change.before - State prior to the event.
 * @param {admin.firestore.DataSnapshot} change.after - State after the event.
 * @param {functions.EventContext} context - Function event context
 * @param {object} context.auth - Authentication information for the user that triggered the function
 * @returns {Promise} Resolves after handle event
 */
async function writeTeamEvent(change, context) {
  const { params, timestamp } = context
  const { before, after } = change
  const { teamID } = params

  console.log('writeTeam onWrite event:', {
    before: before.data(),
    after: after.data(),
    params,
    timestamp
  })

  const beforeManagers = (before.data() != undefined) ? before.data().managers : []
  const afterManagers = (after.data() != undefined) ? after.data().managers : []

  const revokedManagers = beforeManagers.filter(manager => !afterManagers.includes(manager))
  const allowedManagers = afterManagers.filter(manager => !beforeManagers.includes(manager))

  console.log(beforeManagers, afterManagers, revokedManagers, allowedManagers)

  for (const managerUid of revokedManagers) {
    let managerObj = await admin
      .auth().getUser(managerUid)
    console.log(managerUid, managerObj.customClaims)
    let manages_team_ids = managerObj.customClaims['manages_team_ids']
    manages_team_ids = (manages_team_ids != undefined) ? manages_team_ids : []
    manages_team_ids = manages_team_ids.filter(team_id => team_id != teamID)
    await admin.auth()
      .setCustomUserClaims(managerUid, { ...managerObj.customClaims, manages_team_ids })
  }

  for (const managerUid of allowedManagers) {
    let managerObj = await admin
      .auth().getUser(managerUid)
    console.log(managerObj.customClaims, managerUid, managerObj.customClaims)
    let manages_team_ids = managerObj.customClaims['manages_team_ids']
    manages_team_ids = (manages_team_ids != undefined) ? manages_team_ids : []
    manages_team_ids.push(teamID)
    console.log('manages_team_ids', manages_team_ids)
    await admin.auth()
      .setCustomUserClaims(managerUid, { ...managerObj.customClaims, manages_team_ids })
  }

  // End function execution by returning
  return null
}

/**
 * Cloud Function triggered by Firestore onWrite Event
 *
 * Trigger: `Firestore - onWrite`
 *
 * @name writeTeam
 * @type {functions.CloudFunction}
 */
export default functions.region("asia-east2").firestore
  .document('teams/{teamID}')
  .onWrite(writeTeamEvent)
