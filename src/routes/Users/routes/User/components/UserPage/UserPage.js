import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import styles from './UserPage.styles'
import DatePicker from 'react-date-picker'
import UserPageContent from '../UserPageContent'
import {
  Grid
} from "@material-ui/core";

class UserPage extends React.Component {
  constructor(props) {
    super(props)
    const urlParams = new URLSearchParams(this.props.location.search)
    var selecteddate = urlParams.get('selecteddate')
    const { className, loaded, google, ...rest } = props;
    this.className = className
    this.loaded = loaded
    this.google = google
    this.rest = rest
    this.userId = props.match.params.userId
    if (selecteddate == null) {
      selecteddate = new Date()
    } else {
      const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(selecteddate);
      selecteddate = new Date(m[3], m[2] - 1, m[1]);
    }
    this.state = {
      selectedDate: selecteddate
    }
  }

  addQuery = (key, value) => {
    let pathname = this.props.location.pathname;
    // returns path: '/app/books'
    let searchParams = new URLSearchParams(this.props.location.search);
    // returns the existing query string: '?type=fiction&author=fahid'
    searchParams.set(key, value);
    this.props.history.push({
      pathname: pathname,
      search: searchParams.toString()
    });
  };

  selectDate = (newValue) => {
    this.addQuery('selecteddate', newValue.toLocaleDateString());
    this.setState({ selectedDate: newValue })
  }

  render() {
    return (
      <div className={this.props.classes.root}>
        <Grid
          container
          spacing={1}
        >
          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
          >
            {/* <Card {...this.rest} className={clsx(this.props.classes.root, this.className)}>
              <CardContent>
                <Typography variant="h4">Select Date</Typography> */}

            <DatePicker value={this.state.selectedDate} onChange={this.selectDate} format="dd-MM-yyyy" maxDate={new Date()} clearIcon={null} calendarType="Arabic" />
            {/* </CardContent>
            </Card> */}
          </Grid>
          <Grid item
            lg={12}
            md={12}
            xl={12}
            xs={12}>
            <UserPageContent userId={this.userId} selectedDate={this.state.selectedDate} />
          </Grid>

        </Grid>
      </div>
    )
  }
}



export default withStyles(styles)(UserPage);