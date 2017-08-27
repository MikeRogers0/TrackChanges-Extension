import { ChromeFiles } from '../shared/chrome-files';

var fileList = document.querySelector(".file-list");

function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

document.querySelector(".get-started").style = "display: none;";
document.querySelector(".snapshot-preview").style = "display: none;";

var snapshotId = getJsonFromUrl()["id"];
if( snapshotId != undefined && snapshotId.length > 0 ){
  // Hide the show snapshot
  // Load the snapshot.

  ChromeFiles().getFile(snapshotId + "/" + "diff.html", function(result){
    var div = document.createElement('html');
    div.innerHTML = result;
    document.querySelector(".snapshot-preview").innerHTML = div.querySelector(".inner-diff").innerHTML;
    document.querySelector(".snapshot-preview").style = "display: block;";

    fileList.querySelector("[data-file-id='" + snapshotId + "']").className += " active"
  });
} else {
  document.querySelector(".get-started").style = "display: block;";
}
