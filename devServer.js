var path = require('path');
var express = require('express');
var router = express.Router();
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var crypto = require("crypto");
var url = require("url");
var signature = require('./signature');
var wechatConfig = require('./wechatConfig');

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use("/",router);

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
    //let originalUrl = req.protocol + '://' + req.get('host') + "/offer?driver=false&id=PH6Ujz5V1W"
    let originalUrl = req.protocol + '://' + req.get('host') + "/offer?driver=" + params.driver + "&id=" + params.id;
    let url = originalUrl.split('#')[0];
    console.log("url " + url);
    signature.sign(url, function(signatureMap){
        signatureMap.appId = wechatConfig.appid;
        res.send(signatureMap);
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
