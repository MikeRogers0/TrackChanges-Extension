// List the created snapshots.
import { ChromeFiles } from '../shared/chrome-files';

var fileList = document.querySelector(".file-list");
var clearSnapshots = document.querySelector(".clear-all-snapshots");

function renderSnapshotListItem(result){
  var listItem = document.querySelector('[data-template="fileListItem"]').innerHTML;
  listItem = listItem.replace(/#{id}/g, result.name);
  listItem = listItem.replace(/#{folder_path}/g, result.toURL());
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

  elem.className += " active"

  // They clicked the outer div.
  window.location.replace("?id=" + elem.attributes["data-file-id"].value);
});

clearSnapshots.addEventListener('click', function(e){
  e.preventDefault();

  // Delete all files from the file system
  ChromeFiles().listFoldersInRootDirectory(function(results){
    for(var i in results){
      var result = results[i];
      if(result.isDirectory){
        ChromeFiles().removeDirectory(result.name);
      }
    }
  });

  // Empty the file list - there is no files any more :D
  fileList.innerHTML = ''
});

renderSnapshotList();
