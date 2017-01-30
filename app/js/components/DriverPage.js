
import Parse from 'parse'
import React from 'react'
import '../../style.css'

const wellStyles = {maxWidth: 400, margin: '0 auto 10px'};

class DriverPage extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="well" style={wellStyles}>
        driver page
      </div>
    );
  }
}

export default DriverPage
