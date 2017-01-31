import React from 'react'
import { Button } from 'react-bootstrap'

const wellStyles = {maxWidth: 400, margin: '0 auto 10px'};

class DriverRiderPage extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="well" style={wellStyles}>
        <Button
          bsSize="large"
          onClick={this.driverClick.bind(this)}
          block>
          Driver
        </Button>
        <Button
          bsSize="large"
          onClick={this.riderClick.bind(this)}
          block>
          Rider
        </Button>
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
