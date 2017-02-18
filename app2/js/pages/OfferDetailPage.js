import React from 'react'
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap'
import { connect } from 'react-redux'
import { isDriver } from '../actions/count'

import Parse from 'parse'
import ParseReact from 'parse-react'
const ParseComponent = ParseReact.Component(React)

class OfferDetailPage extends ParseComponent {

  observe() {
    const offer_id = this.props.location.query.id
    if (!offer_id) {
      console.log("observing no offer_id, return")
      return
    }

    const query = new Parse.Query('DriverOffer');
    console.log("observing offer_id: " + offer_id);
    query.get(offer_id).then(offer => {
      offer && console.log(offer.toJSON());
    });

    return {
      offer: query
    };
  }

  constructor(props) {
    super(props)
  }

  fromClick = () => {
    console.log("fromClick")
  }

  render() {
    console.log("offer_id: " + JSON.stringify(this.props.location.query.id));
    console.log("got offer: " + JSON.stringify(this.data.offer));

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
          time={"Jan 17, 12:00"}>
        </TimeComponent>
        <LocationComponent
          prefix="From:"
          location={"148 Roywood, Dr. Toronto ON"}
          onClick={this.fromClick}>
        </LocationComponent>
        <LocationComponent
          prefix="To:"
          location={"1445, Whatever location, London ON"}>
        </LocationComponent>
        <FieldComponent
          title={"Contact:"}
          message={"Mr. Lv, 647-262-3141"}>
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
