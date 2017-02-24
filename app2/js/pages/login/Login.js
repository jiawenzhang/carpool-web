import React from 'react'
import Parse from 'parse'
import {FormGroup, FormControl, Button} from 'react-bootstrap'

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = { error : null, signup : false };
  }

  componentDidMount() {
    window.fbAsyncInit = function() {
      Parse.FacebookUtils.init({
        appId      : '221345307993103',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.7'
      });

      console.log("facebook init");

      // Now that we've initialized the JavaScript SDK, we call
      // FB.getLoginStatus().  This function gets the state of the
      // person visiting this page and can return one of three states to
      // the callback you provide.  They can be:
      //
      // 1. Logged into your app ('connected')
      // 2. Logged into Facebook, but not your app ('not_authorized')
      // 3. Not logged into Facebook and can't tell if they are logged into
      //    your app or not.
      //
      // These three cases are handled in the callback function.
      // FB.getLoginStatus(function(response) {
      //   this.statusChangeCallback(response);
      // }.bind(this));
    }.bind(this);

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  render() {
    if (Parse.User.current()) {
      console.log("already login")
      this.context.router.push('/driverrider');
      return null
    }

    console.log("state " + this.state);
    return (
      <div id='login'>
        <div className='pinterest-widget--pin pin-widget--login'>
          <div className="col-xs-12" style={{marginTop: 20, height: 100, fontSize: 32, textAlign: "center"}}>
            {"Wheels to Town"}
          </div>

          <div className="col-xs-12">
          <FormGroup bsSize="large">
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="Email"
            onChange={this.emailChange}
          />
          </FormGroup>
        </div>

          <div className="col-xs-12">
          <FormGroup bsSize="large">
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="Password"
            onChange={this.passwordChange}
          />
          </FormGroup>
        </div>

          {this.state.signup &&
          <div className="col-xs-12">
              <FormGroup bsSize="large">
                <FormControl
                  type="text"
                  value={this.state.value}
                  placeholder="Re-enter Password"
                  onChange={this.reenterPasswordChange}
                  />
              </FormGroup>
            </div>
          }

          {this.state.signup &&
          <div className="col-xs-12">
              <FormGroup bsSize="large">
                <FormControl
                  type="text"
                  value={this.state.value}
                  placeholder="Name"
                  onChange={this.nameChange}
                  />
              </FormGroup>
            </div>
          }

          <div className="col-xs-12" style={{height: 40}}>
          </div>

          <div className="col-xs-12">
          <Button
            bsSize="large"
            bsStyle={this.state.signup ? "default" : "primary"}
            onClick={this.onLogin}
            block>
            Login
          </Button>
        </div>

          <div className="col-xs-12" style={{marginTop: 15, marginBottom: 15, fontSize: 16, textAlign: "center"}}>
            OR
          </div>

          {false && <div className="col-xs-12">
            <Button
              bsSize="large"
              bsStyle="info"
              onClick={this.onFacebook}
              block>
              Login with Facebook
            </Button>
          </div>
          }

          {false &&
            <div className="col-xs-12" style={{height: 20}}>
            </div>
          }

          <div className="col-xs-12">
          <Button
            bsSize="large"
            bsStyle={this.state.signup ? "primary" : "default"}
            onClick={this.onSignup}
            block>
            Signup
          </Button>
        </div>

          <div className="col-xs-12" style={{height: 20}}>
          </div>


          {this.state.error &&
             <div className='col-xs-12' style={{textAlign: "center", color: "red"}}>
               {this.state.error}
             </div>
          }
        </div>
      </div>
    )
  }

  emailChange = (e) => {
    console.log("email: " + e.target.value);
    this.email = e.target.value;
  }

  passwordChange = (p) => {
    console.log("password: " + p.target.value);
    this.password = p.target.value;
  }

  reenterPasswordChange = (p) => {
    console.log("reenterPassword: " + p.target.value);
    this.reenterPassword = p.target.value;
  }

  nameChange = (n) => {
    console.log("name: " + n.target.value);
    this.name = n.target.value;
  }

  onLogin = () => {
    if (this.state.signup) {
      this.setState({error: null, signup: false});
    } else {
      console.log("Login, email " + this.email)
      const email = this.email
      const password = this.password

      if (!email) {
        this.setState({error: "Please enter email"});
        return;
      }

      if (!password) {
        this.setState({error: "Please enter password"});
        return;
      }

      Parse.User.logIn(email, password).then(() => {
        this.context.router.replace('/driverrider');
      }, (error) => {
        console.log(error)
        this.setState({error: error.message});
      })
    }
  }

  onSignup = () => {
    if (this.state.signup) {
      const email = this.email
      const password = this.password
      const reenterPassword = this.reenterPassword;
      const name = this.name;

      if (!email) {
        this.setState({error: "Please enter email"});
        return;
      }

      if (!password || !reenterPassword) {
        this.setState({error: "Please enter password"});
        return;
      }

      if (password != reenterPassword) {
        this.setState({error: "Passwords do not match"});
        return;
      }

      if (!name) {
        this.setState({error: "Please enter a name"});
        return;
      }

      var user = new Parse.User();
      user.set("username", email);
      user.set("password", password);
      user.set("email", email);
      user.set("name", name);

      user.signUp(null).then(() => {
        console.log("signup success");
        this.context.router.replace('/driverrider');
      }, (error) => {
        console.log(error);
        this.setState({error: error.message});
      });
    } else {
      this.setState({error: null, signup: true});
    }
  }

  onFacebook = () => {
    if (Parse.User.current()) {
      console.log("already logged in");
      return
    }

    Parse.FacebookUtils.logIn(null, {
      success: (user) => {
        if (!user.existed()) {
          console.log("User signed up and logged in through Facebook!");
        } else {
          console.log("User logged in through Facebook!");
        }
        this.context.router.replace('/driverrider');
      },
      error: (user, error) => {
        console.error("User cancelled the Facebook login or did not fully authorize.");
        this.setState({error: error.message});
        // switch (error.code) {
        //   case Parse.Error.INVALID_SESSION_TOKEN:
        //   Parse.User.logOut().then(() => {
        //     this.handleLogin(credentials);
        //   });
        //   break;
        // }
      }
    });
  }
}

Login.contextTypes = {
    router: React.PropTypes.func.isRequired
};


export default Login
