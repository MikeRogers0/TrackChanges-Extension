// List the created snapshot.

function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

var snapshotId = getJsonFromUrl()["id"];
if( snapshotId.length > 0 ){
  // Hide the show snapshot
  // Load the snapshot.
}

