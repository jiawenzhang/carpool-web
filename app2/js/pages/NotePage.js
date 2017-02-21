import React from 'react'
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import { connect } from 'react-redux'
import { isDriver } from '../actions/count'

class NotePage extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  noteChange = (e) => {
    //console.log("note change " + e.target.value)
    this.note = e.target.value;
  }

  render() {
    return (
      <div style={{maxWidth: 800, width: "80%", margin: "0 auto 10px"}}>
        <div className="col-xs-12" style={{marginTop:50, marginBottom: 50, fontSize: 26, textAlign: "center"}}>
            Leave a note
        </div>

        <FormGroup controlId="formControlsTextarea">
          <ControlLabel></ControlLabel>
          <FormControl
            componentClass="textarea"
            placeholder="Max 200 characters"
            maxLength="200"
            onChange={this.noteChange}
            style={{height: 100, maxHeight:100}}
          />
        </FormGroup>

        <div style={{margin: "0 auto"}}>
          <Button
            bsSize="large"
            onClick={this.nextClick.bind(this)}
            block>
            Next
          </Button>
        </div>

        <div className="col-xs-12" style={{height: 20}}>
        </div>

      </div>
    );
  }

  nextClick() {
    console.log("next click")
    console.log("note: " + this.note);
    //this.context.router.push('/time')
  }
}

NotePage.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default connect(
  state => (
  { number: state.count.number,
    isDriver: state.count.isDriver}),
  { isDriver }
)(NotePage)
