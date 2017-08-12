import { ChromeFiles } from '../shared/chrome-files';
import { DiffAsHTML } from '../shared/diff-as-html';

export function Snapshot(tabId) {
  var timeStamp = (new Date).getTime(); // Used for file directory

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
        debugger;
        ChromeFiles().saveHTMLFile(timeStamp + "/diff.html", html, function(){
          resolve();
        });
      });
    });
  }

  return {
    save: function(){
      return Promise.all([
        // TODO: Create the directory first idiot.
        saveMHTMLFile("inital"),
        saveMHTMLFile("updated"),
        saveDiffFile()
      ]);
    }
  }
}
