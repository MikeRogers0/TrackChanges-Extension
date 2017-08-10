chrome.devtools.panels.create("ChangesDiff",
  "images/logo.png",
  "lib/panel.html",
  function(panel) {}
);

chrome.extension.sendMessage( { action: "devtools-opened", tabID: chrome.devtools.inspectedWindow.tabId } );
