window.tabSnapshot = {}

import { Snapshot } from '../shared/snapshot';

function createSnapshot(){
  console.log('Snapshot(chrome.devtools.inspectedWindow.tabId).save()');
  var snapshot = Snapshot(chrome.devtools.inspectedWindow.tabId);
  snapshot.save().then(function(){
    window.location.replace("?id=" + snapshot.timestamp());
  }).catch(function(e){
    alert("I'm sorry: " + e);
  });
}

function enableCreateSnapshot(){
  document.querySelector('#create-snapshot-form').className = document.querySelector('#create-snapshot-form').className.replace('hidden', '').trim();

  // When the button is clicked, build a new diff
  document.querySelectorAll('.create-snapshot').forEach(function(button) {
    button.className = button.className.replace('disabled', '').trim();
    button.removeAttribute("disabled", false);

    button.addEventListener('click', function(e){
      e.preventDefault();

      createSnapshot();
    });
  });
}

var backgroundPageConnection = chrome.runtime.connect({ name: "panel" });

backgroundPageConnection.onMessage.addListener(function(message, sender, sendResponse){
  if(message.action === "snapshots-data" && message.tabID === chrome.devtools.inspectedWindow.tabId){
    console.log('backgroundPageConnection.onMessage: snapshots-data');
    window.tabSnapshot["title"] = message.title;
    window.tabSnapshot["url"] = message.url;
    window.tabSnapshot["inital"] = message.inital;
    window.tabSnapshot["updated"] = message.updated;

    enableCreateSnapshot();
  }
});

backgroundPageConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});
