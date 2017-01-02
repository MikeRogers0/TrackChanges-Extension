'use strict';

// Saves the tabs MHTML on page load, clear the store on tab close.

// When the tab changes, we save a copy of the HTML.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'loading') return;

  // We need a quick delay otherwise chrome throws a shitty error.
  setTimeout(function(){ cacheMHTML(tabId) }, 50);
});

// Cache the HTML to memory.
function cacheMHTML(tabId){
  chrome.pageCapture.saveAsMHTML({tabId: tabId}, function(mhtmlData){
    debugger;
  });
}
