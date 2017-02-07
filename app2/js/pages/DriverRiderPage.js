import React from 'react'
import { Button } from 'react-bootstrap'

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
    this.context.router.replace('/route');
  }

  riderClick() {
    console.log("rider click")
    this.context.router.replace('/time');
  }
}

DriverRiderPage.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default DriverRiderPage
