import { MHTMLParser } from '../../shared/mhtml-parser';

// Saves the tabs MHTML on page load, clear the store on tab close.
window.original_tabs = {};
var tabCacheTimeout = {};

// Cache the HTML to memory.
function cacheMHTML(tabId){
  chrome.pageCapture.saveAsMHTML({tabId: tabId}, function(mhtmlData){
    var reader = new window.FileReader();
    reader.onload = function() {
      window.original_tabs[tabId] = {
        "mhtml": reader.result,
        "parsed": MHTMLParser().parseString(reader.result)
      };
    };
    reader.readAsText(mhtmlData);
  });
}

// When a page tell us it has has loaded successfully, we grab a snapshot of the page.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  var tab = sender.tab;

  // If it's some other message, ignore it.
  if(request.action !== "injected"){
    return;
  }

  clearTimeout(tabCacheTimeout[tab.id]);

  // We need a quick delay otherwise chrome throws a shitty error.
  // TODO: Make sure we don't hammer this command somehow.
  tabCacheTimeout[tab.id] = setTimeout(function(){
    cacheMHTML(tab.id)
  }, 350);
});

// Clear up the memory on tab close.
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  delete original_tabs[tabId];
});
