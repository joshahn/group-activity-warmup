var express = require('express');
var ArticleProvider = require('./backend').UsersModel;
var pg = require('pg');
var userCount = 1;
var app = express();



var SUCCESS               =   1;
var ERR_BAD_CREDENTIALS   =  -1;
var ERR_USER_EXISTS       =  -2;
var ERR_BAD_USERNAME      =  -3;
var ERR_BAD_PASSWORD      =  -4;


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var usersModel = new UsersModel();

app.get('/', function(req, res) {
  res.render('client.jade', {title: 'LOGIN'});
});


app.post('/users/login', function(req, res) {
  var reqHandle = JSON.parse(req);
  var resHandle = JSON.parse(res);
  var username = reqHandle[user];
  var password = reqHandle[user];
  
  usersModel.login(username, password, function(error, loginStatus) {
    if (loginStatus < 0) {
      response = { "errCode" : loginStatus };
    } else {
      response = { "errCode" : SUCESS, "count" : loginStatus };
    }
    res.send(response);
  });  
});
  
app.post('/users/add', function(req, res) {
  
  var username = req.body.user;
  var password = req.body.password;
  
  usersModel.add(username, password, function(error, addStatus) {
    if (addStatus < 0) {
      response = {"errCode" : addStatus};
      
    } else {
      response = {"errCode" : SUCCESS, "count" : addStatus };
      
    }
    res.send(response);
    
  });

});  

app.post('/TESTAPI/resetFixture', function(req, res) {
  var reqHandle = JSON.parse(req);
  var resHandle = JSON.parse(res);

  usersModel.TESTAPI_resetFixture();
  response = {"errCode" : SUCCESS};
  res.send(response); 
});

var port = process.env.PORT || 8888;
app.listen(port);