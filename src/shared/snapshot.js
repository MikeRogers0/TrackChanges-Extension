import { ChromeFiles } from '../shared/chrome-files';
import { HTMLDiff } from '../shared/html-diff';
import { DiffAsHTML } from '../shared/diff-as-html';

export function Snapshot(tabId) {
  var timeStamp = (new Date).getTime(); // Used for file directory
  var tabSnapshot = null;
  var completedCallback = function(){};
  var templates = {};

  function setCompletedCallback(callback){
    completedCallback = callback;
  }

  function setTemplates(htmlTemplates){
    templates = htmlTemplates;
  }

  function generateDiff(){
    completedCallback();
  }

  return {
    save: function(callback, htmlTemplates){
      setCompletedCallback(callback);
      setTemplates(htmlTemplates);
      generateDiff();
    }
  }
}
