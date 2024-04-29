import React from "react";
// import { makeStyles } from '@material-ui/styles';
import { Grid } from "@material-ui/core";
// import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import styles from "./Dashboard.styles";
// import { useFirebase } from 'react-redux-firebase'
// import { useNotifications } from 'modules/notification'

// import Budget from '../Budget'
// import LatestOrders from '../LatestOrders'
// import LatestProducts from '../LatestProducts'
// import LatestSales from '../LatestSales'
import UsersLiveMap from "../UsersLiveMap";
// import TasksProgress from '../TasksProgress'
// import TotalProfit from '../TotalProfit'
import TotalUsers from "../TotalUsers";
// import UsersByDevice from '../UsersByDevice'
import UsersList from "../UsersList";
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    const { profile, classes } = props;

    this.profile = profile;
    this.classes = classes;
    this.state = {
      userMap: {},
      users: [],
    };
  }

  componentDidMount() {
    console.log("this.profile.token.claims", this.profile.token.claims);
    if (
      this.profile.token.claims.admin === false &&
      (this.profile.token.claims == undefined ||
        this.profile.token.claims.superuser === false)
    ) {
      this.props.firebase.logout();
    }
    console.log("this.props.users", this.props.users);

    this.props.listappusers().then((result) => {
      var m = {};
      result.data.forEach((user) => {
        m[user.uid] = user;
      });
      this.setState({
        userMap: m,
        users: this.props.users.filter((user) => user.id in m),
      });
    });
  }

  render() {
    let ts = Math.round(new Date().getTime() / 1000);
    let tsYesterday = ts - 24 * 3600;
    let activeUsers = this.state.users.filter(
      (user) =>
        tsYesterday < new Date(user.lastLocation.timestamp).getTime() / 1000
    );

    console.log(this.state.userMap);

    return (
      <div className={this.classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalUsers
              text="Total Active App Users"
              usercount={
                Object.keys(this.state.userMap)
                  .map((k) => this.state.userMap[k])
                  .filter((k) => !k.disabled).length
              }
            />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalUsers
              text="Total Users in Last 24 hrs"
              usercount={activeUsers.length}
            />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            {/* <TotalProfit /> */}
          </Grid>
          <Grid item lg={9} md={9} xl={9} xs={12}>
            <UsersLiveMap users={activeUsers} />
          </Grid>
          <Grid item lg={3} md={3} xl={3} xs={12}>
            <UsersList usermap={this.state.userMap} users={activeUsers} />
          </Grid>
          {/* <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <UsersByDevice />
          </Grid> */}
          {/* <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <LatestProducts />
          </Grid> */}
          {/* <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <LatestOrders />
          </Grid> */}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Dashboard);
