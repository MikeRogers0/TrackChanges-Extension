import { SnapshotOMatic } from '../../shared/snapshot-o-matic';
import { DelayTask } from '../../shared/delay-task';

// List of tabs with their snapshots
// {
//   123: { // Key is the tabId
//     user_interacted: true, // True when the user has interacted with the devtools on this site.
//     snapshot: { // The Snapshot
//       mhtml: Blob, // Copy of the MHTML of the page. 
//       files: Hash // A copy of the files & their body.
//     }
//   }
// }
window.tabSnapshots = {};

// Used to store events in DelayTask.
window.delayTaskEvents = {}

// Load up the options - These can be updated the options.html & and applied when generating the diff.
window.options = {
  ignore_css_names: 'front-visible|front|lazyloaded|lazyload|fix|animate-in|animate',
  ignore_inline_styles: false,
  ignore_html_attributes: 'data-src|src',
  ignore_html_tag: 'svg|iframe'
}

// Our Stored long running connections.
window.connections = {}

window.namedActions = {
  "devtools-panel-shown": function(tabId){ // Send the initial capture and out current capture down the pipe,
    SnapshotOMatic(tabId).broadcast();
  },
  "devtools-opened": function(tabId){ // Insert our initial capture, unless it's already active. Then mark as being edited.
    DelayTask(tabId).add(() => {
      SnapshotOMatic(tabId).update();
      SnapshotOMatic(tabId).userInteracted();
    });
  },
  "devtools-interacted": function(tabId){ // Mark the tab as being edited.
    SnapshotOMatic(tabId).userInteracted();
  },
  "page-loaded": function(tabId){ // Insert our initial capture
    DelayTask(tabId).add(() => {
      SnapshotOMatic(tabId).insert();
    });
  },
  "page-updated": function(tabId){ // Insert our initial capture, unless it's already active.
    DelayTask(tabId).add(() => {
      SnapshotOMatic(tabId).update();
    });
  },
  "page-unloaded": function(tabId){ // Delete the tab, we don't need it.
    SnapshotOMatic(tabId).clear();
  },
};

function chromeMessageHandler(request, sender={}, sendResponse={}){
  var tabId = request.tabId || sender.tab.id;
  console.log("onMessage: " + request.action + " ("+ tabId +")");

  if( tabId <= 0 ) { return; }

  if( typeof(window.namedActions[request.action]) != 'undefined' ){
    window.namedActions[request.action](tabId);
  }
};

chrome.extension.onMessage.addListener(chromeMessageHandler);

// On start up capture all opens tabs.
chrome.tabs.query({ "status": "complete" }, function(tabs){
  for(var i in tabs){
    var tabId = tabs[i].id;
    chromeMessageHandler({ action: "page-loaded", tabId: tabId })
  }
});

chrome.runtime.onConnect.addListener(function (port) {

  var extensionListener = function (message, sender, sendResponse) {

    // When the panel tab is shown, send the latest version of the page to them.
    if (message.name == "init" && message.tabId !== null) {
      window.connections[message.tabId] = port;
      chromeMessageHandler({ action: "devtools-panel-shown", tabId: message.tabId })
      return;
    }
  }

  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(extensionListener);

  port.onDisconnect.addListener(function(port) {
    port.onMessage.removeListener(extensionListener);

    var tabs = Object.keys(connections);
    for (var i=0, len=tabs.length; i < len; i++) {
      if (window.connections[tabs[i]] == port) {
        delete window.connections[tabs[i]]
        break;
      }
    }
  });
});

chrome.browserAction.onClicked.addListener(function(tab) {
  alert("Open inspector, change something, click 'TrackChanges' then create summary :)");
});
