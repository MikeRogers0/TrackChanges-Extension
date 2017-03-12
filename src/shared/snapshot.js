import { ChromeFiles } from '../shared/chrome-files';
import { MHTMLParser } from '../shared/mhtml-parser';
import { HTMLDiff } from '../shared/html-diff';
import { DiffAsHTML } from '../shared/diff-as-html';

var finalCallback = function(){};

export function Snapshot() {
  var background = chrome.extension.getBackgroundPage();
  var timeStamp = (new Date).getTime(); // Used for file directory
  var snapshotParsedFiles = null;

  function tabID(){
    return window.tab.id;
  }

  function startSavingAllRelvantFiles(){
    console.log("startSavingAllRelvantFiles");
    console.log("Creating Directory");
    ChromeFiles().createDirectory(timeStamp, function(){
      saveScreenshot();
    });
  }

  function saveScreenshot(){
    console.log("Saving Screenshot");

    chrome.tabs.captureVisibleTab({format: "png"}, function(dataUrl) {
      ChromeFiles().saveBase64AsImage(timeStamp + "/preview.png", dataUrl, function(){
        saveOriginalMHTMLFile();
      });
    });
  };

  function saveOriginalMHTMLFile(){
    console.log("Saving Original MHTML File");
    ChromeFiles().saveMHTMLFile(timeStamp + "/original.mhtml", background.original_tabs[tabID()]["mhtml"], function(){
      saveLastestMHTMLFile();
    });
  }

  function saveLastestMHTMLFile(){
    console.log("Saving Latest MHTML File");

    chrome.pageCapture.saveAsMHTML({tabId: tabID()}, function(mhtmlData){
      var reader = new window.FileReader();
      reader.onload = function() {
        ChromeFiles().saveMHTMLFile(timeStamp + "/latest.mhtml", reader.result, function(){
          snapshotParsedFiles = MHTMLParser().parseString(reader.result);
          saveDiffFile();
        });
      };
      reader.readAsText(mhtmlData);
    });
  }

  function saveDiffFile(){
    console.log("Saving Diff File");

    DiffAsHTML().buildHTML(snapshotParsedFiles, function(html){
      ChromeFiles().saveHTMLFile(timeStamp + "/diff.html", html, function(){
        saveZipFile();
      });
    });
  }

  function saveZipFile(){
    console.log("Saving Zip File");
    finalCallback();
  }

  return {
    save: function(tab, callback){
      tab = tab;
      finalCallback = callback;

      startSavingAllRelvantFiles();
    }
  }
}
