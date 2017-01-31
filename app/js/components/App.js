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
} from "../containers";

import {
  GettingStartedExample,
} from "./GettingStartedExample";

const history = useRouterHistory(createHistory)({
  basename: `/react-google-maps`,
});

export default class App extends Component {
  render() {
    console.log("App render")
    return (
      <Router history={history}>
        <Route path="/" component={Application}>
          <IndexRoute component={GettingStartedExample} />
        </Route>
      </Router>
    );
  }
}

          // <Route path="basics">
          //   <Route path="simple-map" component={SimpleMapExample} />
          // </Route>
          // <Route path="places">
          //   <Route path="search-box" component={SearchBoxExample} />
          // </Route>
          // <Redirect path="*" to="/" />
