import { MHTMLParser } from '../../shared/mhtml-parser';

// List of tabs with their snapshots
// {
//   123: { // Key is the tabId
//     active: true, // True when the user has opened the devtools on this tab.
//     snapshot: { // The Snapshot
//       mhtml: Blob, // Copy of the MHTML of the page. 
//       files: Hash // A copy of the files & their body.
//     }
//   }
// }
window.tabSnapshots = {};

function cacheMHTML(tabId){
  // Only run if the devtools has been opened.
  //if( window.tabSnapshots[tabId]["active"] !== true ){ return; }

  console.log("pageCapture: " + tabId);
  chrome.tabs.get(tabId, function(tab){
    chrome.pageCapture.saveAsMHTML({tabId: tabId}, function(mhtmlData){
      var reader = new window.FileReader();
      reader.onload = function() {
        window.tabSnapshots[tabId] = {
          "active": window.tabSnapshots[tabId]["active"],
          "title": tab.title,
          "url": tab.url,
          "data": {
            "mhtml": reader.result,
            "files": MHTMLParser().parseString(reader.result)
          }
        };
      };
      reader.readAsText(mhtmlData);
    });
  });
}

// Make sure if the site loads a bunch times we don't hammer the CPU parsing it.
window.tabCacheTimeout = {};
function queueCacheMHTML(tabId){
  console.log("queueCacheMHTML(" + tabId +")");

  // We need a quick delay otherwise chrome throws a shitty error.
  clearTimeout(tabCacheTimeout[tabId]);
  tabCacheTimeout[tabId] = setTimeout(function(){
    cacheMHTML(tabId)
  }, 350);
}

// When a page tell us it has has loaded successfully, we grab a snapshot of the page.
chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
  // If it's some other message, ignore it.
  if(request.action !== "page-loaded"){ return; }

  var tabId = sender.tab.id;
  window.tabSnapshots[tabId] = window.tabSnapshots[tabId] || { active: false };
  queueCacheMHTML(tabId)
});

// When a page tell us it has has loaded successfully, we grab a snapshot of the page.
chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
  // If it's some other message, ignore it.
  if(request.action !== "page-unloaded"){ return; }

  var tabId = sender.tab.id;
  console.log("page-unloaded: " + tabId)
  window.tabSnapshots[tabId] = { active: false };
});

// When a devtools has been opened, grab a snapshot. 
chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
  // If it's some other message, ignore it.
  if(request.action !== "devtools-opened" || request.tabId === null){ return; }

  var tabId = request.tabId;
  console.log("devtools-opened: " + tabId);

  // Enable the snapshot'ing of this tab if devtools has been opened.
  window.tabSnapshots[tabId] = window.tabSnapshots[tabId] || { active: false };

  if( window.tabSnapshots[tabId]["active"] === false ) {
    window.tabSnapshots[tabId]["active"] === true;
    queueCacheMHTML(tabId)
  }
});

// When a devtools has been reshown, grab a rebroadcast the changes. 
chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
  // If it's some other message, ignore it.
  if(request.action !== "devtools-shown" || request.tabId === null){ return; }

  console.log("devtools-shown: " + request.tabId);
  if( window.connections[request.tabId] != undefined ){
    broadcastTabSnapshots(request.tabId);
  }
});

// Clear up the memory on tab close.
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  console.log("Removing: " + tabId)
  delete tabSnapshots[tabId];
});

function broadcastTabSnapshots(tabId){
  console.log("broadcastTabSnapshots: " + tabId);

  chrome.tabs.get(tabId, function(tab){
    chrome.pageCapture.saveAsMHTML({tabId: tabId}, function(mhtmlData){
      var reader = new window.FileReader();
      reader.onload = function() {
        connections[tabId].postMessage({
          action: "snapshots-data",
          tabId: tabId,
          title: tab.title,
          url: tab.url,
          inital: window.tabSnapshots[tabId]["data"],
          updated: {
            "mhtml": reader.result,
            "files": MHTMLParser().parseString(reader.result)
          }
        });
      }
      reader.readAsText(mhtmlData);
    });
  });
}

// Experimenting with longer running connections
window.connections = {};
chrome.runtime.onConnect.addListener(function (port) {

  var extensionListener = function (message, sender, sendResponse) {

    // When the panel tab is shown, send the latest version of the page to them.
    if (message.name == "init" && message.tabId !== null) {
      window.connections[message.tabId] = port;
      broadcastTabSnapshots(message.tabId);
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


// On start up capture all opens tabs.
chrome.tabs.query({ "status": "complete" }, function(tabs){
  for(var i in tabs){
    var tabId = tabs[i].id;
    window.tabSnapshots[tabId] = { active: false };
    queueCacheMHTML(tabId);
  }
});

chrome.browserAction.onClicked.addListener(function(tab) {
  alert("Open inspector, change something, click 'TrackChanges' then create summary :)");
});
