var baseURL = 'http://api.qrdentials.com:8080/iDentityServlet/';
var pollPolicy = null;
var startTime = 0;
var selectedTab = null;
var keyWords = null;

function create_qrcode(text) {
	var qr = qrcode(6, 'M'); // 864 Bits max, see http://blog.qr4.nl/page/QR-Code-Data-Capacity.aspx
	qr.addData(text);
	qr.make();
	return qr.createImgTag(4);
}

function delete_cookie(next) {
    chrome.cookies.remove({url:baseURL,name:'JSESSIONID'}, function(cookie) {
	    next();
    });
}

function get_tab(next) {
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  		selectedTab = tabs[0];
  		next();
	});
}

function Uint8ArrayToCryptoWords(srcArray) {
  var words = [];
  var wordLength = 0;
  for (var i = 0; i < srcArray.length; i = i + 4) {
    words[wordLength] = (srcArray[i] << 24) | (srcArray[i+1] << 16) | (srcArray[i+2] << 8) | (srcArray[i+3]);
    wordLength = wordLength + 1;
  };
  return CryptoJS.lib.WordArray.create(words, srcArray.length);
}

function randomKey() {
  var keyBytes = new Uint8Array(16);
  window.crypto.getRandomValues(keyBytes);
  return Uint8ArrayToCryptoWords(keyBytes);
}

function login(binaryResponse) {
  // Decrypt
  var cypherWords = Uint8ArrayToCryptoWords(binaryResponse);
  var iv  = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');

  var decryptedWords = CryptoJS.AES.decrypt(CryptoJS.enc.Base64.stringify(cypherWords), keyWords, { iv: iv });
  var decryptedText = CryptoJS.enc.Utf8.stringify(decryptedWords);

  // Send credentials to content script
  var credentials = JSON.parse(decryptedText);
  chrome.tabs.sendMessage(selectedTab.id, credentials, function() {});
}

function setup_popup(withSession) {
	var urlParts = selectedTab.url.split('/');
	var url = urlParts[0] + '//' + urlParts[2];

	if( withSession ) {
	    chrome.cookies.get({url:baseURL,name:'JSESSIONID'}, function(cookie) {
		    var sessionID = cookie.value;
		    keyWords = randomKey();
		    var qrMessage = url + '?s=' + sessionID + '&k=' + CryptoJS.enc.Hex.stringify(keyWords);
			//document.getElementById('qr').innerHTML = qrMessage;
			document.getElementById('qr').innerHTML = create_qrcode(qrMessage);
	    });		
	} else {
		//document.getElementById('qr').innerHTML = 'QRData: ' + url + withSession;
		document.getElementById('qr').innerHTML = create_qrcode(url);
	}
}

function poll_command() {
	var now = new Date().getTime();
	var msRemaining = pollPolicy.duration - (now - startTime);
	$( "#progressbar" ).progressbar( "option", "value", msRemaining);
	
	if(msRemaining > 0) {
		var pollCommand = new XMLHttpRequest();
		pollCommand.open('GET', baseURL + 'poll.json', true);
		pollCommand.responseType = 'arraybuffer';
		pollCommand.onload = function(e) {
			if( pollCommand.status == 200) {
				var arraybuffer = pollCommand.response;
				if( arraybuffer ) {
					var binaryResponse = new Uint8Array(arraybuffer);
					login(binaryResponse);
					delete_cookie(window.close);
				} else {
					setTimeout(poll_command, pollPolicy.interval);
				}
			} 
		};
		pollCommand.send();	
	} else {
		delete_cookie(window.close);
	}
}

function new_command() {
	var newCommand = new XMLHttpRequest();
	newCommand.open('GET', baseURL + 'new.json?url=' + encodeURIComponent(selectedTab.url), true);
	newCommand.onreadystatechange =  function() {
		if( newCommand.readyState == 4 ) {
			// Got Response From Server
			setup_popup(newCommand.status == 200);

			if( newCommand.status == 200 ) {
				pollPolicy = JSON.parse(newCommand.responseText);
				startTime = new Date().getTime();
				$(function() {
			    $( "#progressbar" ).progressbar({
	    			value: pollPolicy.duration, max:pollPolicy.duration
	  				});
				});
				setTimeout(poll_command, pollPolicy.first);				
			}
		} 
	};
	newCommand.send();
};


document.addEventListener('DOMContentLoaded', function() {
	delete_cookie(get_tab(new_command));
});