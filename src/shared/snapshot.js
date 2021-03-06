import { ChromeFiles } from '../shared/chrome-files';
import { DiffAsHTML } from '../shared/diff-as-html';
var JSZip = require("jszip");
var urlify = require('urlify').create({
  spaces: "-",
  toLower: true
});
var FileSaver = require('file-saver');

export function Snapshot(tabId, options) {
  var timestamp = (new Date).getTime(); // Used for file directory
  var zip = new JSZip();

  function touchTimestampDirectory(){
    return new Promise(function(resolve, reject) {
      console.info("Creating Directory: " + timestamp);
      ChromeFiles().createDirectory(timestamp, function(){
        resolve();
      });
    });
  }

  function saveMHTMLFile(version){
    return new Promise(function(resolve, reject) {
      console.info("saveMHTMLFile(" + version + ")")
      zip.file(version + ".mhtml", window.tabSnapshot[version]["mhtml"]);
      ChromeFiles().saveMHTMLFile(timestamp + "/" + version + ".mhtml", window.tabSnapshot[version]["mhtml"], function(){
        resolve();
      });
    });
  }

  function saveDiffFile(){
    return new Promise(function(resolve, reject) {
      console.info("saveDiffFile()")
      DiffAsHTML(window.tabSnapshot["initial"]["files"], window.tabSnapshot["updated"]["files"], window.tabSnapshot["title"], window.tabSnapshot["url"]).buildHTML(function(html){
        zip.file("diff.html", html);
        ChromeFiles().saveHTMLFile(timestamp + "/diff.html", html, function(){
          resolve();
        });
      });
    });
  }

  function saveLocalStorage(){
    localStorage[timestamp + "title"] = window.tabSnapshot["title"];
    localStorage[timestamp + "filename"] = urlify(window.tabSnapshot["title"]) + ".zip";
  }

  function saveZipFile(){
    return new Promise(function(resolve, reject) {
      console.info("saveZipFile()")
      zip.generateAsync({type:"blob"}).then(function (blob) {
        if(options.downloadSnapshotImmediately){
          FileSaver.saveAs(blob, localStorage[timestamp + "filename"]);
        }

        ChromeFiles().saveBlob(timestamp + "/" + localStorage[timestamp + "filename"], blob, function(){
          resolve();
        });
      });
    });
  }

  return {
    timestamp: function(){
      return timestamp;
    },
    save: function(){
      return new Promise(function(resolve, reject) {
        saveLocalStorage();

        touchTimestampDirectory().then(function(){
          Promise.all([
            saveMHTMLFile("initial"),
            saveMHTMLFile("updated"),
            saveDiffFile()
          ]).then(function(){
            // Save the file
            saveZipFile().then(function(){
              resolve();
            });
          }).catch(function(e){
            alert("I'm sorry: " + e);
          });
        })
      });
    }
  }
}
