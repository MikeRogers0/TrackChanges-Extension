chrome.devtools.panels.create("ChangesDiff",
  "images/logo.png",
  "lib/panel.html",
  function(panel) {
    panel.onShown.addListener(function(){
      chrome.extension.sendMessage( { action: "devtools-shown", tabID: chrome.devtools.inspectedWindow.tabId } );
    });
  }
);

chrome.extension.sendMessage( { action: "devtools-opened", tabID: chrome.devtools.inspectedWindow.tabId } );
