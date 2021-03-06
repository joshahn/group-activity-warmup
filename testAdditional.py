import unittest
import os
import testLib

SUCCESS               =   1  # : a success
ERR_BAD_CREDENTIALS   =  -1  # : (for login only) cannot find the user/password pair in the database
ERR_USER_EXISTS       =  -2  # : (for add only) trying to add a user that already exists
ERR_BAD_USERNAME      =  -3  # : (for add, or login) invalid user name (only empty string is invalid for now)
ERR_BAD_PASSWORD      =  -4


class TestAddingUser(testLib.RestTestCase):
    """Test adding users"""
    def assertResponse(self, respData, count = 1, errCode = testLib.RestTestCase.SUCCESS):
        """
        Check that the response data dictionary matches the expected values
        """
        expected = { 'errCode' : errCode }
        if count is not None:
            expected['count']  = count
        self.assertDictEqual(expected, respData)

    def testAddUser1(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        self.assertResponse(respData, count = 1)

    def testAddUser2(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'user' : 'user2', 'password' : 'password2'} )
        self.assertResponse(respData, count = 1)

class TestLoginUser(testLib.RestTestCase):
    """Test adding users"""
    def assertResponse(self, respData, count = 1, errCode = testLib.RestTestCase.SUCCESS):
        """
        Check that the response data dictionary matches the expected values
        """
        expected = { 'errCode' : errCode }
        if count is not None:
            expected['count']  = count
        self.assertDictEqual(expected, respData)

    def testLoginUser1(self):
	self.makeRequest("/users/add", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        self.assertResponse(respData, count = 2)

    def testLoginUser2(self):
	self.makeRequest("/users/add", method="POST", data = { 'user' : 'user2', 'password' : 'password2'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user2', 'password' : 'password2'} )
        self.assertResponse(respData, count = 2)

    def testLoginFailUser1(self):
	self.makeRequest("/users/add", method="POST", data = { 'user' : 'user1', 'password' : 'password'} )
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user1', 'password' : 'password2'} )
        self.assertResponse(respData, count = None, errCode = ERR_BAD_CREDENTIALS)

    def testLoginFailUser2(self):
        respData = self.makeRequest("/users/login", method="POST", data = { 'user' : 'user2', 'password' : 'password1'} )
        self.assertResponse(respData, count = None, errCode = ERR_BAD_CREDENTIALS)
