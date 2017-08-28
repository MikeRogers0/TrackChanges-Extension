window.tabSnapshot = {}

import { Snapshot } from '../shared/snapshot';

var backgroundPageConnection = chrome.runtime.connect({name: "panel"});

backgroundPageConnection.onMessage.addListener(function(message, sender, sendResponse){
  if(message.action === "snapshots-data" && message.tabID === chrome.devtools.inspectedWindow.tabId){
    console.log('snapshots-data');
    window.tabSnapshot["title"] = message.title;
    window.tabSnapshot["inital"] = message.inital;
    window.tabSnapshot["updated"] = message.updated;
  }
});

backgroundPageConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});

// When the button is clicked, build a new diff
document.querySelectorAll('.create-snapshot').forEach(function(button) {
  button.addEventListener('click', function(e){
    e.preventDefault();

    console.log('Snapshot(chrome.devtools.inspectedWindow.tabId).save()');
    var snapshot = Snapshot(chrome.devtools.inspectedWindow.tabId);
    snapshot.save().then(function(){
      window.location.replace("?id=" + snapshot.timestamp());
    }).catch(function(e){
      alert("I'm sorry: " + e);
    });
  });
});
