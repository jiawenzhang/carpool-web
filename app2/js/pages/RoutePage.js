/* global google */
import _ from "lodash";
import { default as React, Component, } from "react";
import Geosuggest from 'react-geosuggest';
import { connect } from 'react-redux'
import { setOriginLocation, setDestLocation} from '../actions/count'

import {
  Button
} from 'react-weui';

//import weui styles
import 'weui';
import 'react-weui/lib/react-weui.min.css';

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

  constructor(props) {
    super(props);

    let {originLocation, destLocation} = this.props;
    var startLatLng = null
    var destLatLng = null
    var originLabel = ""
    var destLabel = ""
    if (originLocation) {
      console.log("originLocation " + JSON.stringify(originLocation))
      startLatLng = new google.maps.LatLng(originLocation.geo.lat(), originLocation.geo.lng())
      originLabel = originLocation.label
    }
    if (destLocation) {
      console.log("destLocation " + JSON.stringify(destLocation))
      destLatLng = new google.maps.LatLng(destLocation.geo.lat(), destLocation.geo.lng())
      destLabel = destLocation.label
    }

    console.log("originLabel " + originLabel)
    console.log("destLabel " + destLabel)

    this.state = {
      originGeo: startLatLng,
      destGeo: destLatLng,
      originLabel: originLabel,
      destLabel: destLabel,
      directions: null
    }
  }

  componentDidMount() {
    this.updateRoute()
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
    console.log("updateRoute ")
    console.log("originGeo " + this.state.originGeo)
    console.log("destGeo " + this.state.destGeo)
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
        this.setState({
          directions: null,
        });
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
      label: this.state.destLabel
    })

    this.context.router.push('/note')
  }

  getLocality = (place) => {
    for (let component of place.gmaps.address_components) {
      if (component.types.indexOf('locality') > -1) {
        console.log("locality " + component.long_name)
        return component.long_name
      }
    }
  }

  renderError(msg) {
    return (
      <div style={{color: "red", fontSize: 16, textAlign: "center"}}>
        {msg}
      </div>
    )
  }

  render() {
    if (!Parse.User.current()) {
      return;
    }

    return (
      <div style={{maxWidth: 800, width: "100%", height: "100%", margin: "0 auto 10px", paddingTop: 30, paddingLeft: 20, paddingRight: 20, backgroundColor: "whitesmoke"}}>
        <Geosuggest
          ref={el=>this._geoSuggest=el}
          placeholder="Start location"
          initialValue={this.state.originLabel}
          onSuggestSelect={this.onStartLocationSelect}
          location={new google.maps.LatLng(53.558572, 9.9278215)}
          radius="20"
        />

        <Geosuggest
          ref={el=>this._geoSuggest=el}
          placeholder="Destination"
          initialValue={this.state.destLabel}
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

      {this.state.originGeo && this.state.destGeo && this.state.directions &&
      <div style={{margin: "0 auto"}}>
        <Button
          type="primary"
          onClick={this.next}>
          Next
        </Button>
      </div>}
      {this.state.originGeo && this.state.destGeo && !this.state.directions &&
        this.renderError("Please select a valid route")}
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
    originLocation: state.count.originLocation,
    destLocation: state.count.destLocation,
    startTime: state.count.startTime,
    endTime: state.count.endTime}),
  {
    setOriginLocation,
    setDestLocation,
  }
)(RoutePage)
