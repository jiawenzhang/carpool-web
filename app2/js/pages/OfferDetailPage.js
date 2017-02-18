import React from 'react'
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap'
import { connect } from 'react-redux'
import { isDriver } from '../actions/count'

import Parse from 'parse'
import ParseReact from 'parse-react'
const ParseComponent = ParseReact.Component(React)

class OfferDetailPage extends ParseComponent {

  observe() {
  }

  componentDidMount() {
    const offerId = this.props.location.query.id
    if (!offerId) {
      console.log("observing no offerId, return")
      return
    }

    const query = new Parse.Query('DriverOffer');
    console.log("observing offerId: " + offerId);
    this.offerData = {};

    query.get(offerId).then(offer => {
      offer && console.log(offer.toJSON());
      this.offer = offer
      this.offerData.startTime = offer.get("startTime")

      const query = new Parse.Query(Parse.User);
      const user_id = offer.get("userId")
      return query.get(user_id)
    }).then(user => {
      console.log("got user " + JSON.stringify(user));
      this.offerData.name = user.get("name");

      const query = new Parse.Query("Location")
      const originId = this.offer.get("originId")
      console.log("getting originId: " + originId)
      return query.get(originId)
    }).then(origin => {
      console.log("got origin " + JSON.stringify(origin));
      this.offerData.originLabel = origin.get("label")

      const query = new Parse.Query("Location")
      const destId = this.offer.get("destId")
      console.log("getting destId: " + destId)
      return query.get(destId)
    }).then(dest => {
      console.log("got dest " + JSON.stringify(dest));
      this.offerData.destLabel = dest.get("label")

      console.log("offerData: " + JSON.stringify(this.offerData));
      this.setState({data: this.offerData});
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
        return (
        <div style={{paddingBottom: 20 }}>
          <div style={titleStyle}>
            {"Time:"}
          </div>
          <div style={msgStyle}>
            {this.props.time}
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

    const CustomComponent = React.createClass({
      render() {
        console.log("this.props " + this.props)
        return (
          <li
            className="list-group-item"
            onClick={() => {}}>
            <TimeComponent
              time={this.props.time}>
            </TimeComponent>
            <LocationComponent
              prefix="From:"
              location={this.props.from}>
            </LocationComponent>
            <LocationComponent
              prefix="To:"
              location={this.props.to}>
            </LocationComponent>
            <FieldComponent
              title={"Contact:"}
              message={this.props.contact}>
            </FieldComponent>
            <FieldComponent
              title={"Note:"}
              message={"Please be on time"}>
            </FieldComponent>
          </li>
        );
      }
    });

          // <CustomComponent
          //   time = "Jan 17, 12:00"
          //   from="148 Roywood, Dr. Toronto ON"
          //   to="1445, Whatever location, London ON"
          //   contact="Mr. Lv, 647-262-3141">
          // </CustomComponent>
    return (
      <div style={{maxWidth: 800, width: "80%", margin: "0 auto 10px"}}>
        <div className="col-xs-12" style={{marginTop:20, marginBottom: 20, fontSize: 26, textAlign: "center"}}>
          Offer Ride
        </div>
        <TimeComponent
          time={this.state.data.startTime.toLocaleDateString("en-US")}>
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
          message={this.state.data.name}>
        </FieldComponent>
        <FieldComponent
          title={"Note:"}
          message={"Please be on time"}>
        </FieldComponent>
      </div>
    );
  }
}

OfferDetailPage.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default OfferDetailPage
