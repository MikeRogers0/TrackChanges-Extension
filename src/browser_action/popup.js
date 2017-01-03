"use strict";

// https://github.com/kpdecker/jsdiff
import { JsDiff } from 'diff';

// https://github.com/zsxsoft/mhtml-parser
import { parseByString } from 'mhtml-parser';

var background = chrome.extension.getBackgroundPage();
var tab = null;
var diffElm = document.querySelector(".diffs");

var original_mhtmlData = null;
var new_mhtmlData = null;

function runTheDiff(){

  // Get the MHTMl first
  chrome.pageCapture.saveAsMHTML({tabId: tab.id}, function(mhtmlData){

    // Now save that mhtmlData as a string
    var reader = new window.FileReader();
    reader.onload = function() {
      new_mhtmlData = reader.result;
      loadOriginalmHTMLData();
    };
    reader.readAsBinaryString(mhtmlData);

  });
};

function loadOriginalmHTMLData(){
  var reader = new window.FileReader();
  reader.onload = function() {
    original_mhtmlData = reader.result;
    buildDiff();
  };
  reader.readAsBinaryString(background.tabsMHTML[tab.id]);
};

function buildDiff(){
  // background.tabsMHTML[tab.id] vs  new_mhtmlData
  
  window.data = parser.parse(original_mhtmlData);
  console.log(window.data);

  // These will be parsed into files I think, only looking at HTML/CSS/JS.
  //var diff = JsDiff.diffLines(original_mhtmlData, new_mhtmlData);

  //window.diff = diff;

  //[diff[0], diff[1], diff[2], diff[3], diff[4]].forEach(function(part){
    //// green for additions, red for deletions
    //// grey for common parts
    //var color = part.added ? 'green' : part.removed ? 'red' : 'grey';
    //var span = document.createElement('div');
    //span.style.color = color;
    //span.appendChild(document.createTextNode(part.value));
    //diffElm.appendChild(span);
  //});

  //diffElm.innerHTML = '<p><a href="' + window.URL.createObjectURL(background.tabsMHTML[tab.id]) + '">Original</a></p>';
  //diffElm.innerHTML += '<p><a href="' + window.URL.createObjectURL(new_mhtmlData) + '">Updated</a></p>';
}

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
  tab = tabs[0];

  runTheDiff();
});
