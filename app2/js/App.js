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

import URI from "urijs";

import { createHistory, } from "history";
import { Application, } from "./containers";
import { Provider } from 'react-redux'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { createStore, combineReducers } from 'redux'
import * as reducers from './reducers'

import Login from "./pages/login/Login";
import DriverRiderPage from "./pages/DriverRiderPage";
import MyOffersPage from "./pages/MyOffersPage";
import TimePage from "./pages/TimePage/TimePage";
import RoutePage from "./pages/RoutePage";
import NotePage from "./pages/NotePage";
import MatchPage from "./pages/MatchPage";
import OfferDetailPage from "./pages/OfferDetailPage";

import Parse from 'parse'

const PARSE_APP_ID = 'myAppId'
const PARSE_JS_KEY = 'foo'

Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY)
Parse.serverURL = 'http://192.168.1.68:1337/parse'
//Parse.serverURL = 'http://10.0.9.133:1337/parse'

const reducer = combineReducers({
  ...reducers,
  routing: routerReducer
})

const store = createStore(
  reducer,
)

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" onEnter={this.checkLogin.bind(this)}>
            <IndexRoute path="driverrider" component={DriverRiderPage} />
            <Route path="login" component={Login} />
            <Route path="myoffers" component={MyOffersPage} />
            <Route path="time" component={TimePage} />
            <Route path="route" component={RoutePage} />
            <Route path="offer" component={OfferDetailPage} />
            <Route path="note" component={NotePage} />
            <Route path="match" component={MatchPage} />
            <Redirect path="*" to="/" />
          </Route>
        </Router>
      </Provider>
    );
  }

  checkLogin(nextState, replace) {
    console.log("checkLogin " + document.location.href);
    const uri = new URI(document.location.href);
    const query = uri.query(true);
    const {code} = query;

    if (!Parse.User.current()) {
      console.log("path: " + uri.path());
      console.log("not login, location.href: " + location.href);

      if (!code) {
        var redirectURL = document.location.href + "login";
        var authUrl = this.generateGetCodeUrl(redirectURL);
        console.log("opening authUrl " + authUrl);
        document.location = authUrl;
        return;
      }

      if (uri.path() !== '/login') {
        console.log("replace to /login");
        replace('/login');
      }
    } else {
      console.log("already login, location.href: " + location.href);
    }
  }

  generateGetCodeUrl(redirectURL) {
    console.log("redirectURL " + redirectURL);
    return new URI("https://open.weixin.qq.com/connect/oauth2/authorize")
        .addQuery("appid", "wx9d52375a819c3398")
        .addQuery("redirect_uri", redirectURL)
        .addQuery("scope", "snsapi_base")
        .addQuery("response_type", "code")
        .hash("wechat_redirect")
        .toString();
  }
}

App.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default App;
