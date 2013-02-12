var SUCCESS               =   1;
var ERR_BAD_CREDENTIALS   =  -1;
var ERR_USER_EXISTS       =  -2;
var ERR_BAD_USERNAME      =  -3;
var ERR_BAD_PASSWORD      =  -4;

UsersModel = function() {};

var MAX_USERNAME_LENGTH = 128;
var MAX_PASSWORD_LENGTH = 128;

var pg = require('pg');
var connection = new pg.Client(process.env.HEROKU_POSTGRESQL_CHARCOAL_URL || "tcp://postgres:1234@localhost/postgres");
connection.connect();

UsersModel.prototype.login = function(user, password, callback) {
  var username = null;
  var psswrd = null;
  var count = 0;
  console.log("woot");
  var userQuery = connection.query('SELECT * FROM testdb WHERE username = $1', [user], function(error, results) {
    var username = results.row.username;
    var psswrd = results.row.password;
    var count = results.row.count;
  });
  
  console.log("woot2");
  /*
  userQuery.on('row', function(row) {
    var username = row.username;
    var psswrd = row.password;
    var count = row.count;
  });
*/  
  var status = count;
  
  // not in database
  if (username == null) {
    status = ERR_BAD_CREDENTIALS;
  }
  if (password != psswrd) {
    status = ERR_BAD_CREDENTIALS;
  }
  
  if (status < 0) {
    callback(null, status);
  } else {
  // ALL CLEAR!
  count += 1;
  callback(null, count);
  }
};

UsersModel.prototype.add = function(name, password, callback) {
  var username = null;
  var psswrd = null;
  var count = 0;
  var userQuery = connection.query('SELECT * FROM testdb WHERE username = $1', [name], function(error, results) {
    username = row.username;
    psswrd = row.password;
    count = row.count;
  });
  /*
  userQuery.on('row', function(row) {
    username = row.username;
    psswrd = row.password;
    count = row.count;
  });
  */
  var status = 1;
  
  if (username != null) {
    if ((username == "") && (username.length > MAX_USERNAME_LENGTH)) {
      status = ERR_BAD_USERNAME;
    }
    if (psswrd.length <= MAX_PASSWORD_LENGTH) {
      status = ERR_BAD_PASSWORD;
    } else {
      status = ERR_USER_EXISTS;
    }
  }
  connection.query('INSERT INTO testdb(username, password, count) VALUES ($1, $2, $3))', [name, password, 1]);
  callback(null, status);
};

UsersModel.prototype.TESTAPI_resetFixture = function() {
  connection.query('TRUNCATE testdb');
  
};