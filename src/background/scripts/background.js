import { MHTMLParser } from '../../shared/mhtml-parser';

function cacheMHTML(tabId){
  // Only run if the devtools has been opened.
  if( window.tabSnapshots[tabId]["active"] !== true ){
    return;
  }

  console.log("pageCapture: " + tabId)

  chrome.pageCapture.saveAsMHTML({tabId: tabId}, function(mhtmlData){
    var reader = new window.FileReader();
    reader.onload = function() {
      window.tabSnapshots[tabId] = {
        "active": true,
        "mhtml": reader.result,
        "files": MHTMLParser().parseString(reader.result)
      };
    };
    reader.readAsText(mhtmlData);
  });
}

// Make sure if the site loads a bunch times we don't hammer the CPU parsing it.
window.tabCacheTimeout = {};
function queueCacheMHTML(tabId){
  // We need a quick delay otherwise chrome throws a shitty error.
  clearTimeout(tabCacheTimeout[tabId]);
  tabCacheTimeout[tabId] = setTimeout(function(){
    cacheMHTML(tabId)
  }, 350);
}

// List of tabs with their snapshots
// {
//   123: { // Key is the tabID
//     active: true, // True when the user has opened the devtools on this tab.
//     snapshot: { // The Snapshot
//       mhtml: Blob, // Copy of the MHTML of the page. 
//       files: Hash // A copy of the files & their body.
//     }
//   }
// }
window.tabSnapshots = {};

// When a page tell us it has has loaded successfully, we grab a snapshot of the page.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  // If it's some other message, ignore it.
  if(request.action !== "page-loaded"){ return; }

  var tabId = sender.tab.id;
  window.tabSnapshots[tabId] = window.tabSnapshots[tabId] || { active: false };

  queueCacheMHTML(tabId)
});

// When a page tell us it has has loaded successfully, we grab a snapshot of the page.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  // If it's some other message, ignore it.
  if(request.action !== "devtools-opened" || request.tabID === null){ return; }

  var tabId = request.tabID;

  // Enable the snapshot'ing of this tab if devtools has been opened.
  window.tabSnapshots[tabId] = window.tabSnapshots[tabId] || { active: false };

  console.log("Activating: " + tabId)
  window.tabSnapshots[tabId]["active"] = true;
 
  queueCacheMHTML(tabId)
});

// Clear up the memory on tab close.
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  console.log("Removing: " + tabId)
  delete tabSnapshots[tabId];
});

// TODO: On start up capture all opens tabs.
