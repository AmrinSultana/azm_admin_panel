import React, { useState } from "react";
import { connect } from "react-redux";
// import { bindActionCreators } from 'redux';
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { mapApiKey } from "config";
import { Card, CardHeader, CardContent, Divider } from "@material-ui/core";
import { isEmpty } from "react-redux-firebase/lib/helpers";
import { GoogleApiWrapper, Map, Marker, InfoWindow } from "google-maps-react";

import { PROFILE_PIC_PATH } from "../../../../constants/paths";
import { initialMapCenter } from "../../../../config";

const useStyles = makeStyles(() => ({
  root: {},
  chartContainer: {
    height: 700,
    position: "relative",
  },
  actions: {
    justifyContent: "flex-end",
  },
}));

const UsersLiveMap = (props) => {
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState({});
  const [selectedPlace, setSelectedPlace] = useState({});

  const onMarkerClick = (props, marker, e) => {
    setSelectedPlace(props);
    setActiveMarker(marker);
    setShowInfoWindow(true);
  };

  // const onMapClicked = props => {
  //   if (showInfoWindow) {
  //     setShowInfoWindow(false);
  //     setActiveMarker(null);
  //   }
  // };

  const { className, loaded, users, google, ...rest } = props;

  var center = initialMapCenter;
  if (props.selectedUser != null) {
    console.log("selectedUser", props.selectedUser);
    center = {
      lat: props.selectedUser.lastLocation.coords.latitude,
      lng: props.selectedUser.lastLocation.coords.longitude,
    };
  }

  const classes = useStyles();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="Live Map" />
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          {/* <Bar
            data={data}
            options={options}
          /> */}
          {/* <Map
            google={google}
            onClick={onMapClicked}
            zoom={15}
            style={{ width: "100%", height: "100%", position: "relative" }}
            className={"map"}
            initialCenter={center}
          >
            {!isEmpty(location_history) && (
              <Polyline
                path={location_history.map(lh => ({
                  lat: lh.location.latitude,
                  lng: lh.location.longitude
                }))}
                strokeColor="#0000FF"
                strokeOpacity={0.8}
                strokeWeight={2}
              />
            )}
            {!isEmpty(location_history) &&
              location_history.map(lh => (
                <Marker
                  key={lh.id}
                  title={(new Date(lh.timestamp.seconds*1000)).toString()}
                  name={(new Date(lh.timestamp.seconds*1000)).toString()}
                  position={{
                    lat: lh.location.latitude,
                    lng: lh.location.longitude
                  }}
                  icon={{
                    url: "/images/avatars/user.png",
                    scaledSize: new google.maps.Size(25, 25)
                  }}
                  onClick={onMarkerClick}
                />
              ))}
            <InfoWindow marker={activeMarker} visible={showInfoWindow}>
              <div>
                <h1>{selectedPlace.name}</h1>
              </div>
            </InfoWindow>
          </Map> */}

          <Map
            google={google}
            zoom={15}
            style={{ width: "100%", height: "100%", position: "relative" }}
            className={"map"}
            initialCenter={initialMapCenter}
            center={center}
            maxZoom={18}
            minZoom={10}
          >
            {!isEmpty(users) &&
              users.map((user) => (
                <Marker
                  optimized={
                    !(props.selectedUser && props.selectedUser.id == user.id)
                  }
                  zIndex={
                    props.selectedUser && props.selectedUser.id == user.id
                      ? 999999
                      : 0
                  }
                  key={user.id}
                  title={user.id}
                  lastUpdatedTimeStamp={new Date(
                    user.lastLocation.timestamp
                  ).toString()}
                  battery={user.lastLocation.battery}
                  is_moving={user.lastLocation.extras.is_moving}
                  position={{
                    lat: user.lastLocation.coords.latitude,
                    lng: user.lastLocation.coords.longitude,
                  }}
                  icon={
                    props.selectedUser && props.selectedUser.id == user.id
                      ? ""
                      : {
                          url: PROFILE_PIC_PATH(user.id),
                          anchor: new google.maps.Point(
                            user.lastLocation.coords.latitude,
                            user.lastLocation.coords.longitude
                          ),
                          scaledSize:
                            props.selectedUser &&
                            props.selectedUser.id == user.id
                              ? new google.maps.Size(50, 50)
                              : new google.maps.Size(30, 30),
                        }
                  }
                  // icon={{
                  //   url: PROFILE_PIC_PATH(user.id),
                  //   anchor: new google.maps.Point(
                  //     user.lastLocation.coords.latitude,
                  //     user.lastLocation.coords.longitude
                  //   ),
                  //   scaledSize: (props.selectedUser && props.selectedUser.id == user.id)? new google.maps.Size(50, 50) : new google.maps.Size(30, 30)
                  // }}
                  onClick={onMarkerClick}
                />
              ))}
            <InfoWindow marker={activeMarker} visible={showInfoWindow}>
              <div>
                <h3>UserID: {selectedPlace.title}</h3>
                <br />
                <h4>Last Updated At: {selectedPlace.lastUpdatedTimeStamp}</h4>
                <br />
                <h4>
                  Battery:{" "}
                  {selectedPlace.battery != null &&
                  selectedPlace.battery.is_charging
                    ? ""
                    : "Not"}{" "}
                  Charging ({" "}
                  {selectedPlace.battery != null &&
                    selectedPlace.battery.level * 100}
                  % )
                </h4>
                <br />
              </div>
            </InfoWindow>
          </Map>
        </div>
      </CardContent>
      {/* <Divider /> */}
      {/* <CardActions className={classes.actions}>
        <Button
          color="primary"
          size="small"
          variant="text"
        >
          Overview <ArrowRightIcon />
        </Button>
      </CardActions> */}
    </Card>
  );
};

UsersLiveMap.propTypes = {
  className: PropTypes.string,
};

const mapStateToProps = (state) => ({
  selectedUser: state.selectedUser,
});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default GoogleApiWrapper({
  apiKey: mapApiKey,
})(connect(mapStateToProps, mapDispatchToProps)(UsersLiveMap));
