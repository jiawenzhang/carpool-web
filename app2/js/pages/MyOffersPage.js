import React from 'react'
import Parse from 'parse'
import { connect } from 'react-redux'
import { isDriver } from '../actions/count'
import moment from 'moment';
import {
    Panel,
    PanelHeader,
    PanelBody,
    MediaBox,
    MediaBoxBody,
    MediaBoxTitle,
    MediaBoxDescription,
} from 'react-weui';

//import weui styles
import 'weui';
import 'react-weui/lib/react-weui.min.css';

class MyOffersPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      riderOffers: [],
      driverOffers: []
    }
  }

  fetchOffers = (objectName, callback) => {
    var offerJSONs = [];
    var queryOffer = new Parse.Query(objectName);
    queryOffer.equalTo("userId", Parse.User.current().id);
    queryOffer.notEqualTo("cancelled", true);
    var results =[];
    queryOffer.find().then(offerObjects => {
      if (!offerObjects || offerObjects.length == 0) {
        callback(null, []);
        return;
      }

      for (var i=0; i<offerObjects.length; i++) {
        //console.log(offers[i].toJSON());
        offerJSONs.push(offerObjects[i].toJSON());
      }

      var promise = Parse.Promise.as();
      offerJSONs.forEach(function(offerJSON) {
        promise = promise.then(function() {
          const query = new Parse.Query("Location")
          const originId = offerJSON.originId;
          console.log("getting originId: " + originId)
          // Return a promise that will be resolved when the delete is finished.
          return query.get(originId).then(origin => {
            offerJSON["originLabel"] = origin.get("label")
            offerJSON["originPlaceId"] = origin.get("placeId")
            offerJSON["originLocality"] = origin.get("locality")
            const query = new Parse.Query("Location")
            const destId = offerJSON.destId;
            console.log("getting destId: " + destId)
            return query.get(destId)
          }).then(dest => {
            offerJSON["destLabel"] = dest.get("label");
            offerJSON["destPlaceId"] = dest.get("placeId");
            offerJSON["destLocality"] = dest.get("locality");
            results.push(offerJSON);
          }, (error) => {
          });
        });
      });
      return promise;
  }).then(() => {
    // Every geo was retrieved
    console.log("results length " + results.length);
    for (var i=0; i<results.length; i++) {
      console.log("result: " + JSON.stringify(results[i]));
    }
    callback(null, results);
  }, (error) => {
    console.log('Failed to query rider offer, with error code: ' + error.message);
    callback(error.message, null);
  });
}

  componentDidMount() {
    this.fetchOffers("RiderOffer", (error, offers) => {
      if (error) {
        return;
      }
      this.setState({
        riderOffers: offers
      })
    });

    this.fetchOffers("DriverOffer", (error, offers) => {
      if (error) {
        return;
      }
      this.setState({
        driverOffers: offers
      })
    });
  }

  title = (offer) => {
    var startTime = moment(offer.startTime);
    var endTime = moment(offer.endTime);
    const timeDiff = endTime.diff(startTime, 'minutes');
    var time = startTime.add(timeDiff/2, 'minutes');
    const timeString = moment(time).format("ddd H:MM");
    const route = " " + offer.originLocality + " to " + offer.destLocality;
    const title = timeString + " " + route;
    return title;
  }

  description = (offer) => {
    return offer.originLabel + " to " + offer.destLabel;
  }

  offerClick = (offer, isDriver) => {
    console.log("click");
    location.href="offer?driver=" + isDriver + "&id=" + offer.objectId;
  }

  renderOffersPanel(isDriver) {
    const offers = isDriver ? this.state.driverOffers : this.state.riderOffers;
    if (offers.length == 0) { return null; }

    return (
      <Panel>
      <PanelHeader>
        <div style={{fontSize: 14}}>
          {isDriver ? "Driver offers" : "Rider offers"}
          </div>
      </PanelHeader>

      <PanelBody>
        {offers.map(offer => {
          return this.renderOffer(offer, isDriver);
        })}
      </PanelBody>
      </Panel>
    )
  }

  renderOffer(offer, isDriver) {
    const title = this.title(offer);
    const description = this.description(offer);

    return (
      <MediaBox
      onClick={() => this.offerClick(offer, isDriver)}
      type="appmsg"
      href="javascript:void(0);">
      <MediaBoxBody>
      <MediaBoxTitle>{title}</MediaBoxTitle>
      <MediaBoxDescription>
        {description}
      </MediaBoxDescription>
      </MediaBoxBody>
      </MediaBox>
    )
  }

  render() {
    return (
      <div style={{maxWidth: 800, width: "100%", height: "100%", margin: "0 auto 10px", paddingTop: 40, paddingBottom: 20, backgroundColor: "whitesmoke"}}>
          {this.renderOffersPanel(true)}
          {this.renderOffersPanel(false)}
      </div>
    );
  }
}

MyOffersPage.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default connect(
  state => (
  { number: state.count.number,
    isDriver: state.count.isDriver}),
  { isDriver }
)(MyOffersPage)
