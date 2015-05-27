// JavaScript Document

//INIT DEVICE LISTENERS
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() 
{
	//PhoneGap Fix IOS Status Bar issue
    StatusBar.overlaysWebView(false);
	//setTimeout(function(){navigator.splashscreen.hide();}, 2000);
}

document.addEventListener("offline", alertWhenDeviceOffline, false);
function alertWhenDeviceOffline() 
{
	alert("An active internet connection is required to run this app. You will not be able to log in. Please check your network settings.");
}

//JQUERY READY
$(document).ready(jqueryReady);
function jqueryReady()
{
	Parse.initialize("wDt9OLZ6CA2CkN59jg58yz4XQfyDQQqCt3NmQ8Aa", "LMZR1EmXHSBQXjefMNosV54x8XpAxpvfqloJulYd");
	initEnterButton();
}

//IN APP BROWSER FUNCTIONS
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

//CORE FUNCTIONS

//Login
function loginUser() {
	Parse.User.logIn($("#loguname").val(), $("#logpassword").val(), 
	{
	  success: function(user) 
	  {
		window.location = "home.html";
	  },
		  
	  error: function(user, error) 
	  {
		if (error.code === 101) 
		{
			alert("Invalid username or password. Please try again!");
		} 
		else 
		{
			alert("Error: " + error.code + " " + error.message);
		}
	  }
	});
}

//Register
function registerUser()
{
	if ($("#cpassword").val() === $("#password").val() || $("#password").val() === $("#cpassword").val()) 
	{
		var user = new Parse.User();
		user.set("fname", $("#fname").val());
		user.set("lname", $("#lname").val());
		user.set("email", $("#email").val());
		user.set("username", $("#uname").val());
		user.set("password", $("#password").val());
		  
		user.signUp(null, {
		  success: function(user) {
			alert("Your info has been saved. Please check your email and verify it.");
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
	} 
	else 
	{
		alert("Passwords do not match.");
	}
}

function forgotPassword() 
{
	Parse.User.requestPasswordReset($("#femail").val(), 
	{
	  success: function() 
	  {
	 	alert("Please check your email for further instructions. Redirecting to login page...");
		window.location = "index.html";
	  },
	  error: function(error) 
	  {
		// Show the error message somewhere
		if (error.code === 205) 
		{
			alert("Sorry! That email is not in my database. Please try a different one.");
		} 
		else 
		{
			alert("Error: " + error.code + " " + error.message);
		}
	  }
	});
}

function logoutUser() 
{
	Parse.User.logOut();
	alert("Logged out!");
	window.location = "index.html";
}

//VALID LOG IN CHECK
function checkForLoggedInUser() 
{
	var currentUser = Parse.User.current();
	
	if (currentUser) 
	{
		window.location = "home.html";
	}
}

function checkForLoggedInUserOnMainPage() 
{
	var loggedInUser = Parse.User.current();
	
	if (!loggedInUser) 
	{
		alert("Please Login First.");
		window.location = "index.html";
	}
}

//CREATE MESSAGE
function createMessageObject() 
{
	var Message = Parse.Object.extend("Message");
	var userMessage = new Message();
	
	userMessage.set("for", $("#to").val());
	userMessage.set("from", Parse.User.current().getUsername());
	userMessage.set("customID", makeID(16))
	userMessage.set("content", $("#message").val());
	
	userMessage.save();
	
	setTimeout(function () {window.location = 'home.html'}, 2500);
	Materialize.toast('Message Sent!', 2000) // 4000 is the duration of the toast
}

//CREATE REPLY MESSAGE
function createReplyMessageObject() 
{
	var replyTo;
	var Message = Parse.Object.extend("Message");
	var query = new Parse.Query(Message);
	query.equalTo("for", Parse.User.current().getUsername());
	query.find({
	  success: function(results) 
	  {
		if (results.length > 0)	
		{
			for (var i = 0; i < results.length; i++)
			{ 
			  var object = results[i];
			  
			  replyTo = object.get('from');
			}
			
			var Message = Parse.Object.extend("Message");
			var userMessage = new Message();
			
			userMessage.set("for", replyTo);
			userMessage.set("from", Parse.User.current().getUsername());
			userMessage.set("customID", makeID(16))
			userMessage.set("content", $("#messageReply").val());
			
			userMessage.save();
		}
	  },
	  error: function(error) 
	  {
		alert("Error: " + error.code + " " + error.message);
	  }
	});
	
	//setTimeout(function () {window.location = 'home.html'}, 2500);
	Materialize.toast('Message Sent!', 2000) // 4000 is the duration of the toast
}


//QUERY MESSAGES ON HOME PAGE
function queryMessages()
{
	var Message = Parse.Object.extend("Message");
	var query = new Parse.Query(Message);
	query.descending("createdAt");
	query.equalTo("for", Parse.User.current().getUsername());
	query.find({
	  success: function(results) 
	  {
		if (results.length > 0)	
		{
			var myOutput = "";
			myOutput += "<ul style=\"padding-top:5px;\" class=\"collection\">";
			
			// Do something with the returned Parse.Object values
			for (var i = 0; i < results.length; i++)
			{ 
			  var object = results[i];
			  
			  myOutput += "<li class=\"collection-item avatar\"><div>"
			  + "<img onClick=\"$('#modal1').openModal()\" id=\"avatarImg\" src=\"" 
			  + checkImageAvatar(object.get('from')) 
			  + "\" alt=\"\" class=\"circle\">"
			  + "<span onClick=\"$('#modal1').openModal()\" class=\"title\">From: " + object.get('from') + "</span>"
			  +	"<p onClick=\"$('#modal1').openModal()\">Content: " + object.get('content') + "</p>"
			  +	"<p onClick=\"$('#modal1').openModal()\"><b>Tap Here to Reply</b></p>"
			  + "<a href=\"#!\" id=\"" + object.id + "\" onClick=\"deleteMessage(this);\" class=\"secondary-content\"><i id=\"message-delete-button\" class=\"mdi-action-delete\"></i></a></div></li>";
			  //myOutput += "<a class=\"collection-item\" href=\"#!\">" + object.get('content') + "</a>";
			}
			
			myOutput += "</ul>";
			
			//alert(myOutput);
			var messageList = document.getElementById("messageList");
			messageList.innerHTML = myOutput;
		}
		else
		{
			var myOutput = "";
			myOutput += "<ul style=\"padding-top:5px;\" class=\"collection\">"
			+ "<li class=\"collection-item\">You have no messages at this time.</li>"
			+ "</ul>";
			
			var noMessageList = document.getElementById("messageList");
			noMessageList.innerHTML = myOutput;
		}
	  },
	  error: function(error) 
	  {
		alert("Error: " + error.code + " " + error.message);
	  }
	});
	//window.location.reload();
}

//DELETE MESSAGE
function deleteMessage(ele)
{
	var element = ele.id;
	element = element.toString();
	
	var Message = Parse.Object.extend("Message");
	var query = new Parse.Query(Message);
	query.equalTo("for", Parse.User.current().getUsername());
	query.find({
	  success: function(results) 
	  {
		var Message = Parse.Object.extend("Message");
		var query = new Parse.Query(Message);
		  
		query.get(element, {
		  success: function(myObj) {
			// The object was retrieved successfully.
			myObj.destroy();
			location.reload();
		  },
		  error: function(object, error) {
			// The object was not retrieved successfully.
			// error is a Parse.Error with an error code and description.
			alert("Error " + error.code + ": " + error.message);
		  }
		});
	  },
	  error: function(error) 
	  {
		alert("Error: " + error.code + " " + error.message);
	  }
	});
}

//BIND ENTER KEY TO BUTTONS
function initEnterButton()
{
	$('html').bind('keypress', function(e)
	{
	   if(e.keyCode == 13 && window.location.href.indexOf("index.html") > -1) 
	   {
		   $("#loginButton").click();
	   } 
	   else if 
	   (e.keyCode == 13 && window.location.href.indexOf("register.html") > -1) 
	   {
		   $("#registerButton").click();
	   } 
	   else if (e.keyCode == 13 && window.location.href.indexOf("forgot.html") > -1) 
	   {
		   $("#forgotButton").click();
	   } 
	   else if (e.keyCode == 13 && window.location.href.indexOf("new-message.html") > -1) 
	   {
		   return false;
	   }
	});	
}

//UTIL

//Make a random string with any length
function makeID(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i= 0; i < length; i++)
	{
        text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

    return text;
}

//Change message list avatar based on first letter of sending username
function checkImageAvatar(value)
{
	if (value.charAt(0) === 'a' || value.charAt(0) === 'A')
	{
		return "img/alphabet/a.png";
	}
	else if (value.charAt(0) === 'b' || value.charAt(0) === 'B')
	{
		return "img/alphabet/b.png";
	}
	else if (value.charAt(0) === 'c' || value.charAt(0) === 'C')
	{
		return "img/alphabet/c.png";
	}
	else if (value.charAt(0) === 'd' || value.charAt(0) === 'D')
	{
		return "img/alphabet/d.png";
	}
	else if (value.charAt(0) === 'e' || value.charAt(0) === 'E')
	{
		return "img/alphabet/e.png";
	}
	else if (value.charAt(0) === 'f' || value.charAt(0) === 'G')
	{
		return "img/alphabet/g.png";
	}
	else if (value.charAt(0) === 'h' || value.charAt(0) === 'H')
	{
		return "img/alphabet/h.png";
	}
	else if (value.charAt(0) === 'i' || value.charAt(0) === 'I')
	{
		return "img/alphabet/i.png";
	}
	else if (value.charAt(0) === 'j' || value.charAt(0) === 'J')
	{
		return "img/alphabet/j.png";
	}
	else if (value.charAt(0) === 'k' || value.charAt(0) === 'K')
	{
		return "img/alphabet/k.png";
	}
	else if (value.charAt(0) === 'l' || value.charAt(0) === 'L')
	{
		return "img/alphabet/l.png";
	}
	else if (value.charAt(0) === 'm' || value.charAt(0) === 'M')
	{
		return "img/alphabet/m.png";
	}
	else if (value.charAt(0) === 'n' || value.charAt(0) === 'N')
	{
		return "img/alphabet/n.png";
	}
	else if (value.charAt(0) === 'o' || value.charAt(0) === 'O')
	{
		return "img/alphabet/o.png";
	}
	else if (value.charAt(0) === 'p' || value.charAt(0) === 'P')
	{
		return "img/alphabet/p.png";
	}
	else if (value.charAt(0) === 'q' || value.charAt(0) === 'Q')
	{
		return "img/alphabet/q.png";
	}
	else if (value.charAt(0) === 'r' || value.charAt(0) === 'R')
	{
		return "img/alphabet/r.png";
	}
	else if (value.charAt(0) === 's' || value.charAt(0) === 'S')
	{
		return "img/alphabet/s.png";
	}
	else if (value.charAt(0) === 't' || value.charAt(0) === 'T')
	{
		return "img/alphabet/t.png";
	}
	else if (value.charAt(0) === 'u' || value.charAt(0) === 'U')
	{
		return "img/alphabet/u.png";
	}
	else if (value.charAt(0) === 'v' || value.charAt(0) === 'V')
	{
		return "img/alphabet/v.png";
	}
	else if (value.charAt(0) === 'w' || value.charAt(0) === 'W')
	{
		return "img/alphabet/w.png";
	}
	else if (value.charAt(0) === 'x' || value.charAt(0) === 'X')
	{
		return "img/alphabet/x.png";
	}
	else if (value.charAt(0) === 'y' || value.charAt(0) === 'Y')
	{
		return "img/alphabet/y.png";
	}
	else if (value.charAt(0) === 'z' || value.charAt(0) === 'Z')
	{
		return "img/alphabet/z.png";
	}
}













