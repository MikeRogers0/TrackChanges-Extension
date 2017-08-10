window.tabSnapshot = {}

import { Snapshot } from '../shared/snapshot';

var backgroundPageConnection = chrome.runtime.connect({name: "panel"});

backgroundPageConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});

backgroundPageConnection.onMessage.addListener(function(message, sender, sendResponse){
  if(message.action === "snapshots-data" && message.tabID === chrome.devtools.inspectedWindow.tabId){
    console.log('snapshots-data');
    window.tabSnapshot["inital"] = message.inital;
    window.tabSnapshot["updated"] = message.updated;
  }
});

chrome.extension.sendMessage( { action: "devtools-shown", tabID: chrome.devtools.inspectedWindow.tabId } );

// When the button is clicked, build a new diff
document.querySelectorAll('.create-snapshot').forEach(function(button) {
  button.addEventListener('click', function(e){
    e.preventDefault();

    console.log('Snapshot(chrome.devtools.inspectedWindow.tabId).save()');
    Snapshot(chrome.devtools.inspectedWindow.tabId).save(function(){
      alert('Reload the file list!'); 
    });
  });
});
