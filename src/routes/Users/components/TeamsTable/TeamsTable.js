import React from "react";
import clsx from "clsx";
import { withStyles } from '@material-ui/core/styles'
import PropTypes from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";
import styles from './TeamsTable.styles'
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  List,
  ListItem,
  ListItemText,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { EditSharp, DeleteSharp } from '@material-ui/icons'
import NewTeamDialog from "../NewTeamDialog";

class TeamsTable extends React.Component {
  constructor(props) {
    super(props)
    const { className, classes, superuserPerm, ...rest } = props;
    this.className = className
    this.classes = classes
    this.rest = rest
    this.superuserPerm = superuserPerm
    this.state = {
      // selectedUsers: [],
      rowsPerPage: 25,
      page: 0,
      deleteConfirmationDialogOpen: false,
      updateDialogOpen: false,
      selectedTeam: null,
    }
  }

  // handleSelectAll = event => {

  //   let selectedUsers;

  //   if (event.target.checked) {
  //     selectedUsers = this.props.users.map(user => user.id);
  //   } else {
  //     selectedUsers = [];
  //   }

  //   this.setState({ selectedUsers })
  // };

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

  handleCancelDeleteConfirmationDialog = (event) => {
    this.setState({ deleteConfirmationDialogOpen: false, selectedTeam: null })
  }

  handleOkDeleteConfirmationDialog = (event) => {
    this.setState({ deleteConfirmationDialogOpen: false, selectedTeam: null })
    this.props.deleteTeam(this.state.selectedTeam)
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
            Are you sure you want to delete the team ({this.state.selectedTeam ? `${this.state.selectedTeam.id} - ${this.state.selectedTeam.team_name}` : ''})?
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

  openDeleteConfirmationDialog = (team) => {
    console.log("openDeleteConfirmationDialog", team)
    this.setState({
      selectedTeam: team,
      deleteConfirmationDialogOpen: true
    })
  }

  openUpdateDialog = (team) => {
    console.log("openUpdateDialog", team)
    this.setState({
      selectedTeam: team,
      updateDialogOpen: true
    })
  }

  toggleTeamDialog = () => {
    this.setState({ updateDialogOpen: !this.state.updateDialogOpen })
  }

  // renderUpdateDialog = () => {
  //   return (<NewTeamDialog
  //     onSubmit={this.props.addTeam}
  //     open={this.state.updateDialogOpen}
  //     onRequestClose={this.toggleTeamDialog}
  //     teams={this.props.teams}
  //     users={this.props.users}
  //     selectedTeam={this.state.selectedTeam}
  //   />)
  // }

  render() {
    return (
      <Card {...this.rest} className={clsx(this.classes.root, this.className)}>
        {this.renderDeleteConfirmationDialog()}
        {/* {this.renderUpdateDialog()} */}
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
                    <TableCell>Team ID</TableCell>
                    <TableCell>Team Name</TableCell>
                    <TableCell>Managers</TableCell>
                    <TableCell colSpan={1}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.teams && this.props.teams.slice(this.state.page * this.state.rowsPerPage, (this.state.page + 1) * this.state.rowsPerPage).map((team) => {

                    return (
                      <TableRow
                        className={this.classes.tableRow}
                        hover
                        key={team.team_id}
                      // selected={this.state.selectedUsers.indexOf(team.team_id) !== -1}
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
                          <Typography variant="body1">{team.team_id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1">{team.team_name}</Typography>
                        </TableCell>
                        <TableCell>
                          <List>
                            {team.managers && team.managers.map((manager) => {
                              return (
                                <ListItem key={manager}>
                                  <ListItemText
                                    primary={manager}
                                  />
                                </ListItem>
                              )
                            })}
                          </List>
                        </TableCell>
                        {/* <TableCell>
                          <Link href="#" onClick={() => this.openUpdateDialog(team)}>
                            <EditSharp />
                          </Link>
                        </TableCell> */}
                        <TableCell>
                          <Tooltip title="Delete">
                            <IconButton aria-label="delete" disabled={!this.props.superuserPerm} onClick={() => this.openDeleteConfirmationDialog(team)}>
                              {/* <Link href="#" onClick={() => this.openDeleteConfirmationDialog(team)}> */}
                              <DeleteSharp />
                              {/* </Link> */}
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
            count={this.props.teams.length}
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

TeamsTable.propTypes = {
  className: PropTypes.string,
  teams: PropTypes.array.isRequired
};

export default withStyles(styles)(TeamsTable);
