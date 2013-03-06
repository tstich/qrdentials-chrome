var usernameField = null;
var passwordFields = [];
var frameHasLogin;

function parentForm(element) {
	var form = element;
	while(form && form.tagName != 'FORM') {
		form = form.parentNode;
	}
	return form;
}

function triggerLogin(element) {
	var form = parentForm();
	if( form ) {
		form.submit();		
		return;
	} 

	var buttons = document.getElementsByTagName('button');
	if( buttons.length == 1) {
		buttons[0].click();
		return
	}	
}

function findLoginInDocument(doc) {
	var inputFields = doc.getElementsByTagName('input');
	var passwordIdx = -1;

	for (var i =0; i < inputFields.length; i++) {
		if( inputFields[i].getAttribute("type") == "password") {
			passwordIdx = i;
			passwordFields.push( inputFields[i] );
		}
	}

	if( passwordFields.length == 1 ) {
		for (var i = passwordIdx-1; i >= 0; i--) {
			var type = inputFields[i].getAttribute("type");
			if( type != "hidden" &&  type != "radio" ) {
				usernameField = inputFields[i];
				break;
			}
		}
	} 
}

chrome.extension.onMessage.addListener(function(message, sender, response) 
{
	if( message.type == 'page_type' ) {
		var type = 'n'; // Non-Login
		if( passwordFields.length == 1 ) {
			type = 'l'; // Login
		}
		if( passwordFields.length > 1 ) {
			type = 'c'; // Change Password
		}
		response(type);
	}

	if( message.type == 'l' ) {
		// Login
		if( usernameField ) {
			usernameField.value = message.username;
		}
		passwordFields[0].value = message.password;
		
		triggerLogin(passwordFields[0]);
	}

	if( message.type == 'c' ) {
		// Change Password
		passwordFields[0].value = message.old_password;
		passwordFields[1].value = message.new_password;
		if( passwordFields.length > 2 ) {
			// Repeat New Password
			passwordFields[2].value = message.new_password;
		}

		triggerLogin(passwordFields[0]);
	}

});


// Search for login
findLoginInDocument(document);

if( passwordFields.length > 0 ) {
	//Signal Backend to enable the page action
	chrome.extension.sendMessage({type:'enablePageAction'}, function() {});
}

