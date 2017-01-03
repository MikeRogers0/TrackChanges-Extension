"use strict";

// https://github.com/kpdecker/jsdiff
import JsDiff from 'diff';

// https://github.com/zsxsoft/mhtml-parser
//import parseByString from 'mhtml-parser';

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
    original_html_data = reader.result;
    buildDiff();
  };
  reader.readAsBinaryString(background.tabsMHTML[tab.id]);
};

function buildDiff(){
  // background.tabsMHTML[tab.id] vs  new_mhtmlData
  
  var diff = JsDiff.diffLines(original_mhtmlData, new_mhtmlData);

  diffElm.innerHTML = '<code>';
  diffElm.innerHTML += diff;
  diffElm.innerHTML += '</code>';

  //diffElm.innerHTML = '<p><a href="' + window.URL.createObjectURL(background.tabsMHTML[tab.id]) + '">Original</a></p>';
  //diffElm.innerHTML += '<p><a href="' + window.URL.createObjectURL(new_mhtmlData) + '">Updated</a></p>';
}

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
  tab = tabs[0];

  runTheDiff();
});
