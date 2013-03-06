chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.type == 'enablePageAction' ) {
      chrome.pageAction.show(sender.tab.id);
    }
});
