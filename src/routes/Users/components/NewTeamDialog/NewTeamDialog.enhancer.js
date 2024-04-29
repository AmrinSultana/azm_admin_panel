import { reduxForm } from 'redux-form'
import { NEW_TEAM_FORM_NAME } from 'constants/formNames'

export default reduxForm({
  form: NEW_TEAM_FORM_NAME,
  // Clear the form for future use (creating another user)
  onSubmitSuccess: (result, dispatch, props) => props.reset(),
  // initialize: (props) => {
  //   console.log('props >>', props)
  // }
  // initialValues: {
  //   teamID: '4',
  // },
})
