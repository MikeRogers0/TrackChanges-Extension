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
    finalHTML = document.createElement("html");
    finalHTML.innerHTML = window.diffFileHTML;
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

    // Create the file.
    var diffTable = document.createElement("div");
    diffTable.innerHTML = window.diffTableHTML;
    diffTable.innerHTML = diffTable.innerHTML.replace(/#{fileName}/g, file);

    var diffRowElm = document.createElement("tbody");
    var totalLinesOfCode = originalFiles[file].data.split("\n").filter(function(n){ return n.trim() != "" }).length;
    var currentLineOfCode = 1;

    JsDiff.diffLines(originalFiles[file].data, latestFiles[file].data, { newlineIsToken: false }).forEach(function(part){
      var diffRow = document.createElement("tr");
      diffRow.innerHTML =  window.diffRowHTML;

      var initalLineOfCode = currentLineOfCode;
      var linesOfCode = part.value.split("\n").filter(function(n){ return n.trim() != "" });

      // Make the lines HTML Safe
      linesOfCode = linesOfCode.map(function(line){
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(line));
        return div.innerHTML;
      });

      // Add the CSS class to the new element
      if( part.added ){
        diffRow.className = "code-addition";
      } else if( part.removed ){
        diffRow.className ="code-deletion";
      } else {
        diffRow.className = "code-context";
      }
      
      // Now adjust lines we're going to append to now overload the user.
      // Pretty much, show the first and last 2 lines of the unchanged code.
      // Unless it's the first and last time we see it.
      if( !part.added && !part.removed ){

        var newLinesOfCode = [];

        // Remove all the white space lines
        linesOfCode = linesOfCode.filter(function(n){ return n.trimRight() != "" })

        // Trim the lines of code to only include a bit of context
        if(diffRowElm.innerHTML == ""){
          currentLineOfCode = linesOfCode.length - 2;
          newLinesOfCode = linesOfCode.slice(-2);
        } else {
          newLinesOfCode = linesOfCode.slice(0, 2);

          // When we're not at the end of the file.
          if(initalLineOfCode + currentLineOfCode < totalLinesOfCode){
            newLinesOfCode = newLinesOfCode.concat(["[...]"]);
            newLinesOfCode = newLinesOfCode.concat(linesOfCode.slice(-3));
          }
        }

        linesOfCode = newLinesOfCode;
      }

      // Loop though the lines, so each line is a row in the able.
      for(var i in linesOfCode){
        var diffLocRow = diffRow.cloneNode(true);
        diffLocRow.innerHTML = diffLocRow.innerHTML.replace(/#{code}/g, linesOfCode[i].trimRight());

        // Show a sensible line number
        if(i == 0 || part.removed || part.context){
          diffLocRow.innerHTML = diffLocRow.innerHTML.replace(/#{currentLineOfCode}/g, currentLineOfCode);
        } else {
          diffLocRow.innerHTML = diffLocRow.innerHTML.replace(/#{currentLineOfCode}/g, "");
        }
        diffLocRow.innerHTML = diffLocRow.innerHTML.replace(/#{newLineNumber}/g, "");

        if( !part.added ){
          currentLineOfCode++;
        }

        diffRowElm.appendChild(diffLocRow);
      }
    });

    diffTable.querySelector("tbody").appendChild(diffRowElm);
    diffTable.querySelector("tbody .code-context:last-child").remove();
    finalHTML.querySelector(".code-diff").appendChild(diffTable);
  }

  return {
    buildHTML: function(snapshotParsedFiles, callback){
      buildHTMLFile(snapshotParsedFiles, callback);
    }
  }
}
