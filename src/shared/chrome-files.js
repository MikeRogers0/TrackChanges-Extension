// Taken from: https://github.com/GoogleChrome/chrome-app-samples/blob/master/samples/filesystem-access/js/app.js
// https://github.com/GoogleChrome/chrome-app-samples/blob/master/samples/storage/main.js

export function ChromeFiles() {
  
  var BIG_FILE = 30 * 1024 * 1024;

  function errorHandler(e){
    console.log(e);
  }

  function initFileSystem(callback){
    window.webkitRequestFileSystem(TEMPORARY, BIG_FILE, function(fs) {
      callback(fs);
    }, errorHandler);
  }

  function writeFile(filename, contents, fileType, callback){
    initFileSystem(function(fs){

      fs.root.getFile(filename, {create: true}, function(fileEntry) {

        fileEntry.createWriter(function(fileWriter) {

          fileWriter.onwriteend = function(e) {
            callback();
          };

          fileWriter.onerror = function(e) {
            console.log('Write failed: ' + e.toString());
          };

          var blob = new Blob([window.atob[contents]], {type: fileType, encoding: 'utf-8'});

          fileWriter.write(blob);
        }, errorHandler);

      }, errorHandler);
    })
  }

  function createDirectory(folderName, callback){
    initFileSystem(function(fs){
      fs.root.getDirectory(folderName, {create: true}, function(dirEntry) {
        callback();
      }, errorHandler);
    });
  }

  function removeDirectory(folderName){
    initFileSystem(function(fs){
      fs.root.getDirectory(folderName, {}, function(dirEntry) {
        dirEntry.removeRecursively(function(){
          console.log("Directory Removed:" + folderName);
        }, errorHandler);
      }, errorHandler);
    });
  };

  function readDirectory(callback){
    initFileSystem(function(fs){
      var dirReader = fs.root.createReader();
      dirReader.readEntries(callback, errorHandler);
    });
  }

  return {
    saveBase64AsImage: function(filename, contents, callback){
      contents = contents.split(',')[1];
      // Do something with the contents.
      writeFile(filename, contents, "image/png", callback)
    },
    createDirectory: function(folderName, callback){
      createDirectory(folderName, callback);
    },
    removeDirectory: function(folderName){
      removeDirectory(folderName);
    },
    listFoldersInRootDirectory: function(callback){
      readDirectory(callback);
    }
  }
}
