var usersModel = require('../backend').UsersModel;
var testUser = new UsersModel();
var assert = require('assert');

TestCases = function() {};



var SUCCESS               =   1;
var ERR_BAD_CREDENTIALS   =  -1;
var ERR_USER_EXISTS       =  -2;
var ERR_BAD_USERNAME      =  -3;
var ERR_BAD_PASSWORD      =  -4;

testCases = new TestCases();
TestCases.prototype.addSuccess = function(user, password, callback) {
  testUser.add(user, password, function(error, status) {
    var failed = false;
    try {
      assert.equal(SUCCESS, status);
    } catch (err) {
      console.log(err);
      var failed = true;
      var errorMsg = 'ERR :: failed to add';
    }
    callback(errorMsg, failed);
  });
};

TestCases.prototype.addDuplicate = function(user, password, callback) {
  testUser.add(user, password, function(error, status) {
    var failed = false;
    try {
      assert.equal(ERR_USER_EXISTS , status);
    } catch (err) {
      console.log(err);
      var failed = true;
      var errorMsg = 'ERR :: duplicate user';
    }
    callback(errorMsg, failed);
  });
};

TestCases.prototype.addEmpty = function(user, password, callback) {
  testUser.add(user, password, function(error, status) {
    var failed = false;
    try {
      assert.equal(ERR_BAD_USERNAME, status);
    } catch (err) {
      console.log(err);
      var failed = true;
      var errorMsg = 'ERR :: name field is empty';
    }
    callback(errorMsg, failed);
  });
};

TestCases.prototype.addUserTooLong = function(user, password, callback) {
  testUser.add(user, password, function(error, status) {
    var failed = false;
    try {
      assert.equal(ERR_BAD_USERNAME, status);
    } catch (err) {
      console.log(err);
      var failed = true;
      var errorMsg = 'ERR : username is too long';
    }
    callback(errorMsg, failed);
  });
};


TestCases.prototype.addPasswordTooLong = function(user, password, callback) {
  testUser.add(user, password, function(error, status) {
    var failed = false;
    try {
      assert.equal(ERR_BAD_PASSWORD, status);
    } catch (err) {
      console.log(err);
      var failed = true;
      var errorMsg = 'ERR : password is too long';
    }
    callback(errorMsg, failed);
  });
};

TestCases.prototype.loginSuccess = function(user, password, callback) {
  testUser.login(user, password, function(error, status) {
    var failed = false;
    try {
      assert.equal(2, status);
    } catch (err) {
      console.log(err);
      var failed = true;
      var errorMsg = 'ERR : login failed';
    }
    callback(errorMsg, failed);
  });
};

TestCases.prototype.loginDoesntExist = function(user, password, callback) {
  testUser.login(user, password, function(error, status) {
    var failed = false;
    try {
      assert.equal(ERR_BAD_CREDENTIALS, status);
    } catch (err) {
      console.log(err);
      var failed = true;
      var errorMsg = 'ERR : user doesnt exist!';
    }
    callback(errorMsg, failed);
  });
};

TestCases.prototype.loginBadPassword = function(user, password, callback) {
  testUser.login(user, password, function(error, status) {
    var failed = false;
    try {
      assert.equal(ERR_BAD_CREDENTIALS, status);
    } catch (err) {
      console.log(err);
      var failed = true;
      var errorMsg = 'ERR : bad password!';
    }
    callback(errorMsg, failed);
  });
};

TestCases.prototype.loginSuccessAgain = function(user, password, callback) {
  testUser.login(user, password, function(error, status) {
    var failed = false;
    try {
      assert.equal(3, status);
    } catch (err) {
      console.log(err);
      var failed = true;
      var errorMsg = 'ERR : did not increment properly!';
    }
    callback(errorMsg, failed);
  });
};

TestCases.prototype.resetDatabase = function(callback) {
  testUser.TESTAPI_resetFixture(function(error, status) {
    var failed = false;
    try {
      assert.equal(SUCCESS, status);
    } catch (err) {
      console.log(err);
      var failed = true;
      var errorMsg = 'ERR : database not cleared';
    }
    callback(errorMsg, failed);
  });
};



TestCases.prototype.TESTAPI_unitTests = function(callback) {
  var testRan = 0;
  var failedTests = 0;
  var outputs = '';
  testCases.addSuccess('user', 'password', function(errorMsg, failedStatus) {
    if (failedStatus) {
      failedTests++;
      testRan++;
      outputs = outputs + " " + errorMsg;
    } else {
      testRan++;
    }

    testCases.addDuplicate('user', 'password', function(errorMsg, failedStatus) {
      if (failedStatus) {
	failedTests++;
	testRan++;
	outputs = outputs + " " + errorMsg;
      } else {
	testRan++;
      }

      testCases.addEmpty('', 'password', function(errorMsg, failedStatus) {
	if (failedStatus) {
	  failedTests++;
	  testRan++;
	  outputs = outputs + " " + errorMsg;
	} else {
	  testRan++;
	}

	  testCases.addUserTooLong('128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128', 'password', function(errorMsg, failedStatus) {
	    if (failedStatus) {
	      failedTests++;
	      testRan++;
	      outputs = outputs + " " + errorMsg;
	    } else {
	      testRan++;
	    }

	    testCases.addPasswordTooLong('baduser', '128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128128', function(errorMsg, failedStatus) {
	      if (failedStatus) {
		failedTests++;
		testRan++;
		outputs = outputs + " " + errorMsg;
	      } else {
		testRan++;
	      }

	      testCases.loginSuccess('user', 'password', function(errorMsg, failedStatus) {
		if (failedStatus) {
		  failedTests++;
		  testRan++;
		  outputs = outputs + " " + errorMsg;
		} else {
		  testRan++;
		}

		testCases.loginDoesntExist('userpoop', 'password', function(errorMsg, failedStatus) {
		  if (failedStatus) {
		    failedTests++;
		    testRan++;
		    outputs = outputs + " " + errorMsg;
		  } else {
		    testRan++;
		  }
		
		  testCases.loginBadPassword('user', 'badpassword', function(errorMsg, failedStatus) {
		    if (failedStatus) {
		      failedTests++;
		      testRan++;
		      outputs = outputs + " " + errorMsg;
		    } else {
		      testRan++;
		    }
		    
		    testCases.loginSuccessAgain('user', 'password', function(errorMsg, failedStatus) {
		      if (failedStatus) {
			failedTests++;
			testRan++;
			outputs = outputs + " " + errorMsg;
		      } else {
			testRan++;
		      }
		      
		      testCases.resetDatabase(function(errorMsg, failedStatus) {
			if (failedStatus) {
			  failedTests++;
			  testRan++;
			  outputs = outputs + " " + errorMsg;
			} else {
			  testRan++;
			}
			
			callback(testRan, failedTests, outputs);
			
		      });
		    });
		  });
		});
	      });
	    });
	  });
	});
      });
    });
  };

exports.testCases = TestCases;
