var baseURL = 'http://api.qrdentials.com:8080/iDentityServlet/';
var pollPolicy = null;
var startTime = 0;
var url;

function create_qrcode(text) {
	var qr = qrcode(6, 'M'); // 864 Bits max, see http://blog.qr4.nl/page/QR-Code-Data-Capacity.aspx
	qr.addData(text);
	qr.make();
	return qr.createImgTag(4);
};

function delete_cookie(next) {
    chrome.cookies.remove({url:baseURL,name:'JSESSIONID'}, function(cookie) {
	    next();
    });
}


function setup_popup(withSession) {
	var urlParts = chrome.extension.getBackgroundPage().selectedURL.split('/');
	var url = urlParts[0] + '//' + urlParts[2];

	if( withSession ) {
	    chrome.cookies.get({url:baseURL,name:'JSESSIONID'}, function(cookie) {
		    var sessionID = cookie.value;
			//document.getElementById('qr').innerHTML = 'Random: ' + chrome.extension.getBackgroundPage().randomKey();
			document.getElementById('qr').innerHTML = create_qrcode(url + '?s=' + sessionID + '&k=' + chrome.extension.getBackgroundPage().randomKey());
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
					chrome.extension.getBackgroundPage().login(binaryResponse);
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
	newCommand.open('GET', baseURL + 'new.json?url=dummy', true);
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
	delete_cookie(new_command);
});