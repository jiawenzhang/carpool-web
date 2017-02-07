import {
  default as React,
  Component,
} from "react";

import {
  useRouterHistory,
  Router,
  Route,
  IndexRoute,
  Redirect,
} from "react-router";

import {
  createHistory,
} from "history";

import {
  Application,
} from "./containers";

import Login from "./pages/login/Login";
import DriverRiderPage from "./pages/DriverRiderPage";
import TimePage from "./pages/TimePage/TimePage";
import RoutePage from "./pages/RoutePage";

const history = useRouterHistory(createHistory)({
  basename: `/react-google-maps`,
});

import Parse from 'parse'

const PARSE_APP_ID = 'myAppId'
const PARSE_JS_KEY = 'foo'

Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY)
Parse.serverURL = 'http://192.168.1.68:1337/parse'

export default class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Route path="/" component={Application}>
          <IndexRoute component={Login} />
          <Route component={DriverRiderPage} />
          <Route path="route" component={RoutePage} />
          <Route path="time" component={TimePage} />
          <Redirect path="*" to="/" />
        </Route>
      </Router>
    );
  }
}
