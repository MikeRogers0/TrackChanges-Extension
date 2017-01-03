'use strict';

// Saves the tabs MHTML on page load, clear the store on tab close.
var tabsMHTML = {};
var popupOpen = false;

// Cache the HTML to memory.
function cacheMHTML(tabId){
  chrome.pageCapture.saveAsMHTML({tabId: tabId}, function(mhtmlData){
    // window.URL.createObjectURL(mhtmlData)
    tabsMHTML[tabId] = mhtmlData;
  });
}

// When the tab changes, we save a copy of the HTML.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'loading') return;

  // We need a quick delay otherwise chrome throws a shitty error.
  setTimeout(function(){
    cacheMHTML(tabId)
  }, 50);
});

// Clear up the memory on tab close.
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  delete tabsMHTML[tabId];
});

// If the user clicks the icon - toggle the popup, I might be able to remove this.
chrome.browserAction.onClicked.addListener(function(tab) {
  // If popup is open, close it.
  if (popupOpen){
    popupOpen = false;

    chrome.browserAction.setPopup({
      tabId: tab.id,
      popup: ""
    });

    return;
  }

  // Otherwise open the popup and let the popup.js do the rest.
  chrome.browserAction.setPopup({
    tabId: tab.id,
    popup: "src/popup.html"
  });
});
