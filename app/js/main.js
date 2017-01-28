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

const loginRequired = (nextState, replace) => {
  if (!Parse.User.current()) {
    replace('/login')
  }
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route component={App} path='/'>
      <Route path='login' component={Login}/>
      <IndexRoute onEnter={loginRequired} component={WishBoard}/>
    </Route>
  </Router>
), document.getElementById('app'))

