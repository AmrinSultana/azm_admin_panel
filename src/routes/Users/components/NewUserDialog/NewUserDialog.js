import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Field, submit } from "redux-form";
import TextField from "components/FormTextField";
import FileField from "components/FormFileField";
import { required } from "utils/form";
import Multiselect from 'react-widgets/Multiselect'
import styles from "./NewUserDialog.styles";
import firebase from "firebase/app";

const duplicateEmployeeID = (value, allValues, props, name) => {
  let employeeID = value.toLowerCase()
  let users = props.users.map(user => user.uid.toLowerCase())
  console.log('duplicateEmployeeID', employeeID, users, users.includes(employeeID))
  return users.includes(employeeID) ? `User ID ${value} already exists` : undefined
}

const duplicateEmployeePhoneNumber = (value, allValues, props, name) => {
  let employeePhoneNumber = value.toLowerCase()
  let users = props.users.map(user => user.phoneNumber.toLowerCase())
  console.log('duplicateEmployeePhoneNumber', employeePhoneNumber, users, users.includes(employeePhoneNumber))
  return users.includes(employeePhoneNumber) ? `Email ID ${value} already exists` : undefined
}

const validPhoneNumber = value => {
  // E.164 number
  return value.match(/^\+?[1-9]\d{1,14}$/) ? undefined : "Invalid phone number";
}

const duplicateEmployeeEmailID = (value, allValues, props, name) => {
  let employeeEmailID = value.toLowerCase()
  let users = props.users.map(user => user.email.toLowerCase())
  console.log('duplicateEmployeeEmailID', employeeEmailID, users, users.includes(employeeEmailID))
  return users.includes(employeeEmailID) ? `Email ID ${value} already exists` : undefined
}

const renderSelectField = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}) => (
  <div>
    <FormControlLabel
      label={label}
      control={
        <Select
          label={label}
          errorText={touched && error}
          {...input}
          onChange={(event) => input.onChange(event.target.value)}
          children={children}
          {...custom}
        />
      }
    />
  </div>
)

const useStyles = makeStyles(styles);

const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? "Invalid email address"
    : undefined;

const employeeID = value =>
  value && !/^[A-Z]{2}[0-9]{2,3}$/i.test(value) ? "Invalid Employee ID" : undefined;

const renderCheckbox = ({ input, label }) => (
  <div>
    <FormControlLabel
      control={
        <Checkbox
          checked={input.value ? true : false}
          onChange={input.onChange}
        />
      }
      label={label}
    />
  </div>
)

function NewUserDialog({ dispatch, onSubmit, open, onRequestClose, users, teams, valid, pristine, submitting }) {
  const classes = useStyles();
  let teamOptions = teams ? teams.map((team) => <MenuItem key={team.team_id} value={team.team_id} >{team.team_name}</MenuItem>) : []
  return (
    <Dialog open={open} onClose={onRequestClose}>
      <DialogTitle id="new-user-dialog-title">New User</DialogTitle>
      <form onSubmit={onSubmit} className={classes.inputs}>
        <DialogContent>
          <Field
            name="employeeID"
            component={TextField}
            label="Employee ID"
            validate={[required, employeeID, duplicateEmployeeID]}
            fullWidth
            autoFocus
            margin="dense"
          />
          <Field
            name="name"
            component={TextField}
            label="Name"
            validate={[required]}
            fullWidth
            margin="dense"
          />
          <Field
            name="email"
            component={TextField}
            label="Email ID"
            validate={[required, email, duplicateEmployeeEmailID]}
            fullWidth
            type="email"
            margin="dense"
          />
          <Field
            name="phoneNumber"
            component={TextField}
            label="Phone Number"
            validate={[required, validPhoneNumber, duplicateEmployeePhoneNumber]}
            fullWidth
            type="phone"
            margin="dense"
          />
          <Field
            name="adminPerm"
            component={renderCheckbox}
            label="Admin Permission"
            margin="dense"
          />
          <Field
            name="appPerm"
            component={renderCheckbox}
            label="App Permission"
            margin="dense"
          />

          <Field
            name="superuser"
            component={renderCheckbox}
            label="Superuser"
            margin="dense"
          />

          <Field
            name="team_id"
            component={renderSelectField}
            label="Team"
            validate={[required]}
            fullWidth
            margin="dense"
          >
            {teamOptions}
          </Field>

          <Field
            name="password"
            component={TextField}
            label="Password"
            validate={[required]}
            fullWidth
            type="password"
            margin="dense"
          />
          <Field
            name="image"
            component={FileField}
            label="Image"
            validate={[required]}
            fullWidth
            type="file"
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onRequestClose} color="secondary">
            Cancel
          </Button>
          <Button disabled={pristine || submitting} onClick={() => {
            dispatch(submit('newUser'));
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

NewUserDialog.propTypes = {
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
};

export default NewUserDialog;
