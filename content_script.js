// Search for login
var passwordForm = $("form:has(:password:visible):first");
var passwordFields;
var usernameField;

if( passwordForm.length > 0 ) {
  passwordFields = passwordForm.find(":password:visible");
  passwordFields.css("background","red");
  
  if( passwordFields.length == 1 ) {
   usernameField = passwordForm.find(":text:visible:first");
   usernameField.css("background","green");
  }

  //Signal Backend to enable the page action
  chrome.extension.sendMessage({type:'enablePageAction'}, function() {});
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
		usernameField.val( message.username );
		passwordFields.val( message.password );

		passwordForm.submit();
	}

	if( message.type == 'c' ) {
		// Change Password
   		passwordInputs.eq(0).val(message.old_password);
   		passwordInputs.slice(1,3).val(message.new_password);

		passwordForm.submit();
	}

});



