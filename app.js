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

/*
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});
*/
var usersModel = new UsersModel();

app.get('/', function(req, res) {
  res.send("Hello World");
});


app.post('/users/login', function(req, res) {
  var reqHandle = JSON.parse(req);
  var resHandle = JSON.parse(res);
  var username = reqHandle[user];
  var password = reqHandle[user];
  
  var rval = usersModel.login(username, password);
  if (rval < 0) {
    response = { "errCode" : rval };
  } else {
    response = { "errCode" : SUCESS, "count" : rval };
  }
  res.send(response);
});

app.post('/users/add', function(req, res) {
  var reqHandle = JSON.parse(req);
  var resHandle = JSON.parse(res);
  
  var username = reqHandle[user]
  var password = reqHandle[user];
  
  var rval = usersModel.add(username, password);
  if (rval < 0) {
    response = {"errCode" : rval};
    
  } else {
    response = {"errCode" : SUCESS,
		"count" : rval };
  }
  res.send(response);
});  

app.post('/TESTAPI/resetFixture', function(req, res) {
  var reqHandle = JSON.parse(req);
  var resHandle = JSON.parse(res);

  usersModel.TESTAPI_resetFixture();
  response = {"errCode" : SUCCESS};
  res.send(response); 
});

app.listen(3000);