// List the created snapshots.
import { ChromeFiles } from '../shared/chrome-files';

var fileList = document.querySelector(".file-list");
var clearSnapshots = document.querySelector(".clear-all-snapshots");

function renderSnapshotListItem(result){
  var listItem = document.querySelector('[data-template="fileListItem"]').innerHTML;
  listItem = listItem.replace(/#{id}/g, result.name);
  listItem = listItem.replace(/#{folder_path}/g, result.toURL());
  listItem = listItem.replace(/#{download_file}/g, localStorage[result.name + "filename"]);
  listItem = listItem.replace(/#{title}/g, localStorage[result.name + "title"]);
  listItem = listItem.replace(/#{date}/g, new Date(parseInt(result.name)).toLocaleString());
  return listItem;
}

function renderSnapshotList(){
  ChromeFiles().listFoldersInRootDirectory(function(results){
    fileList.innerHTML = '';
    for (var i = 0, len = results.length; i < len; i++) {
      var result = results[i];
      if(result.isDirectory){
        fileList.innerHTML += renderSnapshotListItem(result);
      }
    }

    attachDragListener();
  });
}

var dragImage = document.querySelector('.logo');
var dragItems = {}

function attachDragListener(){
  var panelLinks = fileList.querySelectorAll(".panel-link");
  var panelLink = null;

  for (var i = 0, len = panelLinks.length; i < len; i++) {
    panelLink = panelLinks[i];

    ChromeFiles().getFile(panelLink.getAttribute("data-file-id") + "/" + localStorage[panelLink.getAttribute("data-file-id") + "filename"], function(result){
      dragItems[panelLink.getAttribute("data-file-id")] = result;
    });

    panelLink.addEventListener('dragstart', function(e){
      var linkElm = e.target.querySelector('[href]');

      //e.dataTransfer.dropEffect = "copy";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("DownloadURL", "application/zip:" + localStorage[e.target.getAttribute("data-file-id") + "filename"] + ":" + linkElm.getAttribute("href"));
      e.dataTransfer.setDragImage(dragImage, 64, 64);
    }, false);
  }
}

fileList.addEventListener('click', function(e){
  var elem = e.target; // Which element was actually clicked.

  if(elem.nodeName == "A"){
    // They clicked the link, move on.
    return;
  }

  if( !elem.className.includes('panel-link') ){
    elem = elem.parentElement;
  }

  var activePanelLink = document.querySelector(".file-list .panel-link.active")
  if( activePanelLink !== null ) {
    activePanelLink.className = activePanelLink.className.replace(/active/g, '').trim();
  }

  if(!elem.className.includes("active")) {
    elem.className += " active"
  }

  // They clicked the outer div.
  var newLocation = window.location.origin + window.location.pathname + "?id=" + elem.attributes["data-file-id"].value;
  window.history.pushState({path: newLocation}, elem.attributes["data-file-id"], newLocation);
  window.loadView();
}, false);

clearSnapshots.addEventListener('click', function(e){
  e.preventDefault();

  // Delete all files from the file system
  ChromeFiles().listFoldersInRootDirectory(function(results){
    for(var i in results){
      var result = results[i];
      if(result.isDirectory){
        ChromeFiles().removeDirectory(result.name);
        localStorage.removeItem(result.name + "filename");
        localStorage.removeItem(result.name + "title");
      }
    }
  });

  // Empty the file list - there is no files any more :D
  fileList.innerHTML = ''

  document.querySelector(".get-started").style = "display: block;";
  document.querySelector(".snapshot-preview").style = "display: none;";
}, false);

var snapshotsTitle = document.querySelector('.files-title');
snapshotsTitle.addEventListener('click', function(e){
  window.location.replace('?');
});


renderSnapshotList();
