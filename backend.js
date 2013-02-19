
/**
 * list of all global variables
 */
var SUCCESS               =   1;
var ERR_BAD_CREDENTIALS   =  -1;
var ERR_USER_EXISTS       =  -2;
var ERR_BAD_USERNAME      =  -3;
var ERR_BAD_PASSWORD      =  -4;

var MAX_USERNAME_LENGTH = 128;
var MAX_PASSWORD_LENGTH = 128;

//Postgres requirements and connection to the database
var pg = require('pg');
var connection = new pg.Client(process.env.HEROKU_POSTGRESQL_CHARCOAL_URL || "tcp://postgres:password@localhost/postgres");
connection.connect();


//Making the UsersModel as a function
UsersModel = function() {};
UsersModel.prototype.login = function(user, password, callback) {
  var username = null;
  var psswrd = null;
  var count = 0;
  var status = count;
  
  //checks if the user is already in the database
  connection.query('SELECT * FROM testdb WHERE username = $1;', [user], function(error, results) {
    var resultsTable = results.rows[0];
    //if undefined, then this user is not in the database
    if (resultsTable === undefined) {
      status = ERR_BAD_CREDENTIALS;
    //adding to the database
    } else {
      username = resultsTable.username;
      psswrd = resultsTable.password;
      count = resultsTable.count;
      
      //check the username and credentials
      if (username == null) {
	status = ERR_BAD_CREDENTIALS;
      }
      //bad password
      if (password != psswrd) {
	status = ERR_BAD_CREDENTIALS;
      }
      
      /*
       * check the status, if any errors, then report it
       * otherwise, send the count that is stored in the database
       */
      if (status >= 0) {
	count += 1;
	status = count;
	//update the count for this user
	connection.query('UPDATE testdb SET count = count + 1 WHERE username = $1;', [user]);
      }
    }
    callback(null, status);
    
  });
};

UsersModel.prototype.add = function(name, password, callback) {
  var username = null;
  var psswrd = null;
  var count = 0;
  //check if user is already in the database
  connection.query("SELECT * FROM testdb WHERE username = $1;", [name], function(error, results) {
    var status = 0;
    //if the query returns a result, then the user is in the database
    if (results.rows[0] !== undefined) {
      status = ERR_USER_EXISTS;
    //not in the database, can add the user
    } else {
      status = 1;
      if ((name == '') || (name.length > MAX_USERNAME_LENGTH)) {
	status = ERR_BAD_USERNAME;
      }
      //invalid password with username
      else if (password.length > MAX_PASSWORD_LENGTH) {
        status = ERR_BAD_PASSWORD;
      } else {
	//add new user to the database
	connection.query('INSERT INTO testdb(username, password, count) VALUES ($1, $2, $3);', [name, password, 1]);
      }
    }
    callback(null, status);
  });
};

UsersModel.prototype.TESTAPI_resetFixture = function(callback) {
  //never deletes table, just clears existing table
  connection.query('TRUNCATE testdb;');
  callback(null, SUCCESS);
};

