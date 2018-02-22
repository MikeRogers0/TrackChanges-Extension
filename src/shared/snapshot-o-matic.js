import { MHTMLParser } from '../shared/mhtml-parser';

export function SnapshotOMatic(tabId) {

  function buildTabSnapshot(){
    console.info("SnapshotOMatic.buildTabSnapshot: " + tabId);
    return new Promise(function(resolve, reject) {
      chrome.tabs.get(tabId, function(tab){
        chrome.pageCapture.saveAsMHTML({tabId: tabId}, function(mhtmlData){
          var reader = new window.FileReader();
          reader.onload = function() {
            resolve({tab: tab, result: reader.result});
          };
          reader.readAsText(mhtmlData);
        });
      });
    });
  }

  function saveSnapshot(tab, result){
    console.info("SnapshotOMatic.saveSnapshot: " + tabId);
    window.tabSnapshots[tabId] = {
      "user_interacted": window.tabSnapshots[tabId]["user_interacted"],
      "title": tab.title,
      "url": tab.url,
      "data": {
        "mhtml": result,
        "files": MHTMLParser().parseString(result)
      }
    };
  }

  function setDefaultTabSnapshotData(){
    window.tabSnapshots[tabId] = window.tabSnapshots[tabId] || {};
    window.tabSnapshots[tabId]["user_interacted"] = window.tabSnapshots[tabId]["user_interacted"] || false;
  }

  function trackTab(){
    console.info("SnapshotOMatic.trackTab: " + tabId);
    window.trackingTabs[tabId] = true
  }

  function untrackTab(){
    console.info("SnapshotOMatic.untrackTab: " + tabId);
    window.trackingTabs[tabId] = false
  }

  function insert(){
    if( !window.trackingTabs[tabId] ){
      return;
    }

    console.info("SnapshotOMatic.insert: " + tabId);
    setDefaultTabSnapshotData();

    buildTabSnapshot().then(({tab, result}) => {
      saveSnapshot(tab, result);
    });
  }

  function update(){
    if( !window.trackingTabs[tabId] ){
      return;
    }
    console.info("SnapshotOMatic.update: " + tabId);
    setDefaultTabSnapshotData();

    // If the user has interacted with the tab, don't insert a new initial version.
    if(window.tabSnapshots[tabId]["user_interacted"]){ return; }

    insert();
  }

  function userInteracted(){
    if( typeof(window.tabSnapshots[tabId]) != 'undefined' ){
      console.info("SnapshotOMatic.userInteracted: " + tabId);
      window.tabSnapshots[tabId]["user_interacted"] = true;
    }
  }

  function broadcast(){
    if( typeof(window.connections[tabId]) == 'undefined' ){
      return;
    }

    console.info("SnapshotOMatic.broadcast: " + tabId);
    buildTabSnapshot().then(({tab, result}) => {

      // If no initial snapshot was made, fallback to the current snapshot.
      if( typeof(window.tabSnapshots[tabId]) == 'undefined') {
        window.tabSnapshots[tabId] = {};
        window.tabSnapshots[tabId]["data"] = {
          "mhtml": result,
          "files": MHTMLParser().parseString(result)
        };
      }

      window.connections[tabId].postMessage({
        action: "snapshots-data",
        tabId: tabId,
        title: tab.title,
        url: tab.url,
        initial: window.tabSnapshots[tabId]["data"],
        updated: {
          "mhtml": result,
          "files": MHTMLParser().parseString(result)
        }
      });
    });
  }

  function clear(){
    console.info("SnapshotOMatic.clear: " + tabId);
    delete window.tabSnapshots[tabId];
  }

  return {
    trackTab: trackTab,
    untrackTab: untrackTab,
    insert: insert,
    update: update,
    userInteracted: userInteracted,
    broadcast: broadcast,
    clear: clear
  }
}
