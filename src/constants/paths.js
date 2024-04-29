import * as config from 'config'
export const LIST_PATH = '/projects'
export const DASHBOARD_PATH = '/dashboard'
export const LIST_USERS_PATH = '/users'
export const ACCOUNT_PATH = '/account'
export const LOGIN_PATH = '/login'
export const SIGNUP_PATH = '/signup'
export const DOWNLOAD_PATH = '/download'
export const SETTINGS_PATH = '/settings'

// development
// const base_url = 'fir-test-e4371.appspot.com'

// production
// const base_url = 'azm-sales-inspector-baf39.appspot.com'
const base_url = config.firebase.storageBucket;

export const PROFILE_PIC_PATH = (user_id) => `https://firebasestorage.googleapis.com/v0/b/${base_url}/o/ProfilePics%2F${user_id}-0001.jpg?alt=media`

// export const DAILY_SELFIE_PATH = async (user_id, date) => {
//   var storage = firebase.storage();
//   var storageRef = storage.ref();
//   return await storageRef.child(`DailyPics/${date}/${user_id}.jpg`).getDownloadURL()
// }

export const DAILY_SELFIE_PATH = (user_id, date) => `https://firebasestorage.googleapis.com/v0/b/${base_url}/o/DailyPics%2F${date}%2F${user_id}.jpg?alt=media`

// background-image: url("gs://azm-sales-inspector-baf39.appspot.com/DailyPics/21-06-2021/MF14.jpg");

// http://azm-sales-inspector-baf39.appspot.com/DailyPics/21-06-2021/MF14.jpg");