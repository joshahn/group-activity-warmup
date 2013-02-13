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
  var status = count;
  console.log("gonna do login query now");
  var userQuery = connection.query('SELECT * FROM testdb WHERE username = $1;', [user], function(error, results) {
    console.log("results of login query:" + results);
    var resultsTable = results.rows[0];
    if (resultsTable === undefined) {
      status = ERR_BAD_CREDENTIALS;
    } else {
      username = resultsTable.rows.username;
      psswrd = resultsTable.rows.password;
      count = resultsTable.rows.count;
      console.log("here are the results of the login query: " + username + " " + psswrd + " " + count);
      
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
      }
    }
    callback(null, count);
    
  });
    /*
  userQuery.on('row', function(row) {
    var username = row.username;
    var psswrd = row.password;
    var count = row.count;
  });
*/  

};

UsersModel.prototype.add = function(name, password, callback) {
  var username = null;
  var psswrd = null;
  var count = 0;
  console.log("finding the username");
  var userQuery = connection.query('SELECT * FROM testdb WHERE username = $1;', [name], function(error, results) {
    console.log("these are the find results: " + results);
    console.log("results.rows: " + results.rows[0]);
    if (results.rows[0] !== undefined) {
      status = ERR_USER_EXISTS
    }else {
      var resultsTable = results.rows[0];
      username = resultsTable.username;
      psswrd = resultsTable.password;
      count = resultsTable.count;
      console.log("found: " + username + " " + psswrd + " " + count);
    
      var status = 1;
      if ((username == "") && (username.length > MAX_USERNAME_LENGTH)) {
	status = ERR_BAD_USERNAME;
      }
      if (psswrd.length > MAX_PASSWORD_LENGTH) {
        status = ERR_BAD_PASSWORD;
      }
      console.log("adding the info to db");
      connection.query('INSERT INTO testdb(username, password, count) VALUES ($1, $2, $3);', [name, password, 1]);
      console.log("added, return: " + status);
    }
    callback(null, status);
    
    });
  /*
  userQuery.on('row', function(row) {
    username = row.username;
    psswrd = row.password;
    count = row.count;
  });
  */

};

UsersModel.prototype.TESTAPI_resetFixture = function() {
  connection.query('TRUNCATE testdb;');
  
};