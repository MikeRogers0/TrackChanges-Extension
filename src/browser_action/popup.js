"use strict";

import { MHTMLParser } from '../shared/mhtml-parser';
import { HTMLDiff } from '../shared/html-diff';
import { ChromeFiles } from '../shared/chrome-files';
import { Snapshot } from '../shared/snapshot';
import { DiffOverview } from '../shared/diff-overview';
//import { LineCountDiff } from '../shared/linecount-diff';
// https://stuk.github.io/jszip/ - maybe also!

var background = chrome.extension.getBackgroundPage();
var btnSave = document.querySelector(".btn-save");
var btnViewMore = document.querySelector(".btn-view-more");
var btnClearAll = document.querySelector(".btn-clear-all");
var snapshotHTML = document.querySelector('[data-template="snapshot"]').innerHTML;
var snaptshotsElm = document.querySelector(".snapshots");

var someChangesElm = document.querySelector(".some-changes");
var noChangesElm = document.querySelector(".no-changes");
var tab = null;

function loadSnapshotList(){
  // Clear current list
  snaptshotsElm.innerHTML = "";
  
  // Populate with new stuff.
  ChromeFiles().listFoldersInRootDirectory(function(results){
    for(var i in results){
      var result = results[i];
      if(result.isDirectory){
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

function loadCurrentDiffOverview(){
  noChangesElm.style = "display: block;"
}

// It's hard to know the current open tab. So save it.
function setTab(callback){
  console.log("Setting tab details global to popup");
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
    callback(tabs[0]);
  });
}

btnSave.addEventListener("click", function(e){
  e.preventDefault();
  btnSave.disabled = true;

  setTab(function(tab){
    Snapshot().save(tab, function(){
      console.log("Reloading Recent Snapshot list");
      btnSave.innerHTML = "Saved"

      loadSnapshotList();
    });
  });
});

btnViewMore.addEventListener("click", function(e){
  e.preventDefault();
  chrome.tabs.create({'url': chrome.extension.getURL('lib/launch.html'), 'selected': true});
});

btnClearAll.addEventListener("click", function(e){
  e.preventDefault();

  ChromeFiles().listFoldersInRootDirectory(function(results){
    for(var i in results){
      var result = results[i];
      if(result.isDirectory){
        ChromeFiles().removeDirectory(result.name);
      }
    }

    setTimeout(function(){
      loadSnapshotList();
    }, 200);
  });
});

loadCurrentDiffOverview();
loadSnapshotList();
