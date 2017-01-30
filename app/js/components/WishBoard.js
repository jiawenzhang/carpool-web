import Parse from 'parse'
import ParseReact from 'parse-react'
import React from 'react'
import { Button } from 'react-bootstrap'
import '../../style.css'
//const ParseComponent = ParseReact.Component(React)

//import _ from 'lodash'

//mixins: [ParseReact.Mixin]


const wellStyles = {maxWidth: 400, margin: '0 auto 10px'};

//export default class WishBoard extends ParseComponent {
class WishBoard extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

//  observe() {
//    console.log('observing');
//    const query = new Parse.Query('Item');
//    console.log("user id " + Parse.User.current().id);
//    //query.equalTo('ownerId', Parse.User.current().id);
//
//    query.limit(200);
//    query.descending('updatedAt');
//    query.find().then(items => {
//      items && items.length > 0 && console.log("items " + items.length);
//      items && items.length > 0 && console.log(items[0].toJSON());
//    });
//
//    return {
//      items: query
//    };
//  }

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
    this.context.router.replace('/driver');
  }

  riderClick() {
    console.log("rider click")
  }
}

WishBoard.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export default WishBoard
