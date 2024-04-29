import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Multiselect from 'react-widgets/Multiselect';
import "react-widgets/styles.css";
import { Field, submit } from "redux-form";
import TextField from "components/FormTextField";
import { required } from "utils/form";
import styles from "./NewTeamDialog.styles";

const useStyles = makeStyles(styles);

const renderMultiselect = (props) => {
  const { input, data, valueField, dataKey, label, defaultValue, renderListItem, filter, textField, onCreate, messages } = props;
  return (
    <Multiselect {...input}
      onBlur={() => input.onBlur()}
      value={input.value || []} // PROBLEM: input.value does not have the value that I'm passing to value prop to Field
      data={data}
      valueField={valueField}
      textField={textField}
      onCreate={onCreate}
      onChange={input.onChange}
      messages={messages}
      dataKey={dataKey}
      label={label}
      defaultValue={defaultValue}
      filter={filter}
      renderListItem={renderListItem}
      dropUp
    />
  );
}

const duplicateTeamID = (value, allValues, props, name) => {

  let teamID = value.toLowerCase()
  let teams = props.teams.map(team => team.id.toLowerCase())
  return teams.includes(teamID) ? `Team ID ${teamID} already exists` : undefined
}

const duplicateTeamName = (value, allValues, props, name) => {

  let teamName = value.toLowerCase()
  let teams = props.teams ? (props.teams.map(team => team.team_name.toLowerCase())) : []
  return teams.includes(teamName) ? `Team Name ${teamName} already exists` : undefined
}

function filterManagers(item, value) {
  let uid = item.uid.toLowerCase()
  let displayName = item.displayName.toLowerCase()
  let search = value.toLowerCase();
  return uid.includes(search) || displayName.includes(search);
}

function NewTeamDialog({ dispatch, onSubmit, open, onRequestClose, teams, users, pristine, submitting, valid, selectedTeam, ...props }) {

  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onRequestClose}>
      <DialogTitle id="new-user-dialog-title">New Team</DialogTitle>
      <form onSubmit={onSubmit} className={classes.inputs}>
        <DialogContent>
          <Field
            name="teamID"
            component={TextField}
            label="Team ID"
            validate={[required, duplicateTeamID]}
            disabled={selectedTeam != undefined}
            fullWidth
            autoFocus
          />
          <Field
            name="teamName"
            component={TextField}
            label="Team Name"
            validate={[required, duplicateTeamName]}
            fullWidth
          />
          <br />
          <br />
          <br />

          <label htmlFor="managers">Managers</label>
          <Field
            name="managers"
            component={renderMultiselect}
            id="managers"
            dataKey="uid"
            textField="uid"
            valueField="uid"
            label="Managers"
            defaultValue={[]}
            filter={filterManagers}
            data={users.filter(user => user.customClaims.admin)}
            renderListItem={({ item }) => (
              <span>
                <strong>{item.uid}</strong>
                {" - " + item.displayName}
              </span>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onRequestClose} color="secondary">
            Cancel
          </Button>
          <Button disabled={pristine || submitting} onClick={() => {
            dispatch(submit('newTeam'));
            console.log(pristine, submitting);
            if (valid) {
              onRequestClose();
            }
          }}>Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

NewTeamDialog.propTypes = {
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  teams: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired
};

export default NewTeamDialog;
