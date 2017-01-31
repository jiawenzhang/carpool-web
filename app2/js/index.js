import React from "react";

import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, browserHistory} from 'react-router'

import App from "./App";

import "../index.css";

ReactDOM.render((
  <Router history={browserHistory}>
    <Route component={App} path='/'>
    </Route>
  </Router>
), document.getElementById('root'))
