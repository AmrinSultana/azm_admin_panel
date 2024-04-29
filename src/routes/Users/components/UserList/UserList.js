import React from "react";
import styles from './UserList.styles'
import SwipeableViews from 'react-swipeable-views';
import { withStyles } from '@material-ui/core/styles'
import firebase from "firebase/app";
import "firebase/storage";
import { firebase as firebaseConfig } from 'config';

import { Tabs, Tab, Box, Typography } from '@material-ui/core';
import { UsersToolbar, UsersTable, TeamsTable, TeamsToolbar } from "../../components";
import NewTeamDialog from "../NewTeamDialog";
import NewUserDialog from "../NewUserDialog";

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.any.isRequired,
//   value: PropTypes.any.isRequired,
// };

class UserList extends React.Component {
  constructor(props) {
    super(props)
    const { classes } = props
    this.classes = classes
    this.state = {
      currentUserClaims: { superuser: false },
      selectedTabValue: 0,
      users: [],
      filteredUsers: [],
      newUserDialogOpen: false,
      newTeamDialogOpen: false
    }
  }

  updateUsersList = () => {
    this.props.listusers().then(result => {
      this.setState({ users: result.data, filteredUsers: result.data })
    })
  }

  async componentDidMount() {
    this.updateUsersList()
    const idTokenResult = await this.props.firebase.auth().currentUser.getIdTokenResult();
    console.log('idTokenResult.claims', idTokenResult.claims)
    this.setState({
      currentUserClaims: idTokenResult.claims
    })
  }

  toggleUserDialog = () => {
    this.setState({ newUserDialogOpen: !this.state.newUserDialogOpen })
  }

  toggleTeamDialog = () => {
    this.setState({ newTeamDialogOpen: !this.state.newTeamDialogOpen })
  }

  searchUser = (event) => {
    const searchTerm = event.target.value.toLowerCase()
    this.setState({
      filteredUsers: this.state.users.filter(user => {
        const uid = user.uid.toLowerCase()
        const displayName = user.displayName.toLowerCase()
        return uid.includes(searchTerm) || displayName.includes(searchTerm)
      })
    })
  }

  addUser = async (newInstance) => {
    // if (!auth.uid) {
    //   return showError("You must be logged in to create a user");
    // }
    console.log("addUser ", newInstance);
    const { employeeID, name, email, phoneNumber, appPerm, adminPerm, superuser, team_id, password, image } = newInstance;
    const fileName = `TempProfilePicUpload/${employeeID}-0001.jpg`

    const storageRef = firebase.storage().ref();
    var forestRef = storageRef.child(fileName);
    await forestRef.put(image)

    try {
      const result = await this.props.firebase.app().functions(firebaseConfig.region).httpsCallable("createUser")({
        name,
        email,
        phoneNumber,
        password,
        uid: employeeID,
        claims: {
          app: appPerm ? appPerm : false,
          admin: adminPerm ? adminPerm : false,
          superuser: superuser ? superuser : false,
          team_id: team_id ? team_id : null
        },
      })
      console.log("Result ", result)
      this.updateUsersList()
      alert("User created successfully")
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  }

  addTeam = (newInstance) => {
    console.log("addTeam ", newInstance);
    this.props.createTeam(newInstance)
  }

  handleTabChange = (event, newValue) => {
    this.setState({ selectedTabValue: newValue });
  };

  handleTabChangeIndex = (index) => {
    this.setState({ selectedTabValue: index });
  };

  deleteUser = async (userData) => {
    await this.props.deleteUser(userData)
    alert("User deleted successfully")
    this.updateUsersList()
  }

  render() {
    return (
      <div className={this.classes.root}>

        <Tabs
          value={this.state.selectedTabValue}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Users" {...a11yProps(0)} />
          <Tab label="Teams" {...a11yProps(1)} />
        </Tabs>

        <SwipeableViews
          // axis={this.theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.selectedTabValue}
          onChangeIndex={this.handleTabChangeIndex}
        >
          <TabPanel value={this.state.selectedTabValue} index={0} >
            <UsersToolbar showAddUser={this.state.currentUserClaims.superuser} onSearchUser={this.searchUser} onAddUserClick={this.toggleUserDialog} />
            <div className={this.classes.content}>
              <UsersTable users={this.state.filteredUsers} superuserPerm={this.state.currentUserClaims.superuser} deleteUser={this.deleteUser} />
            </div>
            {/* <UserAdditionModal
          open={openUserAdditionModal}
          handleClose={handleCloseOpenUserAdditionModal}
        /> */}
            <NewUserDialog
              onSubmit={this.addUser}
              open={this.state.newUserDialogOpen}
              onRequestClose={this.toggleUserDialog}
              teams={this.props.teams}
              users={this.state.users}
            />
          </TabPanel>
          <TabPanel value={this.state.selectedTabValue} index={1}>
            <TeamsToolbar showAddTeam={this.state.currentUserClaims.superuser} onAddTeamClick={this.toggleTeamDialog} />
            <div className={this.classes.content}>
              <TeamsTable superuserPerm={this.state.currentUserClaims.superuser} teams={this.props.teams} users={this.state.users} deleteTeam={this.props.deleteTeam} addTeam={this.props.addTeam} />
            </div>
            <NewTeamDialog
              onSubmit={this.addTeam}
              open={this.state.newTeamDialogOpen}
              onRequestClose={this.toggleTeamDialog}
              teams={this.props.teams}
              users={this.state.users}
            />
          </TabPanel>
        </SwipeableViews>


      </div>
    );
  }
}
export default withStyles(styles)(UserList);
