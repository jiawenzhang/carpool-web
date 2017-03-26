import React from 'react'
import Parse from 'parse'
import { connect } from 'react-redux'
import { isDriver, setLastPage } from '../actions/count'
import {Button, ButtonArea} from 'react-weui';

//import weui styles
import 'weui';
import 'react-weui/lib/react-weui.min.css';

class DriverRiderPage extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {}

  render() {
    if (!Parse.User.current()) {
      return;
    }

    return (
      <div style={{maxWidth: 800, width: "80%", margin: "0 auto 10px"}}>
        <div className="col-xs-12" style={{marginTop:50, marginBottom: 50, fontSize: 26, textAlign: "center"}}>
          I want to
        </div>

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
          onClick={this.seeMyOffers.bind(this)}>
          See my offers
        </Button>

      </div>
    );
  }

  driverClick() {
    console.log("driver click")
    var {isDriver, setLastPage} = this.props
    isDriver(true)
    setLastPage("driverrider");
    this.context.router.push('/time')
  }

  riderClick() {
    var {setLastPage, isDriver} = this.props
    isDriver(false);
    setLastPage("driverrider");
    console.log("rider click")
    this.context.router.push('/time')
  }

  seeMyOffers() {
    this.context.router.push('/myoffers')
  }

  logoutClick() {
    Parse.User.logOut()
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
    isDriver: state.count.isDriver,
    lastPage: state.count.lastPage}),
  { isDriver,
    setLastPage }
)(DriverRiderPage)
