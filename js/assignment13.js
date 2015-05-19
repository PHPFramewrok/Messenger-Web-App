// JavaScript Document

//PhoneGap Device ready
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("offline", alertWhenDeviceOffline, false);

$(document).ready(jqueryReady);

function onDeviceReady() 
{
	//PhoneGap Fix IOS Status Bar issue
    StatusBar.overlaysWebView(false);
	//setTimeout(function(){navigator.splashscreen.hide();}, 2000);
}

function alertWhenDeviceOffline() {
	alert("An active internet connection is required to run this app. You will not be able to log in. Please check your network settings.");
}

function openSystemBrowser(urlString)
{
	var myURL = encodeURI(urlString);
	window.open(myURL, '_system');
}

function openInAppBroswer(urlString)
{
	var myURL = encodeURI(urlString);
	window.open(myURL, '_self');
}

function jqueryReady()
{
	Parse.initialize("wDt9OLZ6CA2CkN59jg58yz4XQfyDQQqCt3NmQ8Aa", "LMZR1EmXHSBQXjefMNosV54x8XpAxpvfqloJulYd");
	initEnterButton();
}

function checkForLoggedInUser() {
	var currentUser = Parse.User.current();
	
	if (currentUser) {
		window.location = "home.html";
	}
}

function checkForLoggedInUserOnMainPage() {
	var loggedInUser = Parse.User.current();
	
	if (!loggedInUser) {
		alert("Please Login First.");
		window.location = "index.html";
	}
}

function registerUser()
{
	if ($("#cpassword").val() === $("#password").val() || $("#password").val() === $("#cpassword").val()) {
		var user = new Parse.User();
		user.set("fname", $("#fname").val());
		user.set("lname", $("#lname").val());
		user.set("email", $("#email").val());
		user.set("username", $("#uname").val());
		user.set("password", $("#password").val());
		  
		user.signUp(null, {
		  success: function(user) {
			window.location = "home.html";
		  },
		  error: function(user, error) {
			// Show the error message somewhere and let the user try again.
			if (error.code === -1) {
				alert("Please make sure all fields are filled out.");
			} else if (error.code === 202) {
				alert("Username already taken.");
			} else if (error.code === 203) {
				alert("Email already taken.");
			} else {
				alert("Error: " + error.code + " " + error.message);
			}
		  }
		});
	} else {
		alert("Passwords do not match.");
	}
}

function loginUser() {
	Parse.User.logIn($("#loguname").val(), $("#logpassword").val(), {
	  success: function(user) {
		window.location = "home.html";
	  },
	  error: function(user, error) {
		if (error.code === 101) {
			alert("Invalid username or password. Please try again!");
		} else {
			alert("Error: " + error.code + " " + error.message);
		}
	  }
	});
}

function createMessageObject() {
	
	var Message = Parse.Object.extend("Message");
	var userMessage = new Message();
	
	userMessage.set("for", $("#to").val());
	userMessage.set("content", $("#message").val());
	
	userMessage.save();
	
	window.location = 'home.html';
}

function logoutUser() {
	Parse.User.logOut();
	alert("Logged out!");
	window.location = "index.html";
}

function forgotPassword() {
	Parse.User.requestPasswordReset($("#femail").val(), {
	  success: function() {
	 	alert("Please check your email for further instructions. Redirecting to login page...");
		window.location = "index.html";
	  },
	  error: function(error) {
		// Show the error message somewhere
		if (error.code === 205) {
			alert("Sorry! That email is not in my database. Please try a different one.");
		} else {
			alert("Error: " + error.code + " " + error.message);
		}
	  }
	});
}

function queryMessages()
{
	var Message = Parse.Object.extend("Message");
	var query = new Parse.Query(Message);
	query.equalTo("for", Parse.User.current().getUsername());
	query.find({
	  success: function(results) {
		var myOutput = "";
		myOutput += "<ul class=\"collection with-header\">" + 
		"<li class=\"collection-header\"><h4>My Messages</h4></li>";
		
		// Do something with the returned Parse.Object values
		for (var i = 0; i < results.length; i++) { 
		  var object = results[i];
		  
		  myOutput += "<a class=\"collection-item\" href=\"#!\">" + object.get('content') + "</a>";
		}
		
		myOutput += "</ul>";
		
		//alert(myOutput);
		var messageList = document.getElementById("messageList");
		messageList.innerHTML = myOutput;
	  },
	  error: function(error) {
		alert("Error: " + error.code + " " + error.message);
	  }
	});
	//window.location.reload();
}

function initEnterButton() {
	$('html').bind('keypress', function(e)
	{
	   if(e.keyCode == 13 && window.location.href.indexOf("index.html") > -1) {
		   $("#loginButton").click();
	   } else if (e.keyCode == 13 && window.location.href.indexOf("register.html") > -1) {
		   $("#registerButton").click();
	   } else if (e.keyCode == 13 && window.location.href.indexOf("forgot.html") > -1) {
		   $("#forgotButton").click();
	   } else if (e.keyCode == 13 && window.location.href.indexOf("new-message.html") > -1) {
		   return false;
	   }
	});	
}