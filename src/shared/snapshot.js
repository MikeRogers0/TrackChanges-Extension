import { ChromeFiles } from '../shared/chrome-files';
import { DiffAsHTML } from '../shared/diff-as-html';

export function Snapshot(tabId) {
  var timeStamp = (new Date).getTime(); // Used for file directory

  function touchTimestampDirectory(){
    return new Promise(function(resolve, reject) {
      console.log("Creating Directory: " + timeStamp);
      ChromeFiles().createDirectory(timeStamp, function(){
        resolve();
      });
    });
  }

  function saveMHTMLFile(version){
    return new Promise(function(resolve, reject) {
      console.log("saveMHTMLFile(" + version + ")")
      ChromeFiles().saveMHTMLFile(timeStamp + "/" + version + ".mhtml", window.tabSnapshot[version]["mhtml"], function(){
        resolve();
      });
    });
  }

  function saveDiffFile(){
    return new Promise(function(resolve, reject) {
      console.log("saveDiffFile()")
      DiffAsHTML(window.tabSnapshot["inital"]["files"], window.tabSnapshot["updated"]["files"]).buildHTML(function(html){
        ChromeFiles().saveHTMLFile(timeStamp + "/diff.html", html, function(){
          resolve();
        });
      });
    });
  }

  return {
    save: function(){
      return Promise.all([
        touchTimestampDirectory(),
        saveMHTMLFile("inital"),
        saveMHTMLFile("updated"),
        saveDiffFile()
      ]);
    }
  }
}
