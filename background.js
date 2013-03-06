
var selectedURL = null;
var selectedTab = null;
var lastKey = null;

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
  var keyWords = Uint8ArrayToCryptoWords(keyBytes);
  lastKey = CryptoJS.enc.Hex.stringify(keyWords);
  return lastKey;
}

function login(binaryResponse) {
  // Decrypt
  var cypherWords = Uint8ArrayToCryptoWords(binaryResponse);
  var key = CryptoJS.enc.Hex.parse(lastKey);
  var iv  = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');

  var decryptedWords = CryptoJS.AES.decrypt(CryptoJS.enc.Base64.stringify(cypherWords), key, { iv: iv });
  var decryptedText = CryptoJS.enc.Utf8.stringify(decryptedWords);

  // Send credentials to content script
  var credentials = JSON.parse(decryptedText);
  chrome.tabs.sendMessage(selectedTab, credentials, function() {});
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( sender.tab ) {
      selectedTab = sender.tab.id;
      selectedURL = sender.tab.url;
      chrome.pageAction.show(sender.tab.id);
    }
});
