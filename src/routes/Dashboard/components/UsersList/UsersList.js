import React, { useState } from "react";
// import { Doughnut } from "react-chartjs-2";
import { bindActionCreators } from 'redux';
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { PROFILE_PIC_PATH } from "../../../../constants/paths";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";

// import LaptopMacIcon from "@material-ui/icons/LaptopMac";
// import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
// import RefreshIcon from "@material-ui/icons/Refresh";
// import TabletMacIcon from "@material-ui/icons/TabletMac";
import SearchInput from "../../../../components/SearchInput";
import { isEmpty } from "react-redux-firebase/lib/helpers";
import { getInitials } from "helpers";
import { connect } from 'react-redux';
import { selectedUserChange } from "../../../../store/user";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%"
  },
  searchBarContainer1: {
    position: "relative",
    height: "300px"
  },
  stats: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "center"
  },
  device: {
    textAlign: "center",
    padding: theme.spacing(1)
  },
  deviceIcon: {
    color: theme.palette.icon
  },
  nameContainer: {
    display: "flex",
    alignItems: "center"
  },
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const UsersList = props => {
  const { className, users, usermap, ...rest } = props;

  const classes = useStyles();
  // const theme = useTheme();
  const [searchText, setSearchText] = useState("");

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Users" />
      <Divider />
      <CardContent>
        <div className={classes.searchBarContainer}>
          <SearchInput placeholder="Employee Code" onChange={(event) => { console.log("searched term ", event.target.value); setSearchText(event.target.value); }} />
        </div>
        <div className={classes.stats}>
          {/* <Table>
            <TableBody>
            {!isEmpty(users) && users.map((user) => (
              <TableRow>
                <TableCell>
                  <div className={classes.nameContainer}>
                    <Avatar className={classes.avatar} src={'/images/avatars/user.png'}>
                    {getInitials(user.email)}
                    </Avatar>
                    <Typography variant="body1">{user.email}</Typography>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table> */}

          <List>
            {!isEmpty(users) &&
              users.filter((user) => { return user.id.includes(searchText) }).map(user => (

                <ListItem button key={user.id} selected={user.id === (props.selectedUser ? props.selectedUser.id : null)} onClick={() => { props.update_selected_user(user); }}>
                  <Avatar
                    className={classes.avatar}
                    alt="No Profile Pic"
                    src={PROFILE_PIC_PATH(user.id)}
                  >
                    {getInitials(user.id)}
                  </Avatar>
                  <ListItemText primary={usermap[user.id] != null ? usermap[user.id].displayName + " ("+ user.id +")" : user.id} />
                </ListItem>
              ))}
          </List>
        </div>
      </CardContent>
    </Card>
  );
};

UsersList.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array
};

const mapStateToProps = state => ({

  selectedUser: state.selectedUser

});


const mapDispatchToProps = dispatch => {
  const dispatchProps = bindActionCreators({ selectedUserChange }, dispatch);
  return {
    update_selected_user: (user) => {
      dispatchProps.selectedUserChange(user);
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(UsersList);

