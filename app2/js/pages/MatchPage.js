import React from 'react'
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap'
import { connect } from 'react-redux'
import { isDriver } from '../actions/count'

class MatchPage extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={{maxWidth: 800, width: "80%", margin: "0 auto 10px"}}>
        <div className="col-xs-12" style={{marginTop:20, marginBottom: 20, fontSize: 26, textAlign: "center"}}>
          I am a
        </div>
        <ListGroup>
          <ListGroupItem>Matched rider 1</ListGroupItem>
          <ListGroupItem>Matched rider 2</ListGroupItem>
          <ListGroupItem>...</ListGroupItem>
        </ListGroup>
      </div>
    );
  }
}

MatchPage.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default MatchPage
