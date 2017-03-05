import React from 'react'
import Parse from 'parse'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { isDriver } from '../actions/count'
import wx from 'weixin-js-sdk'

class DriverRiderPage extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    return (
      <div style={{maxWidth: 800, width: "80%", margin: "0 auto 10px"}}>
        <div className="col-xs-12" style={{marginTop:50, marginBottom: 50, fontSize: 26, textAlign: "center"}}>
          I want to
        </div>

        <div style={{margin: "0 auto"}}>
          <Button
            bsSize="large"
            onClick={this.riderClick.bind(this)}
            block>
            Find a ride
          </Button>
        </div>

        <div className="col-xs-12" style={{height: 20}}>
        </div>

        <div style={{margin: "0 auto"}}>
          <Button
            bsSize="large"
            onClick={this.driverClick.bind(this)}
            block>
            Offer a ride
          </Button>
        </div>

        <div className="col-xs-12" style={{height: 20}}>
        </div>

        <div style={{margin: "0 auto"}}>
          <Button
            bsSize="large"
            onClick={this.logoutClick.bind(this)}
            block>
            Logout
          </Button>
        </div>

      </div>
    );
  }

  driverClick() {
    console.log("driver click")
    let {isDriver} = this.props
    isDriver(true)
    this.context.router.push('/time')
  }

  riderClick() {
    let {isDriver} = this.props
    isDriver(false)
    console.log("rider click")
    this.context.router.push('/time')
  }

  gotSignatureMap = (signatureMap) => {
    console.log("gotSignatureMap");
    console.log("appId: " + signatureMap.appId);

    let weChatState = {
      debug: true,
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
    console.log("wx.config");

    window.wx.ready(() => {
      console.log("ready back");
      console.log(window.wx.ready());
      this.ready = true;
    });
    console.log("ready setup");

    window.wx.error((err) => {
      this.ready = false;
      console.error('upload/UploadContainer/wx/wxError');
      console.error(JSON.stringify(err));
    });

    // wx.checkJsApi({
    //   jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
    //   success: function(res) {
    //     console.log("success, " +res)
    //     // 以键值对的形式返回，可用的api值true，不可用为false
    //     // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
    //   }
    // });
  }

  logoutClick() {
    //Parse.User.logOut()
    console.log("fetch data")
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        console.log("readyState");
        console.log("response: " + xmlHttp.responseText);
        var signatureMap = JSON.parse(xmlHttp.responseText);
        this.gotSignatureMap(signatureMap);
      }
    }.bind(this);

    let url = "signature/"
    xmlHttp.open("GET", url, true); // false for synchronous request
    xmlHttp.send();
  }
}

DriverRiderPage.contextTypes = {
  router: React.PropTypes.func.isRequired
};

//number: state.count.number
// const mapStateToProps = (state) => (
// {
//   state: state
// });
//
// const mapDispatchToProps = (dispatch) => ({
//   actions: bindActionCreators(Actions, dispatch)
// })

export default connect(
  state => (
  { number: state.count.number,
    isDriver: state.count.isDriver}),
  { isDriver }
)(DriverRiderPage)
