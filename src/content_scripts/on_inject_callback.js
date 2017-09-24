// When a page has loaded & the onready JS has run, we tell the extension (which will take a snapshot of the page).
chrome.runtime.sendMessage( { action: "page-loaded" } );

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    chrome.runtime.sendMessage( { action: "page-loaded" } );
  }
};

// Also listen for a handful of other loading events.
document.addEventListener('DOMContentLoaded', function(){
  chrome.runtime.sendMessage( { action: "page-loaded" } );
}, false);

window.addEventListener('load', function(){
  chrome.runtime.sendMessage( { action: "page-loaded" } );
}, false);

window.addEventListener('unload', function(){
  chrome.runtime.sendMessage( { action: "page-unloaded" } );
}, false);

// Turbolinks 5
document.addEventListener('turbolinks:load', function(){
  chrome.runtime.sendMessage( { action: "page-loaded" } );
}, false);

// Turbolinks classic
document.addEventListener('page:change', function(){
  chrome.runtime.sendMessage( { action: "page-loaded" } );
}, false);
