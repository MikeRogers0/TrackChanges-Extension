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

window.delayTaskEvents = {}

onMessageActions = {
  "devtools-panel-shown": function(tabId){ // Send the initial capture and out current capture down the pipe,
    SnapshotOMatic(tabId).broadcast();
  },
  "devtools-opened": function(tabId){ // Insert our initial capture, unless it's already active. Then mark as being edited.
    DelayTask(tabId).add(function(){
      SnapshotOMatic(tabId).update();
      SnapshotOMatic(tabId).userInteracted();
    });
  },
  "devtools-interacted": function(tabId){ // Mark the tab as being edited.
    SnapshotOMatic(tabId).userInteracted();
  },
  "page-loaded": function(tabId){ // Insert our initial capture
    DelayTask(tabId).add(function(){
      SnapshotOMatic(tabId).insert();
    });
  },
  "page-updated": function(tabId){ // Insert our initial capture, unless it's already active.
    DelayTask(tabId).add(function(){
      SnapshotOMatic(tabId).update();
    });
  },
  "page-unloaded": function(tabId){ // Delete the tab, we don't need it.
    SnapshotOMatic(tabId).clear();
  },
}


// On start up capture all opens tabs.
chrome.tabs.query({ "status": "complete" }, function(tabs){
  for(var i in tabs){
    var tabId = tabs[i].id;
    DelayTask(tabId).add(function(){
      SnapshotOMatic(tabId).insert();
    });
  }
});

chrome.browserAction.onClicked.addListener(function(tab) {
  alert("Open inspector, change something, click 'TrackChanges' then create summary :)");
});
