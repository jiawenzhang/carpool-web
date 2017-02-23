/* global google */
import _ from "lodash";
import { Button } from 'react-bootstrap'
import { default as React, Component, } from "react";
import Geosuggest from 'react-geosuggest';
import { connect } from 'react-redux'
import { setOriginLocation, setDestLocation} from '../actions/count'

import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer
} from "react-google-maps";

import Parse from 'parse'

const DirectionsGoogleMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={7}
    defaultCenter={props.center}>
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
));

class RoutePage extends Component {

  state = {
    originGeo: null,
    destGeo: null,
    directions: null,
  };

  constructor(props) {
    super(props);
  }

  onStartLocationSelect = (place) => {
    //console.log("start place" + JSON.stringify(place, null, 2))
    const startLatLng = new google.maps.LatLng(place.location.lat, place.location.lng)
    let locality = this.getLocality(place)

    this.setState({
      originPlaceId: place.placeId,
      originGeo: startLatLng,
      originLabel: place.label,
      originLocality: locality,
    });

    this.updateRoute()
  }

  onDestinationSelect = (place) => {
    //console.log("destPlace" + JSON.stringify(place, null, 2))
    const destinationLatLng = new google.maps.LatLng(place.location.lat, place.location.lng)
    let locality = this.getLocality(place)
    this.setState({
      destPlaceId: place.placeId,
      destGeo: destinationLatLng,
      destLabel: place.label,
      destLocality: locality
    });

    this.updateRoute()
  }

  updateRoute() {
    if (!this.state.originGeo || !this.state.destGeo) {
      return;
    }

    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route({
      origin: this.state.originGeo,
      destination: this.state.destGeo,
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

  next = () => {
    let {setOriginLocation, setDestLocation} = this.props;
    setOriginLocation({
      placeId: this.state.originPlaceId,
      geo: this.state.originGeo,
      locality: this.state.originLocality,
      label: this.state.originLabel
    })
    setDestLocation({
      placeId: this.state.destPlaceId,
      geo: this.state.destGeo,
      locality: this.state.destLocality,
      label: this.state.destLabel,
    })

    this.context.router.push('/note')

    return

    let {isDriver, startTime, endTime} = this.props;
    console.log("route ok");
    console.log("isDriver: " + isDriver)
    console.log("startTime: " + startTime)
    console.log("endTime: " + endTime)
    console.log("originGeo: " + this.state.originGeo)
    console.log("originLabel: " + this.state.originLabel)
    console.log("destLabel: " + this.state.destLabel)
    console.log("destGeo: " + this.state.destGeo)

    this.offer;
    if (isDriver) {
      var DriverOffer = Parse.Object.extend("DriverOffer");
      this.offer = new DriverOffer();
    } else {
      var RiderOffer = Parse.Object.extend("RiderOffer");
      this.offer = new RiderOffer();
    }

    this.offer.set("userId", Parse.User.current().id)
    this.offer.set("startTime", startTime.toDate());
    this.offer.set("endTime", endTime.toDate());

    var Location = Parse.Object.extend("Location");
    this.originLocation = new Location();
    this.offer.save().then((offer) => {
        console.log('New offer created with objectId: ' + offer.id);
        this.offer = offer;

        var originGeoPoint = new Parse.GeoPoint({latitude: this.state.originGeo.lat(), longitude: this.state.originGeo.lng()});
        this.originLocation.set("placeId", this.state.originPlaceId)
        this.originLocation.set("geo", originGeoPoint);
        this.originLocation.set("locality", this.state.originLocality)
        this.originLocation.set("label", this.state.originLabel);
        this.originLocation.set("for", isDriver ? "driver" : "rider");
        this.originLocation.set("type", "origin");
        this.originLocation.set("offerId", offer.id);
        return this.originLocation.save();
      }).then((originLocation) => {
        console.log('New originLocation created with objectId: ' + originLocation.id);
        this.originLocation = originLocation

        var Location = Parse.Object.extend("Location");
        var destLocation = new Location();
        var destGeoPoint = new Parse.GeoPoint({latitude: this.state.destGeo.lat(), longitude: this.state.destGeo.lng()});
        destLocation.set("geo", destGeoPoint);
        destLocation.set("placeId", this.state.destPlaceId)
        destLocation.set("label", this.state.destLabel)
        destLocation.set("locality", this.state.destLocality)
        destLocation.set("for", isDriver ? "driver" : "rider");
        destLocation.set("type", "dest");
        destLocation.set("offerId", this.offer.id);
        return destLocation.save();
      }).then((destLocation) => {
        console.log('New destLocation created with id: ' + destLocation.id);

        this.offer.set("originId", this.originLocation.id)
        this.offer.set("destId", destLocation.id)
        //console.log("offer " + JSON.stringify(this.offer))
        return this.offer.save()
      }).then((offer) => {
        console.log('offer updated with objectId: ' + offer.id);
        this.context.router.replace({ pathname: '/offer', query: { id : offer.id}})
      }, (error) => {
        console.log('Failed to create new offer, with error code: ' + error.message);
      });
  }

  getLocality = (place) => {
    for (let component of place.gmaps.address_components) {
      if (component.types.indexOf('locality') > -1) {
        console.log("locality " + component.long_name)
        return component.long_name
      }
    }
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

      {this.state.originGeo &&
      <DirectionsGoogleMap
        containerElement={
          <div style={{ height: `50%` }} />
        }
        mapElement={
          <div style={{ width: "100%", height: `100%`, margin: "0 auto" }} />
        }
        center={this.state.originGeo}
        directions={this.state.directions}
      />}

      <div className="col-xs-12" style={{height: 30}}>
      </div>

      {this.state.originGeo && this.state.destGeo &&
      <div style={{margin: "0 auto"}}>
        <Button
          bsSize="large"
          onClick={this.next}
          block>
          Next
        </Button>
      </div>}
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
  {
    setOriginLocation,
    setDestLocation,
  }
)(RoutePage)
