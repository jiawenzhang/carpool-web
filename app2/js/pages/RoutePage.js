/* global google */
import _ from "lodash";
import { Button } from 'react-bootstrap'
import { default as React, Component, } from "react";
import Geosuggest from 'react-geosuggest';
import { connect } from 'react-redux'

import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer
} from "react-google-maps";

import Parse from 'parse'

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
    // this.context.router.push('/match')
    //
    // return

    let {isDriver, startTime, endTime} = this.props;
    console.log("route ok");
    console.log("isDriver: " + isDriver)
    console.log("startTime: " + startTime)
    console.log("endTime: " + endTime)
    console.log("origin: " + this.state.origin)
    console.log("destination: " + this.state.destination)

    var offer;
    if (isDriver) {
      var DriverOffer = Parse.Object.extend("DriverOffer");
      offer = new DriverOffer();
    } else {
      var RiderOffer = Parse.Object.extend("RiderOffer");
      offer = new RiderOffer();
    }

    offer.set("userId", Parse.User.current().id)
    offer.set("startTime", startTime.toDate());
    offer.set("endTime", endTime.toDate());

    offer.save().then((offer) => {
        console.log('New offer created with objectId: ' + offer.id);

        var Location = Parse.Object.extend("Location");
        var originLocation = new Location();
        var originGeoPoint = new Parse.GeoPoint({latitude: this.state.origin.lat(), longitude: this.state.origin.lng()});
        originLocation.set("geo", originGeoPoint);
        originLocation.set("for", isDriver ? "driver" : "rider");
        originLocation.set("type", "origin");
        originLocation.set("offer_id", offer.id);
        return originLocation.save();
      }).then((originLocation) => {
        console.log('New originLocation created with objectId: ' + originLocation.id);

        var Location = Parse.Object.extend("Location");
        var destLocation = new Location();
        var destGeoPoint = new Parse.GeoPoint({latitude: this.state.destination.lat(), longitude: this.state.destination.lng()});
        destLocation.set("geo", destGeoPoint);
        destLocation.set("for", isDriver ? "driver" : "rider");
        originLocation.set("type", "dest");
        destLocation.set("offer_id", offer.id);
        return destLocation.save();
      }).then((destLocation) => {
        console.log('New destLocation created with objectId: ' + destLocation.id);
      }, (error) => {
        console.log('Failed to create new offer, with error code: ' + error.message);
      });
  }

  render() {
    return (
      <div style={{maxWidth: 800, width: "80%", height: "100%", margin: "0 auto 10px"}}>
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

      <div className="col-xs-12" style={{height: 5}}>
      </div>

        <DirectionsExampleGoogleMap
          containerElement={
            <div style={{ height: `50%` }} />
          }
          mapElement={
            <div style={{ width: "100%", height: `100%`, margin: "0 auto" }} />
          }
          center={this.state.origin}
          directions={this.state.directions}
        />

      <div className="col-xs-12" style={{height: 30}}>
      </div>

      <div style={{margin: "0 auto"}}>
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

RoutePage.contextTypes = {
  router: React.PropTypes.func.isRequired
};


export default connect(
  state => (
  { isDriver: state.count.isDriver,
    startTime: state.count.startTime,
    endTime: state.count.endTime}),
)(RoutePage)
