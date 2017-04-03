import React from 'react'
import Parse from 'parse'
import { connect } from 'react-redux'
import { setIsDriver, setLastPage } from '../actions/count'
import {
  Button,
  ButtonArea,
  Footer,
  FooterText
} from 'react-weui';

//import weui styles
import 'weui';
import 'react-weui/lib/react-weui.min.css';

class DriverRiderPage extends React.Component {

  constructor(props) {
    super(props)

    var {lastPage, newOfferId, isDriver} = this.props;
    var showUi = true;
    if (lastPage && lastPage === "note" && newOfferId) {
      showUi = false;
      //this.context.router.replace({ pathname: '/offer', query: { id : offer.id, driver: this.isDriver }})
      // 由 router 跳转的页面无法在微信网页环境下验证 url signautre
      // we just created a new offer and navigates back from note page, show the new offer
      location.href="offer?driver=" + isDriver + "&id=" + newOfferId + "&lastPage=note";
    }

    this.isWeChatBrowser = Util.isWeChatBrowser();

    this.state = {
      showUi: showUi
    }
  }

  componentDidMount() {}

  renderLogo() {
    return (
        <img
          src={require("../../../images/logo300.png")}
          style={{width: "40vw", maxWidth: 300, display: "block", margin: "0 auto", paddingBottom: 60, paddingTop: 60}}
        />
    )
  }

  renderButtons() {
    return (
        <div>
        <div style={{margin: "0 auto"}}>
          <Button
            type="default"
            onClick={this.riderClick.bind(this)}>
            Find a ride
          </Button>
        </div>

        <div className="col-xs-12" style={{height: 20}}>
        </div>

        <div style={{margin: "0 auto"}}>
          <Button
            type="default"
            onClick={this.driverClick.bind(this)}>
            Offer a ride
          </Button>
        </div>

        <div className="col-xs-12" style={{height: 20}}>
        </div>

        {false && <div style={{margin: "0 auto"}}>
          <Button
            type="default"
            onClick={this.logoutClick.bind(this)}>
            Logout
          </Button>
        </div>
        }

        <div className="col-xs-12" style={{height: 20}}>
        </div>

        <Button
          type="default"
          onClick={this.myOffers.bind(this)}>
          My offers
        </Button>
        </div>
    )
  }

  renderFooter() {
    return (
      <div style={{position: "absolute", bottom: 0 }}>
        <Footer>
          <FooterText>Copyright &copy; 2017 Beans</FooterText>
        </Footer>
      </div>
    )
  }

  renderNotWeChat() {
    return (
      <div style={{maxWidth: 800, width: "80%", margin: "0 auto 10px"}}>
        {this.renderLogo()}
        {this.renderQr()}
      </div>
    )
  }

  renderQr() {
    return (
      <div style={{paddingBottom: 50, paddingTop: 50, fontSize: 14, color: "grey", textAlign: "center"}}>
      <img
        src={require("../../../images/qr.jpeg")}
        style={{width: "45vw", maxWidth: 300, display: "block", margin: "0 auto", paddingBottom: 5}}
        />
      微信扫一扫使用
      </div>
    )
  }

  render() {
    if (!this.isWeChatBrowser) {
      return this.renderNotWeChat();
    }

    if (!this.state.showUi) {
      return null;
    }

    if (!Parse.User.current()) {
      return null;
    }

    return (
      <div style={{maxWidth: 800, width: "80%", margin: "0 auto 10px"}}>

        {this.renderLogo()}
        {this.renderButtons()}
        {false && this.renderFooter()}

      </div>
    );
  }

  driverClick() {
    console.log("driver click")
    var {setIsDriver, setLastPage} = this.props
    setIsDriver(true)
    setLastPage("driverrider");
    this.context.router.push('/time')
  }

  riderClick() {
    var {setLastPage, setIsDriver} = this.props
    setIsDriver(false);
    setLastPage("driverrider");
    console.log("rider click")
    this.context.router.push('/time')
  }

  myOffers() {
    this.context.router.push('/myoffers')
  }

  logoutClick() {
    Parse.User.logOut()
  }
}

DriverRiderPage.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default connect(
  state => (
  { number: state.count.number,
    isDriver: state.count.isDriver,
    lastPage: state.count.lastPage,
    newOfferId: state.count.newOfferId}),
  { setIsDriver,
    setLastPage }
)(DriverRiderPage)
