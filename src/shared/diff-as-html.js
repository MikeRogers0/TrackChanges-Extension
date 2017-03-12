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

  function buildHTMLFile(_snapshotParsedFiles, callback){
    console.log("Building HTML Diff File");
    finalHTML = document.createElement("div");
    latestFiles = _snapshotParsedFiles;
    originalFiles = background.original_tabs[tabID()]["parsed"];

    compareFiles(callback);
  }

  function compareFiles(callback){
    console.log("Comparing files");

    for(var file in originalFiles){
      compareVersionsOfFile(file);
    }

    callback(finalHTML.outerHTML);
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

    var diffFile = document.createElement("h2");
    diffFile.innerHTML += file;
    var diffElement = document.createElement("pre");

    JsDiff.diffLines(originalFiles[file].data, latestFiles[file].data, { newlineIsToken: false }).forEach(function(part){
      //var linesCount = part.value.split("\n").filter(function(n){ return n.trim() != "" }).length;

      var linesOfCode = part.value.split("\n");
      var linesOfCodeElm = document.createElement("code");

      // Add the CSS class to the new element
      if( part.added ){
        linesOfCodeElm.className = "added"
        linesOfCodeElm.style = "color: green;"
      } else if( part.removed ){
        linesOfCodeElm.className = "removed"
        linesOfCodeElm.style = "color: red;"
      } else {
        linesOfCodeElm.className = "unchanged"
        linesOfCodeElm.style = "color: grey;"
      }
      
      // Now adjust lines we're going to append to now overload the user.
      // Pretty much, show the first and last 2 lines of the unchanged code.
      // Unless it's the first and last time we see it.
      if( !part.added && !part.removed ){

        var newLinesOfCode = [];

        // Remove all the white space lines
        linesOfCode = linesOfCode.filter(function(n){ return n.trim() != "" })

        // Trim the lines of code to only include a bit of context
        if(diffElement.innerHTML == ""){
          newLinesOfCode = linesOfCode.slice(-2);
        } else {
          newLinesOfCode = linesOfCode.slice(0, 2);
          newLinesOfCode = newLinesOfCode.concat(["[...]"]);
          newLinesOfCode = newLinesOfCode.concat(linesOfCode.slice(-3));
        }

        linesOfCode = newLinesOfCode;
      }

      // Make the lines HTML Safe
      linesOfCode = linesOfCode.map(function(line){
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(line));
        return div.innerHTML;
      });

      linesOfCodeElm.innerHTML = linesOfCode.join("\n");

      diffElement.appendChild(linesOfCodeElm);
    });

    finalHTML.appendChild(diffFile);
    finalHTML.appendChild(diffElement);
  }

  return {
    buildHTML: function(snapshotParsedFiles, callback){
      buildHTMLFile(snapshotParsedFiles, callback);
    }
  }
}
