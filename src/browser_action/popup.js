"use strict";

// https://github.com/kpdecker/jsdiff
var JsDiff = require("diff");
window.diff = JsDiff;

// https://github.com/zsxsoft/mhtml-parser
import { MHTMLParser } from './mhtml-parser';
window.parser = MHTMLParser;

var background = chrome.extension.getBackgroundPage();
var tab = null;
var diffElm = document.querySelector(".diffs");

var original_files = {};
var latest_files = {};

function runTheDiff(){

  // Now save that mhtmlData as a string
  var reader = new window.FileReader();
  reader.onload = function() {
    latest_files = MHTMLParser().parseString(reader.result);
    window.latest_files = latest_files;

    loadOriginalFiles();
  };
  reader.readAsText(background.latest_tabsMHTML[tab.id]);

};

function loadOriginalFiles(){
  var reader = new window.FileReader();
  reader.onload = function() {
    original_files = MHTMLParser().parseString(reader.result);
    window.original_files = original_files;

    buildDiff();
  };
  reader.readAsText(background.original_tabsMHTML[tab.id][tab.url]);
};

function buildDiff(){
  // background.tabsMHTML[tab.id] vs  new_mhtmlData
  
  diffElm.innerHTML = "<p>Building the diff</p>";

  // Compare the diff.

  for(var i in original_files){
   compareVersionsOfFile(i);
  }
}

function compareVersionsOfFile(file){
  var diffs = null;
  var containerDivElm = document.createElement('div');
  var codeElm = document.createElement('code');

  containerDivElm.innerHTML = "<p>" + file + "</p>"
  diffElm.appendChild(containerDivElm);
  containerDivElm.appendChild(codeElm);

  JsDiff.diffLines(original_files[file].data, latest_files[file].data).forEach(function(part){
    var color = part.added ? 'green' : part.removed ? 'red' : 'grey';
    var div = document.createElement('div');
    div.style.color = color;
    //console.log("New Line Is:");
    //console.log(part.value);
    div.appendChild(document.createTextNode(part.value));
    codeElm.appendChild(div);
  });
}

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
  tab = tabs[0];
  window.tab = tab;

  runTheDiff();
});
