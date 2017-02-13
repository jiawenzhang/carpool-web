import React from 'react'
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap'
import { connect } from 'react-redux'
import { isDriver } from '../actions/count'

class MatchPage extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    const CustomComponent = React.createClass({
      render() {
        console.log("this.props " + this.props)
        return (
          <li
            className="list-group-item"
            onClick={() => {}}>
            <div>
              {"Time: " + this.props.time}
            </div>
            <div>
              {"Location: " + this.props.location}
            </div>
          </li>
        );
      }
    });

    return (
      <div style={{maxWidth: 800, width: "80%", margin: "0 auto 10px"}}>
        <div className="col-xs-12" style={{marginTop:20, marginBottom: 20, fontSize: 26, textAlign: "center"}}>
          I am a
        </div>
        <ListGroup>
          <CustomComponent
            time = "Jan 17, 12:00"
            location="Toronto"
          >
          </CustomComponent>
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
