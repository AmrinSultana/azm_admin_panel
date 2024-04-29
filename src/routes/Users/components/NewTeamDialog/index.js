import { connect } from 'react-redux';
import NewTeamDialog from './NewTeamDialog'
import enhance from './NewTeamDialog.enhancer'

export default enhance(NewTeamDialog);

// connect((state, ownProps) => {
//   // console.log('state >>', state, ownProps)
//   // return { ...state, initialValues: { ...ownProps.selectedTeam, teamID: ownProps.selectedTeam != undefined ? ownProps.selectedTeam.team_id : '4', teamName: ownProps.selectedTeam != undefined ? ownProps.selectedTeam.team_name : '4' } }
// }, {})(enhance(NewTeamDialog))
