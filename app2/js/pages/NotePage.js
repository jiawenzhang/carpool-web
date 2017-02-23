import React from 'react'
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import { connect } from 'react-redux'
import { isDriver } from '../actions/count'
import Parse from 'parse'

class NotePage extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  noteChange = (e) => {
    //console.log("note change " + e.target.value)
    this.note = e.target.value;
  }

  render() {
    return (
      <div style={{maxWidth: 800, width: "80%", margin: "0 auto 10px"}}>
        <div className="col-xs-12" style={{marginTop:50, marginBottom: 50, fontSize: 26, textAlign: "center"}}>
            Leave a note
        </div>

        <FormGroup controlId="formControlsTextarea">
          <ControlLabel></ControlLabel>
          <FormControl
            componentClass="textarea"
            placeholder="Max 200 characters"
            maxLength="200"
            onChange={this.noteChange}
            style={{height: 100, maxHeight:100}}
          />
        </FormGroup>

        <div style={{margin: "0 auto"}}>
          <Button
            bsSize="large"
            onClick={this.nextClick.bind(this)}
            block>
            Next
          </Button>
        </div>

        <div className="col-xs-12" style={{height: 20}}>
        </div>

      </div>
    );
  }

  nextClick() {
    console.log("next click")
    console.log("note: " + this.note);
    let {isDriver, startTime, endTime, originLocation, destLocation} = this.props;

    console.log("isDriver: " + isDriver)
    console.log("startTime: " + startTime)
    console.log("endTime: " + endTime)
    console.log("origin: " + JSON.stringify(originLocation));
    console.log("dest: " + JSON.stringify(destLocation));

    this.destLocation = destLocation;

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
    this.offer.set("note", this.note);

    var Location = Parse.Object.extend("Location");
    this.origin = new Location();
    this.offer.save().then((offer) => {
        console.log('New offer created with objectId: ' + offer.id);
        this.offer = offer;

        var originGeoPoint = new Parse.GeoPoint({latitude: originLocation.geo.lat(), longitude: originLocation.geo.lng()});
        this.origin.set("placeId", originLocation.placeId)
        this.origin.set("geo", originGeoPoint);
        this.origin.set("locality", originLocation.locality)
        this.origin.set("label", originLocation.label);
        this.origin.set("for", isDriver ? "driver" : "rider");
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
        dest.set("for", isDriver ? "driver" : "rider");
        dest.set("type", "dest");
        dest.set("offerId", this.offer.id);
        return dest.save();
      }).then((dest) => {
        console.log('New destcreated with id: ' + dest.id);

        this.offer.set("originId", this.origin.id)
        this.offer.set("destId", dest.id)
        //console.log("offer " + JSON.stringify(this.offer))
        return this.offer.save()
      }).then((offer) => {
        console.log('offer updated with objectId: ' + offer.id);
        this.context.router.replace({ pathname: '/offer', query: { id : offer.id}})
      }, (error) => {
        console.log('Failed to create new offer, with error code: ' + error.message);
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
    }),
  {}
)(NotePage)
