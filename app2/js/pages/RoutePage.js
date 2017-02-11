/* global google */
import _ from "lodash";
import { Button } from 'react-bootstrap'

import {
  default as React,
  Component,
} from "react";

import Geosuggest from 'react-geosuggest';
import { connect } from 'react-redux'

import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer
} from "react-google-maps";

const DirectionsExampleGoogleMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={7}
    defaultCenter={props.center}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
));

class RoutePage extends Component {

  state = {
    origin: new google.maps.LatLng(41.8507300, -87.6512600),
    destination: new google.maps.LatLng(41.8525800, -87.6514100),
    directions: null,
  };

  constructor(props) {
    super(props);

    this.isDriver = this.props.location.query.isDriver;
    console.log("driver: " + this.isDriver)
  }

  onStartLocationSelect = (place) => {
    console.log("start place" + JSON.stringify(place, null, 2))
    const startLatLng = new google.maps.LatLng(place.location.lat, place.location.lng)
    this.setState({
      origin: startLatLng
    });

    this.updateRoute()
  }

  onDestinationSelect = (place) => {
    console.log("destination" + JSON.stringify(place, null, 2))
    const destinationLatLng = new google.maps.LatLng(place.location.lat, place.location.lng)
    this.setState({
      destination: destinationLatLng
    });

    this.updateRoute()
  }

  componentDidMount() {
  }

  updateRoute() {
    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route({
      origin: this.state.origin,
      destination: this.state.destination,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.setState({
          directions: result,
        });
      } else {
        console.error(`error fetching directions ${result}`);
      }
    });
  }

  ok = () => {
    let {isDriver, startTime, endTime} = this.props;
    console.log("route ok");
    console.log("isDriver: " + isDriver)
    console.log("startTime: " + startTime)
    console.log("endTime: " + endTime)
    console.log("origin: " + this.state.origin)
    console.log("destination: " + this.state.origin)
  }

  render() {
    return (
      <div style={{height: `100%`}}>
        <Geosuggest
          ref={el=>this._geoSuggest=el}
          placeholder="Start location"
          onSuggestSelect={this.onStartLocationSelect}
          location={new google.maps.LatLng(53.558572, 9.9278215)}
          radius="20"
        />
        <Geosuggest
          ref={el=>this._geoSuggest=el}
          placeholder="Destination"
          onSuggestSelect={this.onDestinationSelect}
          location={new google.maps.LatLng(53.558572, 9.9278215)}
          radius="20"
        />
        <DirectionsExampleGoogleMap
          containerElement={
            <div style={{ height: `50%` }} />
          }
          mapElement={
            <div style={{ width: "80%", height: `100%`, margin: "0 auto" }} />
          }
          center={this.state.origin}
          directions={this.state.directions}
        />

      <div className="col-xs-12" style={{height: 20}}>
      </div>

      <div className="col-xs-12">
        <Button
          bsSize="large"
          onClick={this.ok}
          block>
          OK
        </Button>
      </div>
      </div>
    );
  }
}

export default connect(
  state => (
  { isDriver: state.count.isDriver,
    startTime: state.count.startTime,
    endTime: state.count.endTime}),
)(RoutePage)
