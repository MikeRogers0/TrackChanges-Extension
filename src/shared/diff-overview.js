import { MHTMLParser } from '../shared/mhtml-parser';
import { HTMLDiff } from '../shared/html-diff';
var JsDiff = require("diff");

export function DiffOverview() {
  var background = chrome.extension.getBackgroundPage();

  var linesAdded = 0;
  var linesRemoved = 0;
  var latestFiles = null;
  var originalFiles = null;

  function tabId(){
    return window.tab.id;
  }

  function loadLatestMHTMLFile(callback){
    console.info("Loading Latest MHTML File");

    chrome.pageCapture.saveAsMHTML({tabId: tabId()}, function(mhtmlData){
      var reader = new window.FileReader();
      reader.onload = function() {
        latestFiles = MHTMLParser().parseString(reader.result);
        originalFiles = background.original_tabs[tabId()]["parsed"];

        compareFiles(callback);
      };
      reader.readAsText(mhtmlData);
    });
  }

  function compareFiles(callback){
    console.info("Comparing files");
    for(var file in originalFiles){
      compareVersionsOfFile(file);
    }

    callback(linesAdded, linesRemoved);
  }

  function compareVersionsOfFile(file){
    console.info("Comparing file: " + file);

    if(file == "") {
      return;
    }

    // If they're the same, skip this file.
    if(latestFiles[file].data === originalFiles[file].data) {
      return;
    }

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
    diffStats: function(callback){
      loadLatestMHTMLFile(callback);
    }
  }
}
