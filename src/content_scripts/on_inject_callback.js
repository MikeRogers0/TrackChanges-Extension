// When a page has loaded & the onready JS has run, we tell the extension (which will take a snapshot of the page).
chrome.runtime.sendMessage( { action: "injected" } );

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    chrome.runtime.sendMessage( { action: "injected" } );
  }
};

// Also listen for a handful of other loading events.
document.addEventListener('DOMContentLoaded', function(){
  chrome.runtime.sendMessage( { action: "injected" } );
}, false);

// Turbolinks 5
document.addEventListener('turbolinks:load', function(){
  chrome.runtime.sendMessage( { action: "injected" } );
}, false);

// Turbolinks clasic
document.addEventListener('page:change', function(){
  chrome.runtime.sendMessage( { action: "injected" } );
}, false);
