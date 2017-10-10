import { MHTMLParser } from '../shared/mhtml-parser';

export function SnapshotOMatic(tabId) {

  function buildTabSnapshot(){
    console.log("SnapshotOMatic.buildTabSnapshot: " + tabId);
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
    console.log("SnapshotOMatic.saveSnapshot: " + tabId);
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

  function insert(){
    console.log("SnapshotOMatic.insert: " + tabId);
    setDefaultTabSnapshotData();

    buildTabSnapshot().then(({tab, result}) => {
      saveSnapshot(tab, result);
    });
  }

  function update(){
    console.log("SnapshotOMatic.update: " + tabId);
    setDefaultTabSnapshotData();

    // If the user has interacted with the tab, don't insert a new initial version.
    if(window.tabSnapshots[tabId]["user_interacted"]){ return; }

    insert();
  }

  function userInteracted(){
    console.log("SnapshotOMatic.userInteracted: " + tabId);
    window.tabSnapshots[tabId]["user_interacted"] = true;
  }

  function broadcast(){
    console.log("SnapshotOMatic.broadcast: " + tabId);
    buildTabSnapshot().then(({tab, result}) => {
      window.connections[tabId].postMessage({
        action: "snapshots-data",
        tabId: tabId,
        title: tab.title,
        url: tab.url,
        inital: window.tabSnapshots[tabId]["data"],
        updated: {
          "mhtml": result,
          "files": MHTMLParser().parseString(result)
        }
      });
    });
  }

  function clear(){
    console.log("SnapshotOMatic.clear: " + tabId);
    delete tabSnapshots[tabId];
  }

  return {
    insert: insert,
    update: update,
    userInteracted: userInteracted,
    broadcast: broadcast,
    clear: clear
  }
}