import React from "react";
import clsx from "clsx";
import { withStyles } from '@material-ui/core/styles'
import styles from './SettingsPage.styles'
import {
  Card,
  CardContent,
  Button,
  Link,
  CardHeader,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import firebase from "firebase/app";
import "firebase/storage";
import { readString } from 'react-papaparse'

function isNumber(val) {
  return val.match(/^\d*(\.)?\d*$/)
}

// function isInt(val) {
//   return val.match(/^-?\d+$/)
// }


class SettingsPage extends React.Component {
  constructor(props) {
    super(props)
    const { className, classes, ...rest } = props;
    this.classes = classes
    this.className = className
    this.rest = rest
    this.state = {
      lastUpdated: new Date(),
      downloadURL: "",
      openErrorDialog: false,
      errors: [],
      openSuccessDialog: false,
    }
    this.bucketName = "azm-sales-inspector-geofences"
    // this.bucketName = "azm-sales-inspector-baf39.appspot.com"
    this.fileName = "geofences.csv"
    this.fileInputRef = React.createRef();
  }

  onRequestErrorDialogClose = () => {
    this.setState({
      openErrorDialog: false,
      errors: [],
    })
  }

  onRequestSuccessDialogClose = () => {
    this.setState({
      openSuccessDialog: false,
    })
  }

  renderSuccessDialog = () => {
    return (
      <Dialog
        open={this.state.openSuccessDialog}
        onClose={this.onRequestSuccessDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Success"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Geofences have been updated.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onRequestSuccessDialogClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  renderErrorDialog = () => {
    return (
      <Dialog open={this.state.openErrorDialog} onClose={this.onRequestErrorDialogClose}>
        <DialogTitle id="new-user-dialog-title">Errors</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {this.state.errors.map((error, i) => {
              return <div key={i}>{error}</div>
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onRequestErrorDialogClose} color="secondary">
            OK
          </Button>
          {/* <Button onClick={() => { dispatch(submit('newUser')); onRequestClose() }}>Create</Button> */}
        </DialogActions>
      </Dialog>
    );
  }

  updateMeta = async () => {
    const storageRef = firebase.storage().refFromURL(`gs://${this.bucketName}`);
    var forestRef = storageRef.child(this.fileName);
    const metadata = await forestRef.getMetadata();
    this.setState({ lastUpdated: metadata.updated, downloadURL: await forestRef.getDownloadURL() });
  }

  async componentDidMount() {
    await this.updateMeta()
  }

  validateCsv = (results) => {
    var errors = []
    const requiredFields = new Set(["latitude", "longitude", "radius", "name", "locationCode"])
    const headers = new Set(results.meta.fields)
    const difference = new Set(
      [...requiredFields].filter(x => !headers.has(x)));
    if (difference.size > 0) {
      errors.push("Missing fields: " + [...difference].join(", "))
      return errors
    }
    results.data.forEach((row, i) => {
      if (!isNumber(row["latitude"])) {
        errors.push("Row " + (i + 2) + `: latitude (${row.latitude}) is not a number`)
      }
      if (!isNumber(row["longitude"])) {
        errors.push("Row " + (i + 2) + `: longitude (${row.longitude}) is not a number`)
      }
      if (!isNumber(row["radius"])) {
        errors.push("Row " + (i + 2) + `: radius (${row.radius}) is not a number`)
      }
    })
    return errors
  }

  uploadCsv = async (e) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]
        const data = await new Response(file).text()
        readString(data, {
          worker: true,
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            const errors = this.validateCsv(results)
            if (errors.length > 0) {
              console.log(errors)
              // alert([...errors].join(", "))
              this.setState({ openErrorDialog: true, errors: errors })
            } else {
              console.log(results.meta)
              console.log(results.data)
              const storageRef = firebase.storage().refFromURL(`gs://${this.bucketName}`);
              var forestRef = storageRef.child(this.fileName);
              await forestRef.put(file)
              // alert("Upload is done")
              this.setState({ openSuccessDialog: true })
              await this.updateMeta()
            }
          }
        })
      } else {
        alert("No file selected")
      }
    } catch (error) {
      console.log(error)
      this.setState({ openErrorDialog: true, errors: [`Upload failed: ${error.message}`] })
    }
    this.fileInputRef.current.value = null
  }

  render() {

    return (
      <div className={this.classes.root} >
        <div className={this.classes.content}>
          {this.renderErrorDialog()}
          {this.renderSuccessDialog()}
          <Card {...this.rest} className={clsx(this.classes.root, this.className)}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" className={this.classes.avatar}>
                  <LocationOnOutlinedIcon />
                </Avatar>
              }
              title="Geofences"
              subheader={"Last updated at: " + (new Date(this.state.lastUpdated).toString())}
            />
            <CardContent className={this.classes.content}>
              <Link href={this.state.downloadURL} download>Download Link</Link>
              <br />
              <br />
              <br />
              <input
                accept=".csv"
                className={this.classes.input}
                id="contained-button-file"
                type="file"
                onChange={this.uploadCsv}
                ref={this.fileInputRef}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                  Upload
                </Button>
              </label>

            </CardContent>
          </Card>
        </div>
      </div >
    );
  }
}

export default withStyles(styles)(SettingsPage);
