// List the created snapshots.
import { ChromeFiles } from '../shared/chrome-files';

var fileList = document.querySelector(".file-list");

var clearSnapshots = document.querySelector(".clear-all-snapshots");

function renderSnapshotListItem(result){
  var listItem = document.querySelector('[data-template="fileListItem"]').innerHTML;
  listItem = listItem.replace(/#{id}/g, result.name);
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
