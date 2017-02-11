import {
  default as React,
  Component,
} from "react";

import {
  useRouterHistory,
  Router,
  Route,
  IndexRoute,
  browserHistory,
  Redirect,
} from "react-router";

import { createHistory, } from "history";
import { Application, } from "./containers";
import { Provider } from 'react-redux'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createStore, combineReducers } from 'redux'
import * as reducers from './reducers'

import Login from "./pages/login/Login";
import DriverRiderPage from "./pages/DriverRiderPage";
import TimePage from "./pages/TimePage/TimePage";
import RoutePage from "./pages/RoutePage";

import Parse from 'parse'

const PARSE_APP_ID = 'myAppId'
const PARSE_JS_KEY = 'foo'

Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY)
Parse.serverURL = 'http://192.168.1.68:1337/parse'

const reducer = combineReducers({
  ...reducers,
  routing: routerReducer
})

const store = createStore(
  reducer,
)

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={Application}>
            <IndexRoute component={Login} />
            <Route path="driverrider" component={DriverRiderPage} />
            <Route path="route" component={RoutePage} />
            <Route path="time" component={TimePage} />
            <Redirect path="*" to="/" />
          </Route>
        </Router>
      </Provider>
    );
  }
}
