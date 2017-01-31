import React from "react";

import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, browserHistory} from 'react-router'

// const Root = (
//   window.ReactGoogleMapsAsync ?
//   require(`./AsyncApp`).default :
//   /*
//    * If you're not using async,
//    *
//    * Add script src="https://maps.googleapis.com/maps/api/js" to your HTML to provide google.maps reference
//    */
//   require(`./App`).default
// );

import App from "./App";

import "../index.css";

// ReactDOM.render(
//   <Root />,
//   document.getElementById(`root`)
// );

ReactDOM.render((
   <Router history={browserHistory}>
   <Route component={App} path='/'>
   </Route>
   </Router>
), document.getElementById('root'))
