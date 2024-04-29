import React from "react";
import clsx from "clsx";
import { withStyles } from '@material-ui/core/styles'
import PropTypes from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";
import styles from './UsersTable.styles'
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Link,
  Tooltip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import HistorySharp from "@material-ui/icons/HistorySharp"
import { EditSharp, DeleteSharp } from '@material-ui/icons'
import { PROFILE_PIC_PATH } from "../../../../constants/paths";
import { getInitials } from "helpers";

function getSafe(fn, defaultVal) {
  try {
    return fn();
  } catch (e) {
    return defaultVal;
  }
}

class UsersTable extends React.Component {
  constructor(props) {
    super(props)
    console.log('UsersTable props', props)
    const { className, classes, superuserPerm, ...rest } = props;
    this.className = className
    this.classes = classes
    this.rest = rest
    this.state = {
      selectedUsers: [],
      rowsPerPage: 25,
      page: 0,
      selectedUser: null,
      deleteConfirmationDialogOpen: false,
    }
  }

  renderDeleteConfirmationDialog = () => {
    return (
      <Dialog
        maxWidth="xs"
        // onEntering={handleEntering}
        aria-labelledby="confirmation-dialog-title"
        open={this.state.deleteConfirmationDialogOpen}
      >
        <DialogTitle id="confirmation-dialog-title">Delete Confirmation</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Are you sure you want to delete the user ({this.state.selectedUser ? `${this.state.selectedUser.uid} - ${this.state.selectedUser.displayName}` : ''})?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={this.handleCancelDeleteConfirmationDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOkDeleteConfirmationDialog} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleCancelDeleteConfirmationDialog = (event) => {
    this.setState({ deleteConfirmationDialogOpen: false, selectedUser: null })
  }

  handleOkDeleteConfirmationDialog = (event) => {
    this.setState({ deleteConfirmationDialogOpen: false, selectedUser: null })
    this.props.deleteUser(this.state.selectedUser)
  }

  openDeleteConfirmationDialog = (user) => {
    console.log("openDeleteConfirmationDialog", user)
    this.setState({
      selectedUser: user,
      deleteConfirmationDialogOpen: true
    })
  }

  handleSelectAll = event => {

    let selectedUsers;

    if (event.target.checked) {
      selectedUsers = this.props.users.map(user => user.id);
    } else {
      selectedUsers = [];
    }

    this.setState({ selectedUsers })
  };

  // handleSelectOne = (event, id) => {
  //   const selectedUsers = this.state.selectedUsers;
  //   const selectedIndex = selectedUsers.indexOf(id);
  //   let newSelectedUsers = [];

  //   if (selectedIndex === -1) {
  //     newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
  //   } else if (selectedIndex === 0) {
  //     newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
  //   } else if (selectedIndex === selectedUsers.length - 1) {
  //     newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelectedUsers = newSelectedUsers.concat(
  //       selectedUsers.slice(0, selectedIndex),
  //       selectedUsers.slice(selectedIndex + 1)
  //     );
  //   }

  //   this.setState({ selectedUsers })
  // };

  handlePageChange = (event, page) => {
    this.setState({ page });
  };

  handleRowsPerPageChange = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  componentDidMount() {

  }

  render() {
    return (
      <Card {...this.rest} className={clsx(this.classes.root, this.className)}>
        {this.renderDeleteConfirmationDialog()}
        <CardContent className={this.classes.content}>
          <PerfectScrollbar>
            <div className={this.classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={this.state.selectedUsers.length === this.props.users.length}
                        color="primary"
                        indeterminate={
                          this.state.selectedUsers.length > 0 &&
                          this.state.selectedUsers.length < this.props.users.length
                        }
                        onChange={this.handleSelectAll}
                      />
                    </TableCell> */}
                    <TableCell>UID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Team ID</TableCell>
                    <TableCell>Manages Teams</TableCell>
                    <TableCell>Permissions</TableCell>
                    <TableCell>Last Location</TableCell>
                    <TableCell>Last Updated Time</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Disabled</TableCell>
                    <TableCell>AppVersion</TableCell>
                    <TableCell>Platform</TableCell>
                    <TableCell colSpan={3}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.users.slice(this.state.page * this.state.rowsPerPage, (this.state.page + 1) * this.state.rowsPerPage).map((user) => {

                    const appVersion = getSafe(() => user.customClaims.lastLocation.extras.appVersion, "No Data");
                    const manufacturer = getSafe(() => user.customClaims.lastLocation.extras.manufacturer, "No Data");
                    const model = getSafe(() => user.customClaims.lastLocation.extras.model, "No Data");
                    const androidVersion = getSafe(() => user.customClaims.lastLocation.extras.version, "No Data");

                    return (
                      <TableRow
                        className={this.classes.tableRow}
                        hover
                        key={user.uid}
                        selected={this.state.selectedUsers.indexOf(user.id) !== -1}
                      >
                        {/* <TableCell padding="checkbox">
                        <Checkbox
                          checked={this.state.selectedUsers.indexOf(user.id) !== -1}
                          color="primary"
                          onChange={event => this.handleSelectOne(event, user.id)}
                          value="true"
                        />
                      </TableCell> */}
                        <TableCell>
                          <div className={this.classes.nameContainer}>
                            <Avatar
                              className={this.classes.avatar}
                              src={user.photoURL || PROFILE_PIC_PATH(user.uid)}
                            >
                              {getInitials(user.uid)}
                            </Avatar>
                            <Typography variant="body1">{user.uid}</Typography>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.displayName}
                        </TableCell>
                        <TableCell>{user.customClaims && user.customClaims.team_id}</TableCell>
                        <TableCell>{user.customClaims && user.customClaims.manages_team_ids && user.customClaims.manages_team_ids.join(", ")}</TableCell>
                        <TableCell>(app: {user.customClaims && user.customClaims.app != null ? user.customClaims.app.toString() : "false"}, admin: {user.customClaims && user.customClaims.admin != null ? user.customClaims.admin.toString() : "false"}, superuser: {user.customClaims && user.customClaims.superuser != null ? user.customClaims.superuser.toString() : "false"})</TableCell>
                        <TableCell>
                          {user.customClaims && user.customClaims.lastLocation && user.customClaims.lastLocation.coords ? `(${user.customClaims.lastLocation.coords.latitude}, ${user.customClaims.lastLocation.coords.longitude})` : "No Data"}
                        </TableCell>
                        <TableCell>
                          {user.customClaims && (user.customClaims.lastUpdatedAt ? new Date(user.customClaims.lastUpdatedAt).toString() : "No Data")}
                        </TableCell>
                        <TableCell>
                          {user.email.toString()}
                        </TableCell>
                        <TableCell>
                          {user.disabled.toString()}
                        </TableCell>
                        <TableCell>
                          {appVersion}
                        </TableCell>
                        <TableCell>
                          {manufacturer ? `${manufacturer} ( ${model} ) - Android ${androidVersion}` : "No Data"}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="History">
                            <Link href={"/users/" + user.uid}>
                              <HistorySharp />
                            </Link>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton disabled={!this.props.superuserPerm} onClick={() => console.log("EditSharp", user)}>
                              <EditSharp />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Delete">
                            <IconButton disabled={!this.props.superuserPerm} onClick={() => this.openDeleteConfirmationDialog(user)}>
                              <DeleteSharp />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )
                  }
                  )}
                </TableBody>
              </Table>
            </div>
          </PerfectScrollbar>
        </CardContent>
        <CardActions className={this.classes.actions}>
          <TablePagination
            component="div"
            count={this.props.users.length}
            onChangePage={this.handlePageChange}
            onChangeRowsPerPage={this.handleRowsPerPageChange}
            page={this.state.page}
            rowsPerPage={this.state.rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 100]}
          />
        </CardActions>
      </Card >
    );
  }
}

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default withStyles(styles)(UsersTable);
