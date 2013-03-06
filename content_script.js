var usernameField;
var passwordField;
var frameHasLogin;

function parentForm(element) {
	var form = element;
	while(form && form.tagName != 'FORM') {
		form = form.parentNode;
	}
	return form;
}

function findLoginInDocument(doc) {
	var inputFields = doc.getElementsByTagName('input');
	var passwordIdx = -1;

	for (var i =0; i < inputFields.length; i++) {
		if( inputFields[i].getAttribute("type") == "password") {
			passwordIdx = i;
			passwordField = inputFields[i];
			break;
		}
	}

	if( passwordIdx > 0 ) {
		for (var i = passwordIdx-1; i >= 0; i--) {
			var type = inputFields[i].getAttribute("type");
			if( type != "hidden" &&  type != "radio" ) {
				usernameField = inputFields[i];
				break;
			}
		}
		return true;
	} 
	return false;
}

chrome.extension.onMessage.addListener(function(credentials, sender, response) 
{
	usernameField.value = credentials.username;
	passwordField.value = credentials.password;

	// Try to log in directly
	var form = parentForm( passwordField );
	if( form ) {
		form.submit();		
		return;
	} 

	var buttons = document.getElementsByTagName('button');
	if( buttons.length == 1) {
		buttons[0].click();
		return
	}

});


// Search for login
frameHasLogin = findLoginInDocument(document);

if( frameHasLogin ) {
	//Signal Backend we have found a Login
	chrome.extension.sendMessage({message:"loginFound"}, function() {});
}

