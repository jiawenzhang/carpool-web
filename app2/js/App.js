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

import RoutePage from "./pages/RoutePage";
import DriverRiderPage from "./pages/DriverRiderPage";
import TimePage from "./pages/TimePage/TimePage";

const history = useRouterHistory(createHistory)({
  basename: `/react-google-maps`,
});

export default class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Route path="/" component={Application}>
          <IndexRoute component={DriverRiderPage} />
          <Route path="route" component={RoutePage} />
          <Route path="time" component={TimePage} />
          <Redirect path="*" to="/" />
        </Route>
      </Router>
    );
  }
}
