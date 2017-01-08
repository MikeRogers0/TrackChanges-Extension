"use strict";

// https://github.com/kpdecker/jsdiff
var JsDiff = require("diff");
//window.diff = JsDiff;

import { MHTMLParser } from '../shared/mhtml-parser';
//window.parser = MHTMLParser;

var background = chrome.extension.getBackgroundPage();
var tab = null;
var diffElm = document.querySelector(".diffs");

var original_files = {};
var latest_files = {};

function runTheDiff(){
  original_files = background.original_tabs[tab.id];
  latest_files = original_files;

  loadLatestFiles()
};

function loadLatestFiles(){
  chrome.pageCapture.saveAsMHTML({tabId: tab.id}, function(mhtmlData){
    var reader = new window.FileReader();
    reader.onload = function() {
      latest_files = MHTMLParser().parseString(reader.result);
      buildDiff();
    };
    reader.readAsText(mhtmlData);
  });
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

    if(part.added || part.removed){
      div.style.color = color;
      div.appendChild(document.createTextNode(part.value));
      codeElm.appendChild(div);
    }
  });
}

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
  tab = tabs[0];
  window.tab = tab;

  runTheDiff();
});
