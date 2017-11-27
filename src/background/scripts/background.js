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
window.trackingTabs = {};

// Used to store events in DelayTask.
window.delayTaskEvents = {};

// Our Stored long running connections.
window.connections = {};

// Run a callback if the tab is active - stops background task killing the CPU.
function tabIsActive(tabId, callback) {
  chrome.tabs.query({
    active: true
  }, function(tabs) {
    chrome.tabs.query({
      active: true
    }, function(tabs) {
      tabs.forEach(function(tab){
        if(tab.id == tabId){
          callback();
        }
      });
    });
  });
}

window.namedActions = {
  "devtools-panel-shown": function(tabId){ // Send the initial capture and out current capture down the pipe,
    SnapshotOMatic(tabId).broadcast();
  },
  "first-startup": function(tabId){ // Send the initial capture and out current capture down the pipe,
    //SnapshotOMatic(tabId).trackTab();
    //DelayTask(tabId).add(() => {
      //SnapshotOMatic(tabId).insert();
    //});
  },
  "devtools-opened": function(tabId){ // Insert our initial capture, unless it's already active. Then mark as being edited.
    SnapshotOMatic(tabId).trackTab();
    DelayTask(tabId).add(() => {
      SnapshotOMatic(tabId).update();
      SnapshotOMatic(tabId).userInteracted();
    });
  },
  "devtools-interacted": function(tabId){ // Mark the tab as being edited.
    SnapshotOMatic(tabId).trackTab();
    SnapshotOMatic(tabId).userInteracted();
  },
  "page-loaded": function(tabId){ // Insert our initial capture
    DelayTask(tabId).add(() => {
      SnapshotOMatic(tabId).insert();
    });
  },
  "page-updated": function(tabId){ // Update our initial capture, unless it's already active.
    tabIsActive(tabId, () => {
      DelayTask(tabId).add(() => {
        SnapshotOMatic(tabId).update();
      });
    });
  },
  "page-unloaded": function(tabId){ // Delete the tab, we don't need it.
    SnapshotOMatic(tabId).clear();
  },
  "tab-closed": function(tabId){ // Delete the tab, we don't need it.
    SnapshotOMatic(tabId).untrackTab();
    SnapshotOMatic(tabId).clear();
  }
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
    chromeMessageHandler({ action: "first-startup", tabId: tabId })
  }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  window.namedActions['tab-closed'](tabId);
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
  chrome.windows.create({url: 'lib/how-to-use.html', type: 'popup', width: 450, height: 350 }, function(){});
});

chrome.runtime.onInstalled.addListener(function() {
  //chrome.tabs.create({'url': 'https://track-changes.mikerogers.io/thank-you.html'}, function(window) {}); 
});
