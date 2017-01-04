'use strict';

// Saves the tabs MHTML on page load, clear the store on tab close.
window.original_tabsMHTML = {};
window.latest_tabsMHTML = {};

// Cache the HTML to memory.
function cacheMHTML(tabId, tabUrl){
  chrome.pageCapture.saveAsMHTML({tabId: tabId}, function(mhtmlData){
    window.latest_tabsMHTML[tabId] = mhtmlData;

    // If it's the first time the user has hit the page
    // TODO: Maybe update original on document ready or something?
    if( typeof(window.original_tabsMHTML[tabId]) == "undefined" || typeof(window.original_tabsMHTML[tabId][tabUrl]) == "undefined" ){
      window.original_tabsMHTML[tabId] = {};
      window.original_tabsMHTML[tabId][tabUrl] = mhtmlData;
    }
  });
}

// When the tab changes, we save a copy of the HTML.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  if (changeInfo.status === 'loading'){
    return;
  }

  // We need a quick delay otherwise chrome throws a shitty error.
  setTimeout(function(){
    cacheMHTML(tabId, tab.url)
  }, 50);
});

// TODO: On moving to this tab.
//chrome.tabs.onActivated.addListener(function(activeInfo){
  //var tabId = activeInfo.tabId;

  //cacheMHTML(tabId)
//});

// Clear up the memory on tab close.
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  delete original_tabsMHTML[tabId];
  delete latest_tabsMHTML[tabId];
});
