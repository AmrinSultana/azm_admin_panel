import React from 'react'
import clsx from "clsx"
import moment from "moment"
import { withStyles } from '@material-ui/core/styles'
import styles from './UserHistoricList.styles'
import { isEmpty } from "react-redux-firebase/lib/helpers"
import { DAILY_SELFIE_PATH } from "../../../../../../constants/paths";

import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Divider,
  ListItem,
  List,
  ListItemText,
  ListItemAvatar,
  Paper,
  IconButton,
  CardMedia,
} from "@material-ui/core";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { CSVLink } from "react-csv";
import { Fragment } from 'react'


class UserHistoricList extends React.Component {
  constructor(props) {
    super(props)
    const { className, classes, ...rest } = props;
    this.classes = classes
    this.className = className
    this.rest = rest
  }

  render() {

    var headers = [
      { label: "S.No.", key: "i" },
      { label: "Timestamp", key: "timestamp" },
      { label: "Latitude", key: "lat" },
      { label: "Longitude", key: "lng" },
    ];

    var data = this.props.pathCoordinates || [];

    var selectedDate = moment(this.props.selectedDate).format("DD-MM-YYYY")

    return (
      <Card {...this.rest} className={clsx(this.classes.root, this.className)}>
        <CardHeader
          title="Timeline"
          action={
            <IconButton aria-label="settings">
              <CSVLink filename={`timeline-${this.props.userId}-${selectedDate}.csv`} data={data} headers={headers} >
                <CloudDownloadIcon />
              </CSVLink>
            </IconButton>
          } />
        <Divider />
        <CardMedia
          className={this.classes.media}
          image={DAILY_SELFIE_PATH(this.props.userId, selectedDate)}
          title={"Selfie for " + this.props.userId}
        />
        <CardContent>
          <Paper style={{ maxHeight: 500, overflow: 'auto' }}>
            <List>
              {!isEmpty(this.props.pathCoordinates) && this.props.pathCoordinates.map(p => (
                <Fragment key={p.i}>
                  <ListItem key={`listitem-${p.i}`} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar classeName={this.classes.purple}>
                        {p.i}
                      </Avatar>
                      {/* <Avatar src={{ in_vehicle: '/images/car.svg', walking: '/images/shoes.svg', still: '/images/standing.svg', running: '/images/running.svg' }[p.activity && p.activity.type]} classeName={this.classes.small}/> */}
                    </ListItemAvatar>
                    <ListItemText primary={"(" + p.lat + ", " + p.lng + ")"} secondary={p.timestamp} />
                  </ListItem>
                  <Divider variant="inset" component="li" key={`divider-${p.i}`} />
                </Fragment>
              ))}

            </List>

          </Paper>
        </CardContent>
      </Card>
    )
  }
}

export default withStyles(styles)(UserHistoricList);