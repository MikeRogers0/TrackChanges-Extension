chrome.devtools.panels.create("TrackChanges",
  "images/logo.png",
  "lib/panel.html",
  function(panel) {
    panel.onShown.addListener(function(){
      chrome.extension.sendMessage( { action: "devtools-panel-shown", tabId: chrome.devtools.inspectedWindow.tabId } );
    });

    panel.onHidden.addListener(function(){
      chrome.extension.sendMessage( { action: "devtools-interacted", tabId: chrome.devtools.inspectedWindow.tabId } );
    });
  }
);

//chrome.devtools.createStatusBarButton("images/logo.png", "TrackChanges", false);

chrome.devtools.panels.elements.onSelectionChanged.addListener(function(){
  chrome.extension.sendMessage( { action: "devtools-interacted", tabId: chrome.devtools.inspectedWindow.tabId } );
});

//chrome.devtools.panels.elements.createSidebarPane("TrackChanges", function(sidebar) {
  //sidebar.setPage("lib/sidebar-pane.html");
//});

chrome.extension.sendMessage( { action: "devtools-opened", tabId: chrome.devtools.inspectedWindow.tabId } );
