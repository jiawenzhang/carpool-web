import Parse from "parse"

exports.login = function (code, callback) {
    if (!code) {
      console.error("no code, cannot login with wechat");
      callback("error: no code", null);
      return;
    }

    console.log("got code: " + code)
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        console.log("readyState");
        console.log("response: " + xmlHttp.responseText);
        var data = JSON.parse(xmlHttp.responseText);
        if (data.errcode) {
          console.error("fail to get access_token and openid: " + xmlHttp.responseText);
          callback("error", null);
          return;
        }

        // Create a instagram provider
        var provider = {
          authenticate(options) {
            if (options.success) {
              options.success(this, {});
            }
          },

          restoreAuthentication(authData) {},

          getAuthType() {
            return 'wechat';
          },

          deauthenticate() {}
        };

        var authData = {
          access_token: data.access_token,
          id: data.openid
        }

        console.log("authData " + JSON.stringify(authData));

        var options = {
          authData: authData
        }

        Parse.User.logInWith(provider, options).then(() => {
          console.log("login with wechat!");
          callback(null, "success");
        }, (error) => {
          console.log(error)
          callback(error.message, null);
        })
      }
    }

    var url = "access_token?code=" + code;
    xmlHttp.open("GET", url, true); // false for synchronous request
    xmlHttp.send();
  };
