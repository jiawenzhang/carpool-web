import React from 'react'
import Parse from 'parse'
import { connect } from 'react-redux'
import { setLastPage } from '../actions/count'
import moment from 'moment';
import Util from '../util';
import {
  Toast,
  Label,
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
      driverOffers: [],
      loadState: "loading",
      showLoadingToast: true
    }

    this.loadRiderOffersDone = false;
    this.loadDriverOffersDone = false;
  }

  componentDidMount() {
    window.onpopstate = this.onBackButtonEvent;

    if (!Parse.User.current()) {
      console.log("not logged in!");
      this.emptyMsg = "Not logged in";
      this.setState({
        loadState: "done"
      });
      return;
    }

    this.emptyMsg = "No active offer";

    this.fetchOffers("RiderOffer", (error, offers) => {
      this.loadRiderOffersDone = true;
      this.updateLoadState();
      if (error) {
        return;
      }
      this.setState({
        riderOffers: offers
      })
    });

    this.fetchOffers("DriverOffer", (error, offers) => {
      this.loadDriverOffersDone = true;
      this.updateLoadState();
      if (error) {
        return;
      }
      this.setState({
        driverOffers: offers
      })
    });
  }

  onBackButtonEvent = (e) => {
    e.preventDefault()
    this.context.router.replace({ pathname: '/'})
  }

  fetchOffers = (objectName, callback) => {
    var offerJSONs = [];
    var queryOffer = new Parse.Query(objectName);
    queryOffer.equalTo("userId", Parse.User.current().id);
    queryOffer.notEqualTo("cancelled", true);
    queryOffer.descending('updatedAt');
    queryOffer.greaterThan("endTime", new Date());
    var results =[];
    queryOffer.find().then(offerObjects => {
      if (!offerObjects || offerObjects.length == 0) {
        callback(null, []);
        return;
      }

      for (var i=0; i<offerObjects.length; i++) {
        //console.log(offers[i].toJSON());
        var offerJSON = {
          offerObject: offerObjects[i]
        }
        offerJSONs.push(offerJSON);
      }

      var promise = Parse.Promise.as();
      offerJSONs.forEach(function(offerJSON) {
        promise = promise.then(function() {
          const query = new Parse.Query("Location")
          const originId = offerJSON.offerObject.get("originId");
          console.log("getting originId: " + originId)
          // Return a promise that will be resolved when the delete is finished.
          return query.get(originId).then(origin => {
            offerJSON["originLabel"] = origin.get("label")
            offerJSON["originPlaceId"] = origin.get("placeId")
            offerJSON["originLocality"] = origin.get("locality")
            const query = new Parse.Query("Location")
            const destId = offerJSON.offerObject.get("destId");
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

  updateLoadState = () => {
    const loadState = this.loadRiderOffersDone && this.loadDriverOffersDone ? "done" : "loading";
    this.setState({
      loadState: loadState
    });

    if (this.loadRiderOffersDone || this.loadDriverOffersDone) {
      // as soon as one kind of offer is loaded, we dismiss the loading toast
      this.setState({
        showLoadingToast: false
      })
    }
  }

  title = (offer) => {
    var startTime = moment(offer.offerObject.get("startTime"));
    var endTime = moment(offer.offerObject.get("endTime"));
    var proximateTime = Util.proximateTime(startTime, endTime);
    var timeString;
    if (proximateTime) {
      timeString = startTime.format("ddd") + " " + proximateTime;
    } else {
      const timeDiff = endTime.diff(startTime, 'minutes');
      var time = startTime.add(timeDiff/2, 'minutes');
      timeString = moment(time).format("ddd H:MM");
    }

    var route = "";
    if (offer.originLocality && offer.destLocality) {
      // if user only selects a country, locality is null
      route = " " + offer.originLocality + " to " + offer.destLocality;
    }
    const title = timeString + route;
    return title;
  }

  description = (offer) => {
    return offer.originLabel + " to " + offer.destLabel;
  }

  offerClick = (offer, isDriver) => {
    console.log("click");
    var {setLastPage} = this.props;
    setLastPage("myoffers");
    location.href="offer?driver=" + isDriver + "&id=" + offer.offerObject.id + "&lastPage=myoffers";
  }

  renderNoOfferMsg(msg) {
    if (this.state.loadState == "loading") {
      return null;
    }

    if (this.state.driverOffers.length > 0 || this.state.riderOffers.length > 0) {
      return null;
    }

    return (
      <div style={{fontSize: 16, textAlign: "center"}}>
        {msg}
      </div>
    )
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

  renderLoadingToast() {
    return (
      <Toast
        icon="loading"
        show={this.state.showLoadingToast}>
        Loading...
      </Toast>
    )
  }

  render() {
    if (!Parse.User.current()) {
      return;
    }

    return (
      <div style={{maxWidth: 800, width: "100%", height: "100%", margin: "0 auto 0px", paddingTop: 40, paddingBottom: 20, backgroundColor: "whitesmoke"}}>
          {this.renderLoadingToast()}
          {this.renderNoOfferMsg(this.emptyMsg)}
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
    isDriver: state.count.isDriver,
    lastPage: state.count.lastPage}),
  { setLastPage }
)(MyOffersPage)
