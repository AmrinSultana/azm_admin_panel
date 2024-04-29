// ------------------------------------
// Constants
// ------------------------------------
export const SELECTED_USER_CHANGE = 'SELECTED_USER_CHANGE'

// ------------------------------------
// Actions
// ------------------------------------
export function selectedUserChange(user) {
  return {
    type: SELECTED_USER_CHANGE,
    payload: user
  }
}

// ------------------------------------
// Specialized Action Creator
// ------------------------------------
export function update_selected_user({ dispatch }) {
  return nextSelectedUser => dispatch(selectedUserChange(nextSelectedUser))
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = null
export default function userReducer(state = initialState, action) {
  return action.type === SELECTED_USER_CHANGE ? action.payload : state
}
