var path = require('path');
var express = require('express');
var router = express.Router();
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var crypto = require("crypto");
var url = require("url");
var signature = require('./signature');
var wechatConfig = require('./wechatConfig');
var URI = require('urijs');
var https = require('https');


var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use("/",router);
app.use("/images", express.static(path.join(__dirname, 'images')));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index2.html'));
});

router.get('/load/', function(req, res) {
    var params = req.query
    var link = decodeURIComponent(params.link);
    console.log("link: " + link);
});

router.get('/validate/', function(req, res) {
  console.log("validate")
  var query = url.parse(req.url, true).query;
  //console.log("*** URL:" + req.url);
  //console.log(query);
  var signature = query.signature;
  var echostr = query.echostr;
  var timestamp = query['timestamp'];
  var nonce = query.nonce;
  var oriArray = new Array();
  oriArray[0] = nonce;
  oriArray[1] = timestamp;
  oriArray[2] = "wechat" //这里是你在微信开发者中心页面里填的token，而不是****
  oriArray.sort();
  var original = oriArray.join('');
  console.log("Original str : " + original);
  console.log("Signature : " + signature );
  var scyptoString = sha1(original);
  if (signature == scyptoString){
    res.end(echostr);
    console.log("Confirm and send echo back");
  } else {
    res.end("false");
    console.log("Failed!");
  }
});

router.get("/signature/", function(req, res) {
    //let originalUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var params = req.query;
    let targetUrl = decodeURIComponent(params.targetUrl);
    console.log("link to verify: " + targetUrl);
    signature.sign(targetUrl, function(signatureMap){
        signatureMap.appId = wechatConfig.appid;
        res.send(signatureMap);
    });
});

router.get("/access_token/", function(req, res) {
    var params = req.query;
    console.log("access_token params " + JSON.stringify(params));
    var code = params.code;
    console.log("code: " + code);

    var url = "https://api.weixin.qq.com/sns/oauth2/access_token"
    + "?appid=" + wechatConfig.appid
    + "&secret=" + wechatConfig.secret
    + "&code=" + code
    + "&grant_type=authorization_code";

    https.get(url, function (reply) {
      var data = '';
      reply.on('data', function (chunk) {
        data += chunk;
      });
      reply.on('end', function () {
        console.log("end, data " + data);
        res.send(data);
      });
    }).on('error', function () {
      console.error("error getting access_token");
      res.send("error");
    });
});

function sha1(str) {
  var md5sum = crypto.createHash("sha1");
  md5sum.update(str);
  str = md5sum.digest("hex");
  return str;
}

var httpServer = require('http').createServer(app);
httpServer.listen(process.env.PORT || 3000, function() {
    console.log('Listening at http://localhost:3000');
});
