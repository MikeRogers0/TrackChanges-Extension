// When a page has loaded & the onready JS has run, we tell the extension (which will take a snapshot of the page).
chrome.runtime.sendMessage( { action: "page-loaded" } );

function postReadyChangesListner(){
  // Removed, it's triggered way to often and kills the page performance.
  //document.querySelector('body').addEventListener('DOMSubtreeModified', function(){
    //chrome.runtime.sendMessage( { action: "page-updated" } );
  //}, false);

  // Listen for lazy loaded images
  var imagesOnPage = document.querySelectorAll('img');
  for (var i = 0, len = imagesOnPage.length; i < len; i++) {
    imagesOnPage[i].addEventListener('load', function(){
      chrome.runtime.sendMessage( { action: "page-updated" } );
    }, false);
  }
}

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    chrome.runtime.sendMessage( { action: "page-loaded" } );
    postReadyChangesListner();
  }
};

window.addEventListener('load', function(){
  chrome.runtime.sendMessage( { action: "page-loaded" } );
}, false);

// Turbolinks 5
document.addEventListener('turbolinks:load', function(){
  chrome.runtime.sendMessage( { action: "page-loaded" } );
}, false);

// Turbolinks classic
document.addEventListener('page:change', function(){
  chrome.runtime.sendMessage( { action: "page-loaded" } );
}, false);

window.addEventListener('unload', function(){
  chrome.runtime.sendMessage( { action: "page-unloaded" } );
}, false);
