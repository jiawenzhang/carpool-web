var path = require('path');
var express = require('express');
var router = express.Router();
var webpack = require('webpack');
var config = require('./webpack.config.dev');

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use("/",router);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

router.get('/load/', function(req, res) {
    var params = req.query
    var link = decodeURIComponent(params.link);
    console.log("link: " + link);
});

var port = 3000;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('Listening at http://localhost:3000');
});
