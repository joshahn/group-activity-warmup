var SUCCESS               =   1;
var ERR_BAD_CREDENTIALS   =  -1;
var ERR_USER_EXISTS       =  -2;
var ERR_BAD_USERNAME      =  -3;
var ERR_BAD_PASSWORD      =  -4;

UsersModel = function() {};

var MAX_USERNAME_LENGTH = 128;
var MAX_PASSWORD_LENGTH = 128;

var pg = require('pg');
var connection = new pg.Client(process.env.HEROKU_POSTGRESQL_CHARCOAL_URL || "tcp://postgres:password@localhost/postgres");
connection.connect();

UsersModel.prototype.login = function(user, password, callback) {
  var username = null;
  var psswrd = null;
  var count = 0;
  var status = count;
  var userQuery = connection.query('SELECT * FROM testdb WHERE username = $1;', [user], function(error, results) {
    var resultsTable = results.rows[0];
    if (resultsTable === undefined) {
      status = ERR_BAD_CREDENTIALS;
    } else {
      username = resultsTable.username;
      psswrd = resultsTable.password;
      count = resultsTable.count;
      
      // not in database
      if (username == null) {
	status = ERR_BAD_CREDENTIALS;
      }
      if (password != psswrd) {
	status = ERR_BAD_CREDENTIALS;
      }
    
      if (status >= 0) {
      // ALL CLEAR!
      count += 1;
      status = count;
      connection.query('UPDATE testdb SET count = count + 1 WHERE username = $1;', [user]);
      }
    }
    callback(null, status);
    
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
  
  //var userQuery = connection.query('SELECT * FROM testdb WHERE username = $1;', [name], function(error, results) {
  connection.query("SELECT * FROM testdb WHERE username = $1;", [name], function(error, results) {
    var status = 0;
    if (results.rows[0] !== undefined) {
      status = ERR_USER_EXISTS;
      /*
      var resultsTable = results.rows[0];
      username = resultsTable.username;
      psswrd = resultsTable.password;
      count = resultsTable.count;
      console.log("found: " + username + " " + psswrd + " " + count);
    */
    } else {
      status = 1;
      if ((name == '') || (name.length > MAX_USERNAME_LENGTH)) {
	status = ERR_BAD_USERNAME;
      }
      else if (password.length > MAX_PASSWORD_LENGTH) {
        status = ERR_BAD_PASSWORD;
      } else {
	connection.query('INSERT INTO testdb(username, password, count) VALUES ($1, $2, $3);', [name, password, 1]);
      }
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

UsersModel.prototype.TESTAPI_resetFixture = function(callback) {
  connection.query('TRUNCATE testdb;');
  connection.query("SELECT * FROM testdb;", function(error, results) {
    console.log(results.rows);
    if (results.rows == []) {
      console.log("huzzah!")
    }
    console.log(callback);
    callback(null, SUCCESS);
  });
};

