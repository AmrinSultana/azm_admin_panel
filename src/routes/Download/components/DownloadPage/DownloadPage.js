import React from "react";
import clsx from "clsx";
import { withStyles } from '@material-ui/core/styles'
import styles from './DownloadPage.styles'
import MultiSelect from "react-multi-select-component"
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import CsvExport from "../../../../components/CsvExport"
import moment from "moment"
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import {
  Card,
  CardContent,
  InputLabel,
} from "@material-ui/core";


class DownloadPage extends React.Component {
  constructor(props) {
    super(props)
    const { className, classes, ...rest } = props;
    this.classes = classes
    this.className = className
    this.rest = rest
    this.routeHeaders = [
      { label: "User ID", key: "userid" },
      { label: "Name", key: "username" },
      { label: "Timestamp", key: "timestamp" },
      { label: "Latitude", key: "lat" },
      { label: "Longitude", key: "lng" },
    ]
    this.geofenceHeaders = [
      { label: "User ID", key: "userid" },
      { label: "Name", key: "username" },
      { label: "Timestamp", key: "timestamp" },
      { label: "Latitude", key: "lat" },
      { label: "Longitude", key: "lng" },
      { label: "Action", key: "action" },
      { label: "LocationCode", key: "locationCode" },
      { label: "LocationName", key: "locationName" },
    ]
    this.haltHeaders = [
      { label: "User ID", key: "userid" },
      { label: "Name", key: "username" },
      { label: "Timestamp", key: "timestamp" },
      { label: "Duration (in secs)", key: "duration" },
      { label: "North", key: "north" },
      { label: "South", key: "south" },
      { label: "West", key: "west" },
      { label: "East", key: "east" },
    ]
    this.state = {
      allAppUsers: [],
      selectedAppUsers: [],
      appUserSelectorIsLoading: true,
      selectedDateRange: [new Date(), new Date()],
      userMap: {},
    }

  }

  componentDidMount() {
    this.props.listappusers().then(result => {
      var m = {}
      this.setState({
        appUserSelectorIsLoading: false,
        allAppUsers: result.data.map((user) => {
          m[user.uid] = user.displayName
          return {
            label: `${user.displayName}(${user.uid})`, value: `${user.uid}`
          }
        })
      })
      this.setState({ userMap: m })
    })
  }

  selectAppUsers = (s) => {
    this.setState({
      selectedAppUsers: s
    })
  }

  selectDateRange = (val) => {
    this.setState({
      selectedDateRange: val,
    })
  }

  onDownloadRoute = () => {
    var selectedDateStart = moment(this.state.selectedDateRange[0]).format("DD-MM-YYYY")
    var selectedDateEnd = moment(this.state.selectedDateRange[1]).format("DD-MM-YYYY")

    return new Promise((resolve, reject) => {
      this.props.getData(
        this.state.selectedDateRange[0],
        this.state.selectedDateRange[1],
        this.state.selectedAppUsers.map(u => u.value),
        'locations')
        .then(result => {
          var data = []
          result.forEach(function ({ querySnapshot, userid }) {
            querySnapshot.forEach(function (doc) {
              var d = doc.data()
              data.push({
                timestamp: moment(d.location.timestamp).format("DD-MM-YYYY hh:mm:ss"),
                lat: d.location.coords.latitude,
                lng: d.location.coords.longitude,
                userid: userid,
                username: this.state.userMap[userid]
              })
            }.bind(this))
          }.bind(this));

          resolve({ data, headers: this.routeHeaders, filename: `timeline-${selectedDateStart}-to-${selectedDateEnd}.csv` })
        })
    })
  }

  onDownloadHalts = () => {
    var selectedDateStart = moment(this.state.selectedDateRange[0]).format("DD-MM-YYYY")
    var selectedDateEnd = moment(this.state.selectedDateRange[1]).format("DD-MM-YYYY")

    return new Promise((resolve, reject) => {
      this.props.getData(
        this.state.selectedDateRange[0],
        this.state.selectedDateRange[1],
        this.state.selectedAppUsers.map(u => u.value),
        'halts')
        .then(result => {
          var data = []
          result.forEach(function ({ querySnapshot, userid }) {
            querySnapshot.forEach(function (doc) {
              var d = doc.data()
              data.push({
                timestamp: moment(d.timestamp).format("DD-MM-YYYY hh:mm:ss"),
                userid: userid,
                username: this.state.userMap[userid],
                duration: d.duration,
                north: d.rectangle.maxLatitude,
                south: d.rectangle.minLatitude,
                west: d.rectangle.minLongitude,
                east: d.rectangle.maxLongitude
              })
            }.bind(this))
          }.bind(this));
          resolve({ data, headers: this.haltHeaders, filename: `halts-${selectedDateStart}-to-${selectedDateEnd}.csv` })
        })
    })
  }

  onDownloadGeofences = () => {
    var selectedDateStart = moment(this.state.selectedDateRange[0]).format("DD-MM-YYYY")
    var selectedDateEnd = moment(this.state.selectedDateRange[1]).format("DD-MM-YYYY")

    return new Promise((resolve, reject) => {
      this.props.getData(
        this.state.selectedDateRange[0],
        this.state.selectedDateRange[1],
        this.state.selectedAppUsers.map(u => u.value),
        'geofences')
        .then(result => {
          var data = []
          result.forEach(function ({ querySnapshot, userid }) {
            querySnapshot.forEach(function (doc) {
              var d = doc.data()
              data.push({
                timestamp: moment(d.location.timestamp).format("DD-MM-YYYY hh:mm:ss"),
                lat: d.location.coords.latitude,
                lng: d.location.coords.longitude,
                userid: userid,
                username: this.state.userMap[userid],
                action: d.location.geofence.action,
                locationCode: d.location.geofence.extras.locationCode,
                locationName: d.location.geofence.identifier
              })
            }.bind(this))
          }.bind(this));

          resolve({ data, headers: this.geofenceHeaders, filename: `geofence-${selectedDateStart}-to-${selectedDateEnd}.csv` })
        })
    })
  }

  render() {

    return (
      <div className={this.classes.root} >
        <div className={this.classes.content}>
          <Card {...this.rest} className={clsx(this.classes.root, this.className)}>
            <CardContent className={this.classes.content}>

              <InputLabel>Select Users</InputLabel>
              <MultiSelect
                isLoading={this.state.appUserSelectorIsLoading}
                options={this.state.allAppUsers}
                value={this.state.selectedAppUsers}
                onChange={this.selectAppUsers}
                labelledBy={"Select User"}
              />
              <InputLabel>Select DateRange</InputLabel>
              <DateRangePicker
                format="dd-MM-yyyy"
                clearIcon={null}
                onChange={this.selectDateRange}
                value={this.state.selectedDateRange}
                maxDate={new Date()}
                calendarType="Arabic"
              />
              <InputLabel>Click to download Timeline</InputLabel>
              <CsvExport
                asyncExportMethod={this.onDownloadRoute}
              >
                <CloudDownloadIcon />
              </CsvExport>
              <InputLabel>Click to download GeoFence</InputLabel>
              <CsvExport
                asyncExportMethod={this.onDownloadGeofences}
              >
                <CloudDownloadIcon />
              </CsvExport>
              <InputLabel>Click to download Halts</InputLabel>
              <CsvExport
                asyncExportMethod={this.onDownloadHalts}
              >
                <CloudDownloadIcon />
              </CsvExport>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(DownloadPage);
