describe("Parse Login Pages", function() {
  jasmine.getFixtures().fixturesPath = 'pages/';

  it("Kabel Deutschland", function() {
    var root = readFixtures('www.kabeldeutschland.de_portal.html');

    var passwordForm = $(root).find("form:has(:password):first");

    expect(passwordForm.length).toBe(1);
    expect(passwordForm.attr('loginspec')).toBe('form');


    var passwordFields = passwordForm.find(":password");
    
    expect( passwordFields.length ).toBe(1);
    expect( passwordFields.attr('loginspec') ).toBe('password');

    var usernameField = passwordForm.find(":text:first");
    
    expect( usernameField.length ).toBe(1);
    expect( usernameField.attr('loginspec') ).toBe('user');
  });

});