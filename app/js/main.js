import React from 'react'
import Parse from 'parse'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'

const PARSE_APP_ID = 'myAppId'
const PARSE_JS_KEY = 'foo'

Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY)
Parse.serverURL = 'http://192.168.1.68:1337/parse'

/* Routes components */
import App from './components/App'
import Login from './components/login/Login'
import WishBoard from './components/WishBoard'
import DriverPage from './components/DriverPage'
import MapPage from './components/MapPage'
import SimpleMapPage from './components/SimpleMapPage'
import GettingStartedExample from './components/GettingStartedExample'

import {
  Application,
} from "./containers";

const loginRequired = (nextState, replace) => {
  if (!Parse.User.current()) {
    replace('/login')
  }
}

import "../index.css";
  // <Router history={browserHistory}>
  //   <Route component={App} path='/'>
  //     <Route path='login' component={Login}/>
  //     <IndexRoute onEnter={loginRequired} component={WishBoard}/>
  //     <Route path='driver' component={DriverPage}/>
  //     <Route path='map' component={GettingStartedExample}/>
  //   </Route>
  // </Router>

ReactDOM.render((
   <Router history={browserHistory}>
        <Route path="/" component={Application}>
          <IndexRoute component={GettingStartedExample} />
        </Route>
   </Router>
), document.getElementById('app'))
          // <Route path="basics">
          //   <Route path="simple-map" component={SimpleMapExample} />
          // </Route>
          // <Route path="places">
          //   <Route path="search-box" component={SearchBoxExample} />
          // </Route>
          //<Redirect path="*" to="/" />
