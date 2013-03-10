var loginForm = new LoginForm();

loginForm.find('*');

if( loginForm.passwordForm.length == 1) {

  loginForm.passwordFields.css('background', 'red');
  loginForm.usernameField.css('background', 'green');

  //Signal Backend to enable the page action
  chrome.extension.sendMessage({type:'enablePageAction'}, function() {});	
}

chrome.extension.onMessage.addListener(function(message, sender, response) 
{
	if( message.type == 'page_type' ) {
		var type = 'n'; // Non-Login
		if( loginForm.passwordFields.length == 1 ) {
			type = 'l'; // Login
		}
		if( loginForm.passwordFields.length > 1 ) {
			type = 'c'; // Change Password
		}
		response(type);
	}

	if( message.type == 'l' ) {
		// Login
		loginForm.usernameField.val( message.username );
		loginForm.passwordFields.val( message.password );

		loginForm.submit();
	}

	if( message.type == 'c' ) {
		// Change Password
   		loginForm.passwordInputs.eq(0).val(message.old_password);
   		loginForm.passwordInputs.slice(1,3).val(message.new_password);

		loginForm.submit();
	}

});



