import React from 'react'
import firebase from 'firebase'
import { withStyles } from '@material-ui/core/styles'
import styles from './UserHistoricMap.styles'
import { isEmpty } from "react-redux-firebase/lib/helpers"
import { mapApiKey } from 'config'
import {
  GoogleApiWrapper,
  Map,
  Polyline,
  Marker,
  InfoWindow,
  Circle,
  Rectangle
} from "google-maps-react";
import { initialMapCenter } from '../../../../../../config';


class UserHistoricMap extends React.Component {
  constructor(props) {
    super(props)
    const { className, loaded, google, firestore, ...rest } = props;
    this.className = className
    this.loaded = loaded
    this.google = google
    this.rest = rest
    this.userId = props.userId
    this.lineSymbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    };
    this.firestore = firestore

    this.initialCenter = initialMapCenter;
    this.state = {
      showInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      geoFences: [],
      currentZoomLevel: 8,
      center: initialMapCenter,
    }
    this.map = null
  }

  updateCenter = () => {
    var center = this.state.center
    if (this.props.pathCoordinates && this.props.pathCoordinates.length) {
      center = this.computeCenter(this.props.pathCoordinates)
    } else {
      center = initialMapCenter
    }
    this.setState({ center: center })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pathCoordinates !== this.props.pathCoordinates) {
      this.updateCenter();
    }
  }

  componentDidMount = async () => {
    const remoteConfig = firebase.remoteConfig();
    remoteConfig.settings = {
      fetchTimeMillis: 60000, // One min before timing out while fetching
      minimumFetchIntervalMillis: 15 * 60000 // 15 min
    };
    remoteConfig.defaultConfig = {
      "last_geofences_updated_remotely_at": 0
    }
    await remoteConfig.fetchAndActivate()
    let last_geofences_updated_remotely_at = remoteConfig.getValue("last_geofences_updated_remotely_at")
    console.log("last_geofences_updated_remotely_at", last_geofences_updated_remotely_at)


    let last_geofences_updated_locally_at = localStorage.getItem("last_geofences_updated_remotely_at")

    console.log("last_geofences_updated_locally_at", last_geofences_updated_locally_at)

    var geoFences = []
    if (last_geofences_updated_remotely_at.asString() !== last_geofences_updated_locally_at) {
      localStorage.setItem("last_geofences_updated_remotely_at", last_geofences_updated_remotely_at.asString())
      geoFences = await this.firestore.get('geofences')
      geoFences = geoFences.docs.map(element => {
        let data = element.data()
        return {
          location: {
            lat: data.location.latitude,
            lng: data.location.longitude
          },
          radius: data.radius,
          name: data.name,
          locationCode: data.locationCode
        }
      })
      localStorage.setItem("geoFences", JSON.stringify(geoFences))
    } else {
      geoFences = localStorage.getItem("geoFences")
      geoFences = JSON.parse(geoFences)
    }

    var center = this.state.center
    if (this.props.pathCoordinates && this.props.pathCoordinates.length) {
      center = this.computeCenter(this.props.pathCoordinates)
    }
    this.setState({ geoFences: geoFences, center: center })

  }

  markerClick = (props, marker, e) => {
    this.setState({
      showInfoWindow: true,
      activeMarker: marker,
      selectedPlace: props
    })
  };

  computeCenter = (pathCoordinates) => {
    var length = pathCoordinates.length;
    var sum_lat = pathCoordinates.reduce((a, b) => a + b.lat || 0, 0);
    var sum_lng = pathCoordinates.reduce((a, b) => a + b.lng || 0, 0);

    return {
      lat: sum_lat / length,
      lng: sum_lng / length
    }
  }

  onBoundsChanged = (mapProps, map, event) => {
    // console.log('mapProps', mapProps)
    // console.log('map', map, map.getZoom())
    // console.log('event', event)
    this.map = map
    this.setState({ currentZoomLevel: map.getZoom() })
  }

  render() {
    var pathCoordinates = this.props.pathCoordinates

    var bounds = new this.props.google.maps.LatLngBounds();
    for (var i = 0; i < pathCoordinates.length; i++) {
      bounds.extend(pathCoordinates[i]);
    }

    // let geoFences = [
    //   {
    //     location: {
    //       lat: 25.4222489,
    //       lng: 81.8039853
    //     },
    //     radius: 500,
    //     name: "Khushrobagh",
    //     locationCode: "C0003"
    //   },
    //   {
    //     location: {
    //       lat: 25.4348839,
    //       lng: 81.8085343
    //     },
    //     radius: 200,
    //     name: "All Saints' Cathedral",
    //     locationCode: "C0004"
    //   },
    //   {
    //     location: {
    //       lat: 25.451831526,
    //       lng: 81.818996724
    //     },
    //     radius: 500,
    //     name: "Allahabad High Court",
    //     locationCode: "C0002"
    //   },
    //   {
    //     location: {
    //       lat: 25.4456,
    //       lng: 81.8302
    //     },
    //     radius: 1000,
    //     name: "Allahabad Railway Station",
    //     locationCode: "C0001"
    //   }
    // ]

    return (
      <div className={this.props.classes.chartContainer}>
        <h3>{pathCoordinates != null ? pathCoordinates.length : 0} data points present</h3><br />
        <h3>{this.props.haltsHistory != null ? this.props.haltsHistory.length : 0} halts present</h3>
        <Map
          google={this.props.google}
          // zoom={15}
          style={{ width: "100%", height: "100%", position: "relative" }}
          className={"map"}
          center={this.state.center}
          // bounds={bounds}
          initialCenter={this.initialCenter}
          maxZoom={18}
          minZoom={10}
          onBoundsChanged={this.onBoundsChanged}
        >
          {this.props.haltsHistory.map(halt => <Rectangle bounds={{
            north: halt.rectangle.maxLatitude, // 25.436956
            south: halt.rectangle.minLatitude, // 25.4287014
            east: halt.rectangle.maxLongitude, // 81.8229582
            west: halt.rectangle.minLongitude, // 81.81852
          }} onClick={() => alert(`${JSON.stringify(halt)}`)} />)}

          {this.state.geoFences.filter(geofence => {
            let p = new this.props.google.maps.LatLng(geofence.location.lat, geofence.location.lng)
            return this.map == null || this.map.getBounds().contains(p)
          }).map(geofence => <Circle
            key={geofence.locationCode}
            radius={geofence.radius * this.state.currentZoomLevel / 25}
            center={geofence.location}
            onClick={() => alert(`${geofence.name} (${geofence.locationCode}) \n Radius: ${geofence.radius} m \n ${JSON.stringify(geofence.location)}`)}
            strokeColor='transparent'
            strokeOpacity={0}
            strokeWeight={5}
            fillColor='#FF0000'
            fillOpacity={0.2}
          />)}

          {!isEmpty(pathCoordinates) &&
            pathCoordinates.map(pathCoordinate => (
              <Marker
                id={pathCoordinate.i - 1}
                key={pathCoordinate.i.toString()}
                location={pathCoordinate.location}
                title={pathCoordinate.i.toString()}
                activity={pathCoordinate.activity}
                accuracy={pathCoordinate.accuracy}
                timestamp={pathCoordinate.timestamp}
                position={{
                  lat: pathCoordinate.lat,
                  lng: pathCoordinate.lng
                }}
                // label={pathCoordinate.i.toString()}
                icon={{
                  path: this.props.google.maps.SymbolPath.CIRCLE,
                  scale: 1,
                  strokeColor: "red",
                  // anchor: new this.props.google.maps.Point(
                  //   pathCoordinate.lat,
                  //   pathCoordinate.lng
                  // ),
                  // scaledSize: new this.props.google.maps.Size(32, 32)
                }}
                // icon={{
                //   url: { in_vehicle: '/images/car.svg', walking: '/images/shoes.svg', still: '/images/standing.svg', running: '/images/running.svg' }[pathCoordinate.activity && pathCoordinate.activity.type],
                //   path: this.props.google.maps.SymbolPath,
                //   anchor: new this.props.google.maps.Point(
                //     pathCoordinate.lat,
                //     pathCoordinate.lng
                //   ),
                //   scaledSize: new this.props.google.maps.Size(32, 32)
                // }}
                // animation={this.props.google.maps.Animation.DROP}
                onClick={this.markerClick}
                onMouseover={this.markerClick}
              />
            ))}


          <InfoWindow marker={this.state.activeMarker} visible={this.state.showInfoWindow}>
            <div>
              <h3>{this.state.selectedPlace.title}</h3>
              <image src={{ in_vehicle: '/images/car.svg', walking: '/images/shoes.svg', still: '/images/standing.svg', running: '/images/running.svg' }[this.state.selectedPlace.activity && this.state.selectedPlace.activity.type]} height="30" width="30" />
              <br />
              <h4>Timestamp: {this.state.selectedPlace.timestamp}</h4>
              <h4>Accuracy: {this.state.selectedPlace.accuracy}</h4>
              {/* <h4>Activity Type: {this.state.selectedPlace.activity && this.state.selectedPlace.activity.type}</h4> */}
              <h4> <pre>{this.props.uid === "OS01" ? JSON.stringify(this.state.selectedPlace.location, undefined, 2) : ""}</pre></h4>
              <br />
            </div>
          </InfoWindow>

          <Polyline
            path={pathCoordinates}
            geodesic={true}
            onClick={function (e) { alert(e); }}
            options={{
              strokeColor: "#ff2527",
              strokeOpacity: 0.75,
              strokeWeight: 2,
              icons: [
                {
                  icon: this.lineSymbol,
                  offset: "100%",
                  repeat: "20px"
                }
              ]
            }}
          />

        </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: mapApiKey
})(withStyles(styles)(UserHistoricMap));