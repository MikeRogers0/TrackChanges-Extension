chrome.devtools.panels.create("ChangesDiff",
  "images/logo.png",
  "lib/panel.html",
  function(panel) { 
    panel.onShown.addListener(function(){
      //chrome.devtools.inspectedWindow.tabId
      //alert("Check me out");
    });
  }
);

// Send a message to the background.js to snapshot the tab.
chrome.runtime.sendMessage( { action: "devtools-opened", tabID: chrome.devtools.inspectedWindow.tabId } );
