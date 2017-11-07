window.tabSnapshot = {}

import { Snapshot } from '../shared/snapshot';

function toggleCreateSnapshotButtons(){
  document.querySelectorAll('.create-snapshot').forEach(function(button) {
    toggleDisabled(button);
  });
}

function toggleDisabled(element){
  if( element.className.includes('disabled') ){
    element.className = element.className.replace('disabled', '').trim();
    element.removeAttribute("disabled", false);
  } else {
    element.className += ' disabled';
    element.setAttribute("disabled", true);
  }
}

function createSnapshot(){
  console.log('Snapshot(chrome.devtools.inspectedWindow.tabId).save()');

  toggleCreateSnapshotButtons();

  var snapshot = Snapshot(chrome.devtools.inspectedWindow.tabId);
  snapshot.save().then(function(){
    window.location.replace("?id=" + snapshot.timestamp());
  }).catch(function(e){
    alert("I'm sorry: " + e);
    toggleCreateSnapshotButtons();
  });
}

function enableCreateSnapshot(){
  if( !document.querySelector('#create-snapshot-form .create-snapshot').className.includes('disabled') ) {
    return;
  }

  toggleCreateSnapshotButtons();

  // When the button is clicked, build a new diff
  document.querySelectorAll('.create-snapshot').forEach(function(button) {
    button.addEventListener('click', function(e){
      e.preventDefault();
      createSnapshot();
    });
  });

  var moreOptionsBtn = document.querySelector('#create-snapshot-form .btn-options');
  var optionsWrapper = document.querySelector('#create-snapshot-form .options');
  moreOptionsBtn.addEventListener('click', function(e){
    e.preventDefault();

    // Toggle the class.
    if( moreOptionsBtn.className.includes('active') ){
      moreOptionsBtn.className = moreOptionsBtn.className.replace('active', '').trim();
      optionsWrapper.className += ' hide';
    } else {
      moreOptionsBtn.className += ' active';
      optionsWrapper.className = optionsWrapper.className.replace('hide', '').trim();
    }
  });
}

var backgroundPageConnection = chrome.runtime.connect({ name: "panel" });

backgroundPageConnection.onMessage.addListener(function(message, sender, sendResponse){
  if(message.action === "snapshots-data" && message.tabId === chrome.devtools.inspectedWindow.tabId){
    console.log('backgroundPageConnection.onMessage: snapshots-data');
    window.tabSnapshot["title"] = message.title;
    window.tabSnapshot["url"] = message.url;
    window.tabSnapshot["initial"] = message.initial;
    window.tabSnapshot["updated"] = message.updated;

    enableCreateSnapshot();
  }
});

backgroundPageConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});
