function LoginForm() {

	var passwordForm;
	var passwordFields;
	var usernameField;
	var submitButton;

	this.find = function(root) {
	// Search for login
	this.passwordForm = $(root).find("form:has(:password):first");
 
	if( this.passwordForm.length > 0 ) {
  		this.passwordFields = this.passwordForm.find(":password");
  
	  if( this.passwordFields.length == 1 ) {
  		 this.usernameField = this.passwordForm.find(":text:first");
  		 if( this.usernameField.length == 0 ) {
  		 	this.usernameField = this.passwordForm.find(":input").filter("[type=email]").first();
  		 }
 		}

 		this.submitButton = this.passwordForm.find(":submit");
  		 if( this.submitButton.length == 0 ) {
  		 	this.submitButton = this.passwordForm.find(":input").not("[type=radio]").filter("[onclick]").last();
  		 }
       if( this.submitButton.length == 0 ) {
        this.submitButton = this.passwordForm;
       }
	 }
  }

  this.submit = function() {
    if( this.submitButton.is("input")) {
      this.submitButton.click();
    }

    if( this.submitButton.is("form") ) {
      this.submitButton.submit();
    } 

  }

}
