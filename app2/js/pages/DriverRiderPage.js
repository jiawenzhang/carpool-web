import React from 'react'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { isDriver } from '../actions/count'

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
          I am a
        </div>
        <div style={{margin: "0 auto"}}>
          <Button
            bsSize="large"
            onClick={this.driverClick.bind(this)}
            block>
            Driver
          </Button>
        </div>

        <div className="col-xs-12" style={{height: 20}}>
        </div>

        <div style={{margin: "0 auto"}}>
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
