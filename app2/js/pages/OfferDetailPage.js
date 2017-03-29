import React from 'react'
import Parse from 'parse'
import ParseReact from 'parse-react'
const ParseComponent = ParseReact.Component(React)
import moment from 'moment';
import Helmet from "react-helmet"
import Util from "../util"
import URI from "urijs";
import WechatAuth from "../WechatAuth";

import { connect } from 'react-redux'


import {
  Toast,
  Label,
  Panel,
  PanelHeader,
  PanelFooter,
  PanelBody,
  MediaBox,
  MediaBoxBody,
  MediaBoxTitle,
  MediaBoxDescription,
  Preview,
  PreviewHeader,
  PreviewBody,
  PreviewItem,
  PreviewFooter,
  PreviewButton,
  CellBody,
 }
from 'react-weui';

//import weui styles
import 'weui';
import 'react-weui/lib/react-weui.min.css';

class OfferDetailPage extends ParseComponent {
  observe() {}

  constructor(props) {
    super(props)

    this.state = {
      cancelled: false,
      showCancelledToast: false,
      toastTimer: null
    }
  }

  onBackButtonEvent = (e) => {
    e.preventDefault()
    this.context.router.replace({ pathname: '/'})
  }

  componentWillUnmount() {
    this.state.toastTimer && clearTimeout(this.state.toastTimer);
  }

  componentDidMount() {
    window.onpopstate = this.onBackButtonEvent;

    const uri = new URI(document.location.href);
    const query = uri.query(true);
    const {lastPage} = query;
    this.lastPage = lastPage;

    if (Parse.User.current()) {
      this.loadOffer();
      return;
    }

    console.log("login " + document.location.href);
    const {code} = query;

    WechatAuth.login(code, (error, result) => {
      if (error) {
        console.error("fail to login with wechat: " + error);
      } else {
        console.log("login success with wechat");
        this.loadOffer();
      }
    });
  }

  loadOffer = () => {
    this.offerId = this.props.location.query.id
    this.driver = this.props.location.query.driver
    if (!this.offerId) {
      console.log("observing no offerId, return")
      return
    }

    console.log("driver " + this.driver)

    var query
    if (this.driver === "true") {
      console.log("getting Driver Offer offerId: " + this.offerId);
      query = new Parse.Query('DriverOffer');
    } else {
      console.log("getting Rider Offer offerId: " + this.offerId);
      query = new Parse.Query('RiderOffer');
    }

    this.offerData = {};

    query.get(this.offerId).then(offer => {
      offer && console.log(offer.toJSON());
      if (offer.get("cancelled")) {
        console.log("offer is cancelled");
        this.setState({
          cancelled: true
        })
        return;
      }

      this.offer = offer
      var startTime = moment(offer.get("startTime"))
      var endTime = moment(offer.get("endTime"))
      console.log("startTime ", startTime.format('lll'))
      console.log("endTime ", endTime.format('lll'))
      this.offerData.startTime = startTime;
      this.offerData.endTime = endTime;
      this.offerData.contact = offer.get("contact");
      this.offerData.note = offer.get("note");
      this.offerData.price = offer.get("price");
      const userId = offer.get("userId");
      this.offerData.userId = userId;

      const query = new Parse.Query(Parse.User);
      return query.get(userId)
    }).then(user => {
      if (!user) {
        return;
      }
      console.log("got user " + JSON.stringify(user));
      this.offerData.name = user.get("name");
      this.offerData.email = user.get("email");

      const query = new Parse.Query("Location")
      const originId = this.offer.get("originId")
      console.log("getting originId: " + originId)
      return query.get(originId)
    }).then(origin => {
      if (!origin) {
        return;
      }
      console.log("got origin " + JSON.stringify(origin));
      this.offerData.originLabel = origin.get("label")
      this.offerData.originPlaceId = origin.get("placeId")
      this.offerData.originLocality = origin.get("locality")

      const query = new Parse.Query("Location")
      const destId = this.offer.get("destId")
      console.log("getting destId: " + destId)
      return query.get(destId)
    }).then(dest => {
      if (!dest) {
        return;
      }
      console.log("got dest " + JSON.stringify(dest));
      this.offerData.destLabel = dest.get("label")
      this.offerData.destPlaceId = dest.get("placeId")
      this.offerData.destLocality = dest.get("locality")

      console.log("offerData: " + JSON.stringify(this.offerData));
      var startTime = this.offerData.startTime;
      var endTime = this.offerData.endTime;

      const proximateTime = Util.proximateTime(startTime, endTime);
      var timeStr;
      if (proximateTime) {
        timeStr = startTime.format("ddd") + " " + proximateTime;
      } else {
        const timeDiff = endTime.diff(startTime, 'minutes');
        var time = startTime.add(timeDiff/2, 'minutes');
        timeStr = moment(time).format("ddd H:MM");
      }

      // if (route.length > 35)
      const price = this.offerData.price
      var priceStr = "";
      if (price) {
        priceStr = "$" + price + " ";
      }

      var route = "";
      if (this.offerData.originLocality && this.offerData.destLocality) {
        route = this.offerData.originLocality + " to " + this.offerData.destLocality
      }
      console.log("route: " + route)
      const title = priceStr + timeStr + " " + route;
      this.setState(
        { data: this.offerData,
          title: title
        });

      this.getSignatureMap();
    }, (error) => {
      console.log('Failed to query offer, with error code: ' + error.message);
    });
  }

  getSignatureMap = () => {
    // get wx signatureMap
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        console.log("readyState");
        console.log("response: " + xmlHttp.responseText);
        var signatureMap = JSON.parse(xmlHttp.responseText);
        this.gotSignatureMap(signatureMap);
      }
    }.bind(this);

    let targetUrl = location.href.split("#")[0];
    console.log("location.href " + targetUrl);
    let url = "signature?targetUrl=" + encodeURIComponent(targetUrl);
    xmlHttp.open("GET", url, true); // false for synchronous request
    xmlHttp.send();
  }

  gotSignatureMap = (signatureMap) => {
    console.log("gotSignatureMap");
    console.log("appId: " + signatureMap.appId);

    var weChatState = {
      debug: false,
      appId: signatureMap.appId,
      timestamp: signatureMap.timestamp,
      nonceStr: signatureMap.noncestr,
      signature: signatureMap.signature,
      jsApiList: [
        'onMenuShareAppMessage'
      ]
    }

    console.log("wechatState " + JSON.stringify(weChatState));

    window.wx.config(weChatState);
    window.wx.ready(() => {
      console.log("ready back");
      this.ready = true;

      var note = this.offerData.note ? ", " + this.offerData.note : "";
      var desc = this.offerData.originLabel + " to " + this.offerData.destLabel + note;

      var params = {
        driver: this.driver,
        id: this.offerId
      }

      var link = location.protocol + '//' + location.host + this.props.location.pathname +
      "?" + Util.urlEncode(params);
      var imageUrl = location.protocol + '//' + location.host + "/images/logo.png";
      console.log("link " + link);
      console.log("imageUrl " + imageUrl);
      window.wx.onMenuShareAppMessage({
        title: this.state.title,
        desc: desc,
        link: link, // 分享链接
        imgUrl: imageUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
          console.log("share success")
        },
        cancel: function () {
          console.log("share cancel")
        }
      });
    });

    window.wx.error((err) => {
      this.ready = false;
      console.error(JSON.stringify(err));
    });
  }

  fromClick = () => {
    console.log("fromClick")
  }

  cancelClick = () => {
    console.log("cancelOffer");
    if (!this.offer) {
      console.error("no offer, cannot cancel");
      return;
    }

    this.offer.set("cancelled", true);
    this.offer.save().then(offer => {
      console.log("offer cancel success");
      this.offerCancelled();
    }, (error) => {
      console.error('failed to cancel offer, with error code: ' + error.message);
    });
  }

  render() {
    if (!this.state) {
      return null
    }

    return (
      <div style={{maxWidth: 800, width: "100%", height: "100%", margin: "auto", backgroundColor: "whitesmoke"}}>
        <Helmet title={this.state.title}/>
        {this.state.cancelled && this.renderMsg("The offer is cancelled")}
        {this.state.data && this.renderOffer()}
        {this.renderToast()}
      </div>
    )
  }

  offerCancelled() {
    this.setState({showCancelledToast: true});
    this.state.toastTimer = setTimeout(() => {
      this.setState({showCancelledToast: false});

      if (this.lastPage) {
        if (this.lastPage === "myoffers") {
          this.context.router.goBack();
        } else if (this.lastPage === "note") {
          // newly created offer, if cancelled, go to root page
          this.context.router.goBack();
        } else {
          console.error("unknown lastPage!");
          this.context.router.replace({pathname: '/'});
        }
      } else {
        //page is opened from no history, no where to go back, show root page
        this.context.router.replace({pathname: '/'});
      }
    }, 1000);
  }

  renderToast() {
    return (
      <Toast
        icon="success-no-circle"
        show={this.state.showCancelledToast}>
        Cancelled
      </Toast>
    )
  }

  renderMsg(msg) {
    console.log("renderMsg " + msg);
    return (
      <div style={{paddingTop: 50, fontSize: 16, textAlign: "center"}}>
        {msg}
      </div>
    )
  }

  renderOffer() {
    return (
        <Preview>
          <PreviewHeader>
            {this.renderHeader()}
          </PreviewHeader>
          <PreviewBody>
            {this.renderTime()}
            {this.renderFrom()}
            {this.renderTo()}
            {this.renderContact()}
            {this.renderNote()}
          </PreviewBody>
            {this.renderCancel()}
        </Preview>
      )
  }

  renderCancel = () => {
    if (!Parse.User.current()) {
      console.log("user not login, disable cancel offer");
      return null;
    }

    if (Parse.User.current().id != this.offerData.userId) {
      console.log("logged in user is not owner of the offer, disable cancel offer");
      return null;
    }

    return (
      <PreviewFooter>
        <PreviewButton
          primary
          onClick={() => this.cancelClick()}>
          CANCEL OFFER
        </PreviewButton>
      </PreviewFooter>
    );
  }

  renderFrom = () => {
    return this.renderRow("From", this.state.data.originLabel);
  }

  renderTo = () => {
    return this.renderRow("To", this.state.data.destLabel);
  }

  renderContact = () => {
    // // when logged in with wechat, we don't have user's name and email
    // if (!this.state.data.name || !this.state.data.email) {
    //   return null;
    // }
    //  this.state.data.name + (this.state.data.email ? ", email: " + this.state.data.email : "")

    if (!this.state.data.contact) {
      return null;
    }

    return this.renderRow(
      "Contact",
      this.state.data.contact
    );
  }

  renderNote = () => {
    var note = this.state.data.note;
    return note && note.length > 0 ? this.renderRow("Note", this.state.data.note) : null;
  }

  renderPanel = (header, description) => {
    return (
      <MediaBox
        type="appmsg">
        <MediaBoxBody>
          <MediaBoxTitle>{header}</MediaBoxTitle>
          <MediaBoxDescription>
            {description}
          </MediaBoxDescription>
        </MediaBoxBody>
      </MediaBox>
    )
  }

  renderRow(title, text, secondText) {
    return (
      <div style={{position: "relative", paddingTop: 10, paddingBottom: 10}}>
        <div style={{width: "30%", position: "absolute", left: 0, color: "grey", fontWeight: "normal", textAlign: "left", fontSize: "15"}}>
          {title}
        </div>
        <div style={{width: "70%", marginLeft: "30%", position: "relative", color: "black", textAlign: "left", fontSize: "14"}}>
          {text}
        </div>
        {secondText &&
        <div style={{width: "70%", marginLeft: "30%", position: "relative", color: "black", textAlign: "left", fontSize: "14"}}>
          {secondText}
        </div>
        }
      </div>
    )
  }

  renderHeader = () => {
    const priceStr = this.state.data.price ? "$" + this.state.data.price : null;
    //Fixme:
    const padding = priceStr ? 0 : 40;
    //const header = (this.driver === "true" ? "Driver offer" : "Rider offer") + "\u00a0\u00a0" /* whitespace */ + priceStr;
    const header = (this.driver === "true" ? "Driver offer" : "Rider offer");

    return (
      <div style={{position: "relative", paddingTop: 10, paddingBottom: padding}}>
        <div style={{width: "50%", position: "absolute", left: 0, color: "black", textAlign: "left", fontSize: "17"}}>
          {header}
        </div>
        <div style={{width: "50%", marginLeft: "50%", position: "relative", color: "grey", textAlign: "left", fontSize: "16"}}>
          {priceStr}
        </div>
      </div>
    )
  }

  renderTime = () => {
    var startTime = this.offerData.startTime;
    var endTime = this.offerData.endTime;
    var proximateTime = Util.proximateTime(startTime, endTime);
    if (proximateTime) {
      return this.renderRow("Time", startTime.format("ddd MMM Do"), proximateTime);
    }

    var timeDiff = endTime.diff(startTime, 'minutes');
    var time = startTime.add(timeDiff/2, 'minutes');

    var diffStr;
    if (timeDiff == 0) {
      diffStr = "On time"
    } else {
      diffStr = "Flexible by " + timeDiff + " minutes";
    }

    return this.renderRow("Time", time.format("ddd MMM Do H:MM"), diffStr);
  }
}

OfferDetailPage.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default connect(
  state => (
  {}),
  {}
)(OfferDetailPage)
