import { MHTMLParser } from '../shared/mhtml-parser';
import { HTMLDiff } from '../shared/html-diff';

var tab = null;
var finalCallback = function(){};

export function DiffOverview() {
  var background = chrome.extension.getBackgroundPage();

  var linesAdded = 0;
  var linesRemoved = 0;
  var latestFiles = null;
  var originalFiles = null;

  function loadLatestMHTMLFile(){
    console.log("Loading Latest MHTML File");

    chrome.pageCapture.saveAsMHTML({tabId: tabID()}, function(mhtmlData){
      var reader = new window.FileReader();
      reader.onload = function() {
        latestFiles = MHTMLParser().parseString(reader.result);
        originalFiles = background.original_tabs[tabID()]["parsed"]

        compareFiles();
      };
      reader.readAsText(mhtmlData);
    });
  }

  function compareFiles(){
    for(var file in originalFiles){
      compareVersionsOfFile(file);
    }
  }

  function compareVersionsOfFile(file){

    // If they're the same, skip this file.
    if(latestFiles[file].data === originalFiles[file].data) {
      return;
    }

    
  }

  return {
    diffStats: function(tab, callback){
      tab = tab;
    }
  }
}
