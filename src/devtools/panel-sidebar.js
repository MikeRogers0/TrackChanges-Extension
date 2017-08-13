// List the created snapshots.
import { ChromeFiles } from '../shared/chrome-files';

var fileList = document.querySelector(".file-list");

function renderSnapshotListItem(result){
  var listItem = document.querySelector('[data-template="fileListItem"]').innerHTML;
  listItem = listItem.replace(/#{id}/g, result.name);
  listItem = listItem.replace(/#{date}/g, new Date(parseInt(result.name)).toLocaleDateString());
  return listItem;
}

ChromeFiles().listFoldersInRootDirectory(function(results){
  fileList.innerHTML = '';
  for(var i in results){
    var result = results[i];
    if(result.isDirectory){
      fileList.innerHTML += renderSnapshotListItem(result);
    }
  }
});
