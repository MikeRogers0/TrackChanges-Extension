"use strict";

//import { MHTMLParser } from '../shared/mhtml-parser';
//import { HTMLDiff } from '../shared/html-diff';
import { ChromeFiles } from '../shared/chrome-files';
//import { LineCountDiff } from '../shared/linecount-diff';
// https://stuk.github.io/jszip/ - maybe also!

var background = chrome.extension.getBackgroundPage();
var btnSave = document.querySelector(".btn-save");
var timeStamp = (new Date).getTime(); // Used for file directory
var snapshotHTML = document.querySelector('[data-template="snapshot"]').innerHTML;
var snaptshotsElm = document.querySelector(".snapshots");

function loadSnapshotList(){
  // Clear current list
  snaptshotsElm.innerHTML = "";
  
  // Populate with new stuff.
  ChromeFiles().listFoldersInRootDirectory(function(results){
    for(var i in results){
      var result = results[i];
      if(result.isDirectory){
        ChromeFiles().removeDirectory(result.name);
        var newSnapshot = snapshotHTML;

        // Fill in the keys
        newSnapshot = newSnapshot.replace(/#{id}/g, result.name);
        newSnapshot = newSnapshot.replace(/#{url}/g, result.toURL());

        snaptshotsElm.innerHTML += newSnapshot;
      }
    }
  });
};

btnSave.addEventListener("click", function(e){
  e.preventDefault();
  btnSave.disabled = true;

  chrome.tabs.captureVisibleTab({format: "png"}, function(dataUrl) {

    // Save the screenshot
    // Save the original_mhtml
    // Save the updated_mhtml
    // Save the diff summary

    // Create the directory.

    console.log("Creating Directory");
    ChromeFiles().createDirectory(timeStamp, function(){

      console.log("Saving Screenshot");
      ChromeFiles().saveBase64AsImage(timeStamp + "/preview.png", dataUrl, function(e){

        console.log("Reloading Recent Snapshot list");
        btnSave.innerHTML = "Saved"

        loadSnapshotList();
      });
    });
  });
});

loadSnapshotList();
