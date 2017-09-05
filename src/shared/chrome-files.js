// Taken from: https://github.com/GoogleChrome/chrome-app-samples/blob/master/samples/filesystem-access/js/app.js
// https://github.com/GoogleChrome/chrome-app-samples/blob/master/samples/storage/main.js

export function ChromeFiles() {

  var BIG_FILE = 30 * 1024 * 1024;

  function errorHandler(e){
    console.log(e);
  }

  function initFileSystem(callback){
    window.webkitRequestFileSystem(PERSISTENT, BIG_FILE, function(fs) {
      callback(fs);
    }, errorHandler);
  }

  // From: http://stackoverflow.com/questions/20419574/saving-dataurlbase64-to-file-on-phonegap-android
  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  // Read file get it as text.
  function getFileAsText(filename, callback){
    getFile(filename, function(file) {
      var reader = new FileReader();
      reader.onloadend = function(e) {
        callback(this.result);
      };
      reader.readAsText(file);
    });
  }

  // Read file get it as blob.
  function getFileAsDataURL(filename, callback){
    getFile(filename, function(file) {
      var reader = new FileReader();
      reader.onloadend = function(e) {
        callback(this.result);
      };
      reader.readAsDataURL(file);
    });
  }

  // Read file
  function getFile(filename, callback){
    initFileSystem(function(fs){
      fs.root.getFile(filename, {}, function(fileEntry){
        fileEntry.file(function(file) {
          callback(file);
        }, errorHandler);
      }, errorHandler);
    }, errorHandler);
  }

  function writeFile(filename, contents, callback){
    initFileSystem(function(fs){

      fs.root.getFile(filename, {create: true}, function(fileEntry) {

        fileEntry.createWriter(function(fileWriter) {

          fileWriter.onwriteend = function(e) {
            callback();
          };

          fileWriter.onerror = function(e) {
            console.log('Write failed: ' + e.toString());
          };

          fileWriter.write(contents);
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
    saveBlob: function(filename, contents, callback){
      // Do something with the contents.
      writeFile(filename, contents, callback)
    },
    saveBase64AsImage: function(filename, contents, callback){
      contents = contents.replace(/^data:image\/\w+;base64,/, "");
      contents = b64toBlob(contents, "image/png");
      // Do something with the contents.
      writeFile(filename, contents, callback)
    },
    saveMHTMLFile: function(filename, contents, callback){
      contents = new TextEncoder("multipart/related").encode(contents);
      contents = new Blob([contents], {type: "multipart/related"});
      writeFile(filename, contents, callback)
    },
    saveHTMLFile: function(filename, contents, callback){
      contents = new TextEncoder("text/html").encode(contents);
      contents = new Blob([contents], {type: "text/html"});
      writeFile(filename, contents, callback)
    },
    createDirectory: function(folderName, callback){
      createDirectory(folderName, callback);
    },
    removeDirectory: function(folderName){
      removeDirectory(folderName);
    },
    listFoldersInRootDirectory: function(callback){
      readDirectory(callback);
    },
    getFileAsDataURL: function(filename, callback){
      getFileAsDataURL(filename, callback);
    },
    getFileAsText: function(filename, callback){
      getFileAsText(filename, callback);
    },
    getFile: function(filename, callback){
      getFile(filename, callback);
    }
  }
}
