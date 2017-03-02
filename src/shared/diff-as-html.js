import { MHTMLParser } from '../shared/mhtml-parser';
import { HTMLDiff } from '../shared/html-diff';
var JsDiff = require("diff");

export function DiffAsHTML() {
  var background = chrome.extension.getBackgroundPage();

  var linesAdded = 0;
  var linesRemoved = 0;
  var latestFiles = null;
  var originalFiles = null;
  var finalHTML = "";

  function tabID(){
    return window.tab.id;
  }

  function buildHTMLFile(_latestFiles, _originalFiles, callback){
    latestFiles = _latestFiles;
    originalFiles = _originalFiles;

    finalHTML = document.createElement("div");
  }

  function compareFiles(callback){
    console.log("Comparing files");
    for(var file in originalFiles){
      compareVersionsOfFile(file);
    }

    callback(finalHTML);
  }

  function compareVersionsOfFile(file){
    console.log("Comparing file: " + file);

    if(file == "") {
      return;
    }

    // If they're the same, skip this file.
    if(latestFiles[file].data === originalFiles[file].data) {
      return;
    }

    var diffElement = document.createElement("code");


    JsDiff.diffLines(originalFiles[file].data, latestFiles[file].data, { newlineIsToken: false }).forEach(function(part){
      var linesCount = part.value.split("\n").filter(function(n){ return n.trim() != "" }).length;

      if( part.added ){
        linesAdded += linesCount;
      } else if( part.removed ){
        linesRemoved += linesCount;
      }
    });
    
  }

  return {
    buildHTML: function(latestFiles, originalFiles, callback){
      buildHTMLFile(callback);
    }
  }
}
