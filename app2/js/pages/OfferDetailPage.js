import React from 'react'
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap'

import Parse from 'parse'
import ParseReact from 'parse-react'
const ParseComponent = ParseReact.Component(React)
import moment from 'moment';
import Helmet from "react-helmet"

class OfferDetailPage extends ParseComponent {
  observe() {
  }

  componentDidMount() {
    let offerId = this.props.location.query.id
    this.isDriver = this.props.location.query.driver
    if (!offerId) {
      console.log("observing no offerId, return")
      return
    }

    console.log("isDriver " + this.isDriver)

    var query
    if (this.isDriver === "true") {
      console.log("getting Driver Offer offerId: " + offerId);
      query = new Parse.Query('DriverOffer');
    } else {
      console.log("getting Rider Offer offerId: " + offerId);
      query = new Parse.Query('RiderOffer');
    }

    this.offerData = {};

    query.get(offerId).then(offer => {
      offer && console.log(offer.toJSON());
      this.offer = offer
      let startTime = moment(offer.get("startTime"))
      let endTime = moment(offer.get("endTime"))
      console.log("startTime ", startTime.format('lll'))
      console.log("endTime ", endTime.format('lll'))
      this.offerData.timeDiff = endTime.diff(startTime, 'minutes');
      this.offerData.time = startTime.add(this.offerData.timeDiff/2, 'minutes');
      this.offerData.note = offer.get("note")

      const query = new Parse.Query(Parse.User);
      const user_id = offer.get("userId")
      return query.get(user_id)
    }).then(user => {
      console.log("got user " + JSON.stringify(user));
      this.offerData.name = user.get("name");
      this.offerData.email = user.get("email");

      const query = new Parse.Query("Location")
      const originId = this.offer.get("originId")
      console.log("getting originId: " + originId)
      return query.get(originId)
    }).then(origin => {
      console.log("got origin " + JSON.stringify(origin));
      this.offerData.originLabel = origin.get("label")
      this.offerData.originPlaceId = origin.get("placeId")
      this.offerData.originLocality = origin.get("locality")

      const query = new Parse.Query("Location")
      const destId = this.offer.get("destId")
      console.log("getting destId: " + destId)
      return query.get(destId)
    }).then(dest => {
      console.log("got dest " + JSON.stringify(dest));
      this.offerData.destLabel = dest.get("label")
      this.offerData.destPlaceId = dest.get("placeId")
      this.offerData.destLocality = dest.get("locality")

      console.log("offerData: " + JSON.stringify(this.offerData));
      const time = moment(this.offerData.time).format("ddd H:MM")
      var route = " " + this.offerData.originLabel + " to " + this.offerData.destLabel
      if (route.length > 35) {
        route = " " + this.offerData.originLocality + " to " + this.offerData.destLocality
      }
      console.log("route: " + route)
      const title = time + " " + route;
      this.setState(
        { data: this.offerData,
          title: title
        });
    }, (error) => {
      console.log('Failed to query offer, with error code: ' + error.message);
    });
  }

  constructor(props) {
    super(props)
  }

  fromClick = () => {
    console.log("fromClick")
  }

  render() {
    //console.log("got offer: " + JSON.stringify(this.data.offer));
    if (!this.state || !this.state.data) {
      return null
    }

    console.log("got data: " + JSON.stringify(this.state.data));

    //borderStyle: "solid", borderWidth: 2
    const titleStyle = {fontSize: 14, color: "grey"}
    const msgStyle = {fontSize: 16}
    const TimeComponent = React.createClass({
      render() {
        var diffStr;
        if (this.props.timeDiff == 0) {
          diffStr = "On time"
        } else {
          diffStr = "flexible by " + this.props.timeDiff + " minutes";
        }
        return (
        <div style={{paddingBottom: 20 }}>
          <div style={titleStyle}>
            {"Time:"}
          </div>
          <div style={msgStyle}>
            {this.props.time.format("ddd MMM Do H:MM")}
          </div>
          <div style={msgStyle}>
            {diffStr}
          </div>
        </div>
        );
      }
    });

    const LocationComponent = React.createClass({
      render() {
        return (
        <div style={{paddingBottom: 20}}
          onClick={this.props.onClick}>
          <div style={titleStyle}>
            {this.props.prefix}
          </div>
          <div style={msgStyle}>
            {this.props.location}
          </div>
        </div>
        );
      }
    });

    const FieldComponent = React.createClass({
      render() {
        return (
        <div style={{paddingBottom: 20}}
          onClick={this.props.onClick}>
          <div style={titleStyle}>
            {this.props.title}
          </div>
          <div style={msgStyle}>
            {this.props.message}
          </div>

        </div>
        );
      }
    });

    return (
      <div style={{maxWidth: 800, width: "80%", margin: "0 auto 10px"}}>
        <Helmet title={this.state.title}/>
        <div className="col-xs-12" style={{marginTop:50, marginBottom: 20, fontSize: 26, textAlign: "center"}}>
          {this.isDriver === "true" ? "Offer Ride" : "Request Ride"}
        </div>
        <TimeComponent
          time={this.state.data.time}
          timeDiff={this.state.data.timeDiff}>
        </TimeComponent>
        <LocationComponent
          prefix="From:"
          location={this.state.data.originLabel}
          onClick={this.fromClick}>
        </LocationComponent>
        <LocationComponent
          prefix="To:"
          location={this.state.data.destLabel}>
        </LocationComponent>
        <FieldComponent
          title={"Contact:"}
          message={this.state.data.name + (this.state.data.email ? ", email: " + this.state.data.email : "")}>
        </FieldComponent>
        {this.state.data.note &&
          <FieldComponent
            title={"Note:"}
            message={this.state.data.note}>
          </FieldComponent>
        }
      </div>
    );
  }
}

OfferDetailPage.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default OfferDetailPage
