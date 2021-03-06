import React from 'react'
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import { connect } from 'react-redux'
import { setIsDriver, setLastPage, setNewOfferId } from '../actions/count'
import Parse from 'parse'

import {
  Toast,
  Button,
  CellsTitle,
  CellHeader,
  CellBody,
  Label,
  Input,
  Form,
  FormCell,
  TextArea,
} from 'react-weui';

//import weui styles
import 'weui';
import 'react-weui/lib/react-weui.min.css';

class NotePage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  noteChange = (e) => {
    this.note = e.target.value;
  }

  contactChange = (e) => {
    this.contact = e.target.value;
  }

  priceChange = (e) => {
    this.price = parseFloat(e.target.value, 10);
    console.log("price " + this.price);
  }

  render() {
    if (!Parse.User.current()) {
      return;
    }

    var {isDriver} = this.props;
    var toWho = isDriver ? "rider" : "driver";

    return (
      <div style={{maxWidth: 800, width: "100%", height: "100%", backgroundColor: "whitesmoke"}}>
        <Toast
          icon="loading"
          show={this.state.loading}>
          Creating...
        </Toast>

        <div style={{paddingTop:60, paddingBottom: 0}}>
              <Form>
                <FormCell>
                   <CellHeader>
                       <Label>Price $</Label>
                   </CellHeader>
                   <CellBody>
                       <Input
                         type="number"
                         placeholder="Enter price"
                         onChange={this.priceChange}>
                       </Input>
                   </CellBody>
               </FormCell>
             </Form>

             <Form>
                <FormCell>
                  <CellBody>
                    <TextArea
                      placeholder={"How can " + toWho + " contact you?"}
                      rows="2"
                      maxlength="100"
                      onChange={this.contactChange}>
                    </TextArea>
                  </CellBody>
                </FormCell>
              </Form>

             <Form>
                <FormCell>
                  <CellBody>
                    <TextArea
                      placeholder={"Additional message to " + toWho}
                      rows="4"
                      maxlength="200"
                      onChange={this.noteChange}>
                    </TextArea>
                  </CellBody>
                </FormCell>
              </Form>

        </div>

        <div style={{paddingTop: 30, paddingLeft: 20, paddingRight: 20}}>
          <Button
            type="primary"
            onClick={this.nextClick.bind(this)}>
            Next
          </Button>
        </div>
      </div>
    );
  }

  nextClick() {
    this.setState({
      loading: true
    });
    console.log("next click")
    console.log("note: " + this.note);
    console.log("contact: " + this.contact);
    var {isDriver, startTime, endTime, originLocation, destLocation} = this.props;
    this.isDriver = isDriver;

    console.log("isDriver: " + isDriver)
    console.log("startTime: " + startTime)
    console.log("endTime: " + endTime)
    console.log("origin: " + JSON.stringify(originLocation));
    console.log("dest: " + JSON.stringify(destLocation));

    this.destLocation = destLocation;

    if (isDriver) {
      console.log("Saving DriverOffer")
      var DriverOffer = Parse.Object.extend("DriverOffer");
      this.offer = new DriverOffer();
    } else {
      console.log("Saving RiderOffer")
      var RiderOffer = Parse.Object.extend("RiderOffer");
      this.offer = new RiderOffer();
    }

    this.offer.set("userId", Parse.User.current().id)
    this.offer.set("startTime", startTime.toDate());
    this.offer.set("endTime", endTime.toDate());
    this.offer.set("contact", this.contact);
    this.offer.set("note", this.note);
    if (this.price && !isNaN(this.price)) {
      this.offer.set("price", this.price);
    }

    var Location = Parse.Object.extend("Location");
    this.origin = new Location();
    this.offer.save().then((offer) => {
        console.log('New offer created with objectId: ' + offer.id);
        this.offer = offer;

        var originGeoPoint = new Parse.GeoPoint({latitude: originLocation.geo.lat(), longitude: originLocation.geo.lng()});
        this.origin.set("placeId", originLocation.placeId)
        this.origin.set("geo", originGeoPoint);
        this.origin.set("locality", originLocation.locality)
        this.origin.set("state", originLocation.state)
        this.origin.set("country", originLocation.country)
        this.origin.set("label", originLocation.label);
        this.origin.set("for", this.isDriver ? "driver" : "rider");
        this.origin.set("type", "origin");
        this.origin.set("offerId", offer.id);
        return this.origin.save();
      }).then((origin) => {
        console.log('New origin created with objectId: ' + origin.id);
        this.origin = origin

        var Location = Parse.Object.extend("Location");
        var dest = new Location();
        var destGeoPoint = new Parse.GeoPoint({latitude: this.destLocation.geo.lat(), longitude: this.destLocation.geo.lng()});
        dest.set("geo", destGeoPoint);
        dest.set("placeId", this.destLocation.placeId)
        dest.set("label", this.destLocation.label)
        dest.set("locality", this.destLocation.locality)
        dest.set("state", this.destLocation.state)
        dest.set("country", this.destLocation.country)
        dest.set("for", this.isDriver ? "driver" : "rider");
        dest.set("type", "dest");
        dest.set("offerId", this.offer.id);
        return dest.save();
      }).then((dest) => {
        console.log('New dest created with id: ' + dest.id);

        this.offer.set("originId", this.origin.id)
        this.offer.set("destId", dest.id)
        //console.log("offer " + JSON.stringify(this.offer))
        return this.offer.save()
      }).then((offer) => {
        console.log('offer updated with objectId: ' + offer.id);
        var {setLastPage, setNewOfferId} = this.props;
        setLastPage("note");
        setNewOfferId(offer.id);
        // go back to the driverrider page, which will show the offer detail page
        this.context.router.go(-3);
      }, (error) => {
        console.log('Failed to create new offer, with error code: ' + error.message);
        this.setState({
          loading: false
        });
      });
  }
}

NotePage.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default connect(
  state => (
  { number: state.count.number,
    isDriver: state.count.isDriver,
    startTime: state.count.startTime,
    endTime: state.count.endTime,
    originLocation: state.count.originLocation,
    destLocation: state.count.destLocation,
    lastPage: state.count.lastPage,
    }),
  { setIsDriver,
    setLastPage,
    setNewOfferId}
)(NotePage)
