import React from 'react'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { increase, decrease } from '../actions/count'

class DriverRiderPage extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    return (
      <div style={{maxWidth: 400, position: "relative", height: "auto", margin: "0 auto 10px"}}>
        <div className="col-xs-12" style={{marginBottom: 50, fontSize: 26, textAlign: "center"}}>
          I am a
        </div>
        <div className="col-xs-12">
          <Button
            bsSize="large"
            onClick={this.driverClick.bind(this)}
            block>
            Driver
          </Button>
        </div>

        <div className="col-xs-12" style={{height: 20}}>
        </div>

        <div className="col-xs-12">
          <Button
            bsSize="large"
            onClick={this.riderClick.bind(this)}
            block>
            Rider
          </Button>
        </div>
      </div>
    );
  }

  driverClick() {
    console.log("driver click")
    let {increase} = this.props
    increase(2)
    //this.context.router.replace({ pathname: '/time', query: { isDriver : true }})
    this.context.router.push('/time')
  }

  riderClick() {
    console.log("rider click")
    this.context.router.replace({ pathname: '/time', query: { isDriver : false }})
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
  { number: state.count.number }),
  { increase,
    decrease }
)(DriverRiderPage)
