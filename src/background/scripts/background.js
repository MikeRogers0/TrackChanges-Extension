'use strict';

// Saves the tabs MHTML on page load, clear the store on tab close.
window.tabsMHTML = {};
//var popupOpen = false;

// Cache the HTML to memory.
function cacheMHTML(tabId){
  chrome.pageCapture.saveAsMHTML({tabId: tabId}, function(mhtmlData){
    // window.URL.createObjectURL(mhtmlData)
    tabsMHTML[tabId] = mhtmlData;
  });
}

// When the tab changes, we save a copy of the HTML.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  if (changeInfo.status === 'loading') return;

  // We need a quick delay otherwise chrome throws a shitty error.
  setTimeout(function(){
    cacheMHTML(tabId)
  }, 50);
});

chrome.tabs.onActivated.addListener(function(activeInfo){
  var tabId = activeInfo.tabId;

  if( tabsMHTML[tabId] == undefined ){
    cacheMHTML(tabId)
  }
});

// Clear up the memory on tab close.
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  delete tabsMHTML[tabId];
});
