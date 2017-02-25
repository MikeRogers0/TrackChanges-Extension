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
var tab = null;

function loadSnapshotList(){
  // Clear current list
  snaptshotsElm.innerHTML = "";
  
  // Populate with new stuff.
  ChromeFiles().listFoldersInRootDirectory(function(results){
    for(var i in results){
      var result = results[i];
      if(result.isDirectory){
        //ChromeFiles().removeDirectory(result.name);
        var directoryName = result.name;
        var newSnapshot = snapshotHTML;

        // Fill in the keys
        newSnapshot = newSnapshot.replace(/#{id}/g, result.name);
        newSnapshot = newSnapshot.replace(/#{url}/g, result.toURL());
        // Append it to main list.
        snaptshotsElm.innerHTML += newSnapshot;
      }
    }
  });
};

window.loadSnapshotList = loadSnapshotList;

// It's hard to know the current open tab. So save it.
function setTab(callback){
  console.log("Setting tab details global to popup");
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
    tab = tabs[0];
    callback();
  });
}

function startSavingAllRelvantFiles(){
  console.log("startSavingAllRelvantFiles");
  console.log("Creating Directory");
  ChromeFiles().createDirectory(timeStamp, function(){
    saveScreenshot();
  });
}

function saveScreenshot(){
  console.log("Saving Screenshot");

  chrome.tabs.captureVisibleTab({format: "png"}, function(dataUrl) {
    ChromeFiles().saveBase64AsImage(timeStamp + "/preview.png", dataUrl, function(){
      saveOriginalMHTMLFile();
    });
  });
};

function saveOriginalMHTMLFile(){
  console.log("Saving Original MHTML File");
  ChromeFiles().saveMHTMLFile(timeStamp + "/original.mhtml", background.original_tabs[tab.id]["mhtml"], function(){
    saveLastestMHTMLFile();
  });
}

function saveLastestMHTMLFile(){
  console.log("Saving Latest MHTML File");

  chrome.pageCapture.saveAsMHTML({tabId: tab.id}, function(mhtmlData){
    var reader = new window.FileReader();
    reader.onload = function() {
      ChromeFiles().saveMHTMLFile(timeStamp + "/latest.mhtml", reader.result, function(){
        cleaningUp();
      });
    };
    reader.readAsText(mhtmlData);
  });
}

function cleaningUp(){
  console.log("Reloading Recent Snapshot list");
  btnSave.innerHTML = "Saved"

  loadSnapshotList();
}

btnSave.addEventListener("click", function(e){
  e.preventDefault();
  btnSave.disabled = true;

  setTab(function(){
    startSavingAllRelvantFiles();
  });
});

loadSnapshotList();
