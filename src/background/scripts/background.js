import { MHTMLParser } from '../../shared/mhtml-parser';

function cacheMHTML(tabId){
  // Only run if the devtools has been opened.
  if( window.tabSnapshots[tab.id]["active"] !== true ){
    return;
  }

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

// Make sure if the site loads a bunch times we don't hammer the CPU parsing it.
window.tabCacheTimeout = {};

// When a page tell us it has has loaded successfully, we grab a snapshot of the page.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  var tab = sender.tab;

  // If it's some other message, ignore it.
  if(request.action !== "page-loaded" || request.action !== "devtools-opened"){
    return;
  }

  // Enable the snapshot'ing of this tab if devtools has been opened.
  window.tabSnapshots[tab.id] = window.tabSnapshots[tab.id] || {};

  if(request.action === "devtools-opened") {
    window.tabSnapshots[tab.id]["active"] = true;
  }

  clearTimeout(tabCacheTimeout[tab.id]);

  // We need a quick delay otherwise chrome throws a shitty error.
  tabCacheTimeout[tab.id] = setTimeout(function(){
    cacheMHTML(tab.id)
  }, 350);
});

// Clear up the memory on tab close.
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  delete tabSnapshots[tabId];
});
