var SUCCESS               =   1;
var ERR_BAD_CREDENTIALS   =  -1;
var ERR_USER_EXISTS       =  -2;
var ERR_BAD_USERNAME      =  -3;
var ERR_BAD_PASSWORD      =  -4;

UsersModel = function() {};

var MAX_USERNAME_LENGTH = 128;
var MAX_PASSWORD_LENGTH = 128;

var pg = require('pg');
var connection = new pg.Client(process.env.HEROKU_POSTGRESQL_CHARCOAL_URL);
connection.connect();

UsersModel.prototype.login = function(user, password, callback) {
  
  var userQuery = client.query('SELECT * FROM testdb WHERE username = $u', [user]);
  
  query.on('row', function(row) {
    var username = row.username;
    var psswrd = row.password;
    var count = row.count;
  });
  
  // not in database
  if (username == null) {
    return ERR_BAD_CREDENTIALS;
  }

  if (password != psswrd) {
    return ERR_BAD_CREDENTIALS;
  }
  
  // ALL CLEAR!
  count += 1;
  callback(null, count);
}

UsersModel.prototype.add = function(name, password, callback) {
  var userQuery = client.query('SELECT * FROM testdb WHERE username = $u', [name]);
  query.on('row', function(row) {
    var username = row.username;
    var psswrd = row.password;
    var count = row.count;
  });
  
  if (username != null) {
    return ERR_USER_EXISTS;
  }
  if ((name == "") && (name.length > MAX_USERNAME_LENGTH)) {
    return ERR_BAD_USERNAME;
  }
  if (psswrd.length <= MAX_PASSWORD_LENGTH) {
    return ERR_BAD_PASSWORD;
  }
  var userQuery = client.query('INSERT INTO testdb(username, password, count) VALUES ($n, $p, $c))', [name, password, 1]);
  callback(null, 1);
 
}

UsersModel.prototype.TESTAPI_resetFixture = function() {
  client.query('TRUNCATE testdb');
  
}



