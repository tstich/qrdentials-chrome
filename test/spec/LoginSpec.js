// IMPORTANT: The form in the html to be tested needs to be inside a <div>, otherwise the test framework doesn't work!

describe("Parse Login Pages", function() {
  jasmine.getFixtures().fixturesPath = 'pages/';

  it("Kabel Deutschland", function() {
    var root = readFixtures('www.kabeldeutschland.de_portal.html');

    var loginForm = new LoginForm();
    loginForm.find(root);

    expect( loginForm.passwordForm.attr('loginspec')).toBe('form');
    expect( loginForm.passwordFields.attr('loginspec') ).toBe('password');
    expect( loginForm.usernameField.attr('loginspec') ).toBe('user');
    expect( loginForm.submitButton.attr('loginspec') ).toBe('submit');
  });

  it("Comdirect", function() {
    var root = readFixtures('kunde.comdirect.de_lp_wt_login.html');

    var loginForm = new LoginForm();
    loginForm.find(root);

    expect( loginForm.passwordForm.attr('loginspec')).toBe('form');
    expect( loginForm.passwordFields.attr('loginspec') ).toBe('password');
    expect( loginForm.usernameField.attr('loginspec') ).toBe('user');
    expect( loginForm.submitButton.prop('tagName') ).toBe('FORM');
  });

  it("DKB", function() {
    var root = readFixtures('banking.dkb.de_dkb_-.html');

    var loginForm = new LoginForm();
    loginForm.find(root);

    expect( loginForm.passwordForm.attr('loginspec')).toBe('form');
    expect( loginForm.passwordFields.attr('loginspec') ).toBe('password');
    expect( loginForm.usernameField.attr('loginspec') ).toBe('user');
    expect( loginForm.submitButton.attr('loginspec') ).toBe('submit');
  });

  it("Amazon", function() {
    var root = readFixtures('amazon.de_ap_sigin.html');

    var loginForm = new LoginForm();
    loginForm.find(root);

    expect( loginForm.passwordForm.attr('loginspec')).toBe('form');
    expect( loginForm.passwordFields.attr('loginspec') ).toBe('password');
    expect( loginForm.usernameField.attr('loginspec') ).toBe('user');
    expect( loginForm.submitButton.prop('tagName') ).toBe('FORM');
  });


  it("Schwab", function() {
    var root = readFixtures('www.schwab.com_public_eac_home.html');

    var loginForm = new LoginForm();
    loginForm.find(root);

    expect( loginForm.passwordForm.attr('loginspec')).toBe('form');
    expect( loginForm.passwordFields.attr('loginspec') ).toBe('password');
    expect( loginForm.usernameField.attr('loginspec') ).toBe('user');
    expect( loginForm.submitButton.prop('tagName') ).toBe('FORM');
  });

  it("NVIDIA Developer", function() {
    var root = readFixtures('developer.nvidia.com_user_login.html');

    var loginForm = new LoginForm();
    loginForm.find(root);

    expect( loginForm.passwordForm.attr('loginspec')).toBe('form');
    expect( loginForm.passwordFields.attr('loginspec') ).toBe('password');
    expect( loginForm.usernameField.attr('loginspec') ).toBe('user');
    expect( loginForm.submitButton.attr('loginspec') ).toBe('submit');
  });

  it("Commerzbank", function() {
    var root = readFixtures('www.commerzbanking.de.html');

    var loginForm = new LoginForm();
    loginForm.find(root);

    expect( loginForm.passwordForm.attr('loginspec')).toBe('form');
    expect( loginForm.passwordFields.attr('loginspec') ).toBe('password');
    expect( loginForm.usernameField.attr('loginspec') ).toBe('user');
    expect( loginForm.submitButton.attr('loginspec') ).toBe('submit');
  });

  it("AAB", function() {
    var root = readFixtures('akp.aab.de.html');

    var loginForm = new LoginForm();
    loginForm.find(root);

    expect( loginForm.passwordForm.attr('loginspec')).toBe('form');
    expect( loginForm.passwordFields.attr('loginspec') ).toBe('password');
    expect( loginForm.usernameField.attr('loginspec') ).toBe('user');
    expect( loginForm.submitButton.attr('loginspec') ).toBe('submit');
  });

  it("Github", function() {
    var root = readFixtures('github.com_login.html');

    var loginForm = new LoginForm();
    loginForm.find(root);

    expect( loginForm.passwordForm.attr('loginspec')).toBe('form');
    expect( loginForm.passwordFields.attr('loginspec') ).toBe('password');
    expect( loginForm.usernameField.attr('loginspec') ).toBe('user');
    expect( loginForm.submitButton.attr('loginspec') ).toBe('submit');
  });

  it("Facebook", function() {
    var root = readFixtures('www.facebook.com.html');

    var loginForm = new LoginForm();
    loginForm.find(root);

    expect( loginForm.passwordForm.attr('loginspec')).toBe('form');
    expect( loginForm.passwordFields.attr('loginspec') ).toBe('password');
    expect( loginForm.usernameField.attr('loginspec') ).toBe('user');
    expect( loginForm.submitButton.attr('loginspec') ).toBe('submit');
  });


});