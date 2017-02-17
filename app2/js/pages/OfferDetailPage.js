import React from 'react'
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap'
import { connect } from 'react-redux'
import { isDriver } from '../actions/count'

class OfferDetailPage extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const TimeComponent = React.createClass({
      render() {
        return (
        <div style={{paddingBottom: 20}}>
          <div style={{fontSize: 14}}>
            {"Time:"}
          </div>
          <div style={{fontSize: 16}}>
            {this.props.time}
          </div>
        </div>
        );
      }
    });

    const LocationComponent = React.createClass({
      render() {
        return (
        <div style={{paddingBottom: 20}}>
          <div style={{fontSize: 14}}>
            {this.props.prefix}
          </div>
          <div style={{fontSize: 16}}>
            {this.props.location}
          </div>
        </div>
        );
      }
    });

    const FieldComponent = React.createClass({
      render() {
        return (
        <div style={{paddingBottom: 20}}>
          <div style={{fontSize: 14}}>
            {this.props.title}
          </div>
          <div style={{fontSize: 16}}>
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
          location={"148 Roywood, Dr. Toronto ON"}>
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
