import React from 'react'
import clsx from "clsx";
import moment from "moment"
import { PROFILE_PIC_PATH } from "../../../../../../constants/paths"
import { withStyles } from '@material-ui/core/styles'
import styles from './UserPageContent.styles'
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Avatar
} from "@material-ui/core";
import { getInitials } from "helpers";
import UserHistoricMap from '../UserHistoricMap';
import UserHistoricList from '../UserHistoricList';
import { desiredAccuracy } from '../../../../../../config';
import { getDistanceFromLatLonInKm } from '../../../../../../helpers';


class UserPageContent extends React.Component {
  constructor(props) {
    super(props)
    const { className, loaded, ...rest } = props;
    this.className = className
    this.rest = rest
    this.userId = props.userId
  }

  render() {

    var haltsHistory = []

    for (const key in this.props.haltsHistory) {
      haltsHistory.push(this.props.haltsHistory[key])
    }

    var pathCoordinates1 = this.props.locationHistory && Object.entries(this.props.locationHistory).filter(([k, v]) => v.location.coords.accuracy <= desiredAccuracy)

    var pathCoordinates = [];
    let lastpathCoordinate = null;
    let i = 1;
    // console.log('pathCoordinates1.length', pathCoordinates1.length)
    for (const key in pathCoordinates1) {

      const pathCoordinate = pathCoordinates1[key][1]

      let formattedPathCoordinate = {
        location: pathCoordinate.location,
        activity: pathCoordinate.location.activity,
        accuracy: pathCoordinate.location.coords.accuracy,
        lat: pathCoordinate.location.coords.latitude,
        lng: pathCoordinate.location.coords.longitude,
        unFormattedTimestamp: pathCoordinate.location.timestamp,
        timestamp: moment(pathCoordinate.location.timestamp).format("DD-MM-YYYY HH:mm:ss")
      }

      if (lastpathCoordinate === null) {
        pathCoordinates.push({ ...formattedPathCoordinate, i: i++ })
        lastpathCoordinate = formattedPathCoordinate;
        continue
      }
      let distance = getDistanceFromLatLonInKm(lastpathCoordinate.lat, lastpathCoordinate.lng, formattedPathCoordinate.lat, formattedPathCoordinate.lng);
      let timeDiff = moment(formattedPathCoordinate.unFormattedTimestamp).diff(moment(pathCoordinates[pathCoordinates.length - 1].unFormattedTimestamp))
      console.log("distance, timeDiff", distance, timeDiff);
      if (((distance > 0.02 || timeDiff >= 60000) && formattedPathCoordinate.activity.type === "still") || formattedPathCoordinate.activity.type !== "still") {
        pathCoordinates.push({ ...formattedPathCoordinate, i: i++ })
      }
      lastpathCoordinate = formattedPathCoordinate;
    }

    // pathCoordinates = pathCoordinates && pathCoordinates.map(([k, v], i) => {
    //   return {
    //     location: v.location,
    //     activity: v.location.activity,
    //     accuracy: v.location.coords.accuracy,
    //     lat: v.location.coords.latitude,
    //     lng: v.location.coords.longitude,
    //     timestamp: moment(v.location.timestamp).format("DD-MM-YYYY HH:mm:ss"), i: i + 1
    //   }
    // })

    return (
      <Grid
        container
        spacing={1} >

        <Grid
          item
          lg={9}
          md={12}
          xl={12}
          xs={12}
        >
          <Card {...this.rest} className={clsx(this.props.classes.root, this.className)}>
            <CardHeader title={this.userId} avatar={
              <Avatar
                className={this.props.classes.avatar}
                src={PROFILE_PIC_PATH(this.userId)}
              >
                {getInitials(this.userId)}
              </Avatar>}
            />

            <Divider />
            <CardContent>
              <UserHistoricMap userId={this.userId} selectedDate={this.props.selectedDate} pathCoordinates={pathCoordinates} haltsHistory={haltsHistory} />

            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          lg={3}
          md={12}
          xl={12}
          xs={12}
        >
          <UserHistoricList userId={this.userId} selectedDate={this.props.selectedDate} pathCoordinates={pathCoordinates} />
        </Grid>
      </Grid>)
  }
}

export default withStyles(styles)(UserPageContent);