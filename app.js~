// All requirements to run this app
var express = require('express');
var usersModel = require('./backend').UsersModel;
var pg = require('pg');
var userCount = 1;
var app = express();

// ERROR MESSAGES
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


// gets the front-end view of this app
app.get('/', function(req, res) {
  res.render('client.jade', {title: 'LOGIN'});
});

// new UsersModel for running the backend app
var usersModel = new UsersModel();

// sends a post request to login this user with password
app.post('/users/login', function(req, res) {
  
  var username = req.body.user;
  var password = req.body.password;
  
  usersModel.login(username, password, function(error, loginStatus) {
    // an error in the request
    if (loginStatus < 0) {
      response = { "errCode" : loginStatus };
    // all clear!  
    } else {
      response = { "errCode" : SUCCESS, "count" : loginStatus };
    }
    res.send(response);
  });  
});

// sends a post request to add a new user with a password
app.post('/users/add', function(req, res) {
  
  var username = req.body.user;
  var password = req.body.password;
  
  usersModel.add(username, password, function(error, addStatus) {
    // an error in the request
    if (addStatus < 0) {
      response = {"errCode" : addStatus};
    // all clear!
    } else {
      response = {"errCode" : SUCCESS, "count" : addStatus };
      
    }
    res.send(response);
    
  });

});  

// sends a post request to reset the database
app.post('/TESTAPI/resetFixture', function(req, res) {
  usersModel.TESTAPI_resetFixture(function(error, status) {
    response = {"errCode" : status};
    res.send(response);
  });
});

// sends a post request to run the unit tests
var UnitTest = require('./test/unitTesting').TestCases;
var unitTest = new TestCases();
app.post('/TESTAPI/unitTests', function(req, res) {
  unitTest.TESTAPI_unitTests(function(testRan, failedTests, outputs) {
    response = {"totalTests" : testRan,
		"nrFailed" : failedTests,
		"output" : outputs };
    res.send(response);
  });
});

//Listening on local port 8888
var port = process.env.PORT || 8888;
app.listen(port);