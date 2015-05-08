// JavaScript Document

//PhoneGap Device ready
document.addEventListener("deviceready", onDeviceReady, false);

$(document).ready(jqueryReady);

function onDeviceReady() 
{
	//PhoneGap Fix IOS Status Bar issue
    StatusBar.overlaysWebView(false);
	//setTimeout(function(){navigator.splashscreen.hide();}, 2000);
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