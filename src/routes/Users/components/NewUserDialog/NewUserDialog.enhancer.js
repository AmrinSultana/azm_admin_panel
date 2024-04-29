import { reduxForm } from 'redux-form'
import { NEW_USER_FORM_NAME } from 'constants/formNames'

export default reduxForm({
  form: NEW_USER_FORM_NAME,
  // Clear the form for future use (creating another user)
  onSubmitSuccess: (result, dispatch, props) => props.reset()
})
