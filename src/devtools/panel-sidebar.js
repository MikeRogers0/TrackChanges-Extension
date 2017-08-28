// List the created snapshots.
import { ChromeFiles } from '../shared/chrome-files';

var fileList = document.querySelector(".file-list");
var clearSnapshots = document.querySelector(".clear-all-snapshots");

function renderSnapshotListItem(result){
  var listItem = document.querySelector('[data-template="fileListItem"]').innerHTML;
  listItem = listItem.replace(/#{id}/g, result.name);
  listItem = listItem.replace(/#{folder_path}/g, result.toURL());
  listItem = listItem.replace(/#{download_file}/g, localStorage[result.name + "filename"]);
  listItem = listItem.replace(/#{date}/g, new Date(parseInt(result.name)).toLocaleDateString());
  return listItem;
}

function renderSnapshotList(){
  ChromeFiles().listFoldersInRootDirectory(function(results){
    fileList.innerHTML = '';
    for(var i in results){
      var result = results[i];
      if(result.isDirectory){
        fileList.innerHTML += renderSnapshotListItem(result);
      }
    }
  });
}

fileList.addEventListener('click', function(e){
  var elem = e.target; // Which element was actually clicked.

  if(elem.nodeName == "A"){
    // They clicked the link, move on.
    return;
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
});

clearSnapshots.addEventListener('click', function(e){
  e.preventDefault();

  // Delete all files from the file system
  ChromeFiles().listFoldersInRootDirectory(function(results){
    for(var i in results){
      var result = results[i];
      if(result.isDirectory){
        ChromeFiles().removeDirectory(result.name);
        localStorage.removeItem(result.name + "filename");
      }
    }
  });

  // Empty the file list - there is no files any more :D
  fileList.innerHTML = ''

  document.querySelector(".get-started").style = "display: block;";
  document.querySelector(".snapshot-preview").style = "display: none;";
});

renderSnapshotList();
