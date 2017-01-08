// When a page has loaded & the onready JS has run, we tell the extension (which will take a snapshot of the page).
document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    chrome.runtime.sendMessage( { action: "injected" } );
  }
};
