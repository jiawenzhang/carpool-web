import Parse from 'parse'
import ParseReact from 'parse-react'
import React from 'react'
import '../../style.css'
const ParseComponent = ParseReact.Component(React)

import _ from 'lodash'

mixins: [ParseReact.Mixin]


/**
* Some helper stuff to let you use query parameters for the pin sizes
* i.e. ?size=medium or ?size=large
*/
const size = location.search ? location.search.split('=')[1] : 'small';
const sizeMap = { small: 237, medium: 345, large: 600 };
const gutter = 25;
const columns = 2;
const width = columns * sizeMap[size] + gutter;

export default class WishBoard extends ParseComponent {

  observe() {
    console.log('observing');
    const query = new Parse.Query('Item');
    console.log("user id " + Parse.User.current().id);
    //query.equalTo('ownerId', Parse.User.current().id);
    
    query.limit(200);
    query.descending('updatedAt');
    query.find().then(items => {
      items && items.length > 0 && console.log("items " + items.length);
      items && items.length > 0 && console.log(items[0].toJSON());
    });

    return {
      items: query
    };
  }

  render() {
    return (
      /*outer div is used to center the PinterestGrid horizontally*/
      <div style={{margin: "auto", width: width+"px"}}>
      </div>
    );
  }
}
