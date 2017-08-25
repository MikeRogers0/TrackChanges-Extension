var JsDiff = require("diff");

export function DiffAsHTML(initalFiles, updatedFiles) {
  var templates = {
    table: document.querySelector('[data-template="diffTable"]').innerHTML,
    rowContext: document.querySelector('[data-template="diffTableRowContext"]').innerHTML,
    rowAddition: document.querySelector('[data-template="diffTableRowAddition"]').innerHTML,
    rowDeletion: document.querySelector('[data-template="diffTableRowDeletion"]').innerHTML
  };
  var finalHTML = document.createElement("html");
  var linesAdded = 0;
  var linesContext = 0;
  var rowsHTML = '';
  var tablesHTML = '';

  function partTemplate(part){
    if( part.added ){
      return "rowAddition";
    } else if( part.removed ){
      return "rowDeletion";
    }
    return "rowContext";
  }

  function partLinesOfcode(part){
    return part.value.split("\n").
      filter(function(n){ return n.trim() != "" }).
      map(function(line){
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(line));
        return div.innerHTML;
      });
  }

  function compareFiles(){
    console.log("Comparing files");
    return new Promise(function(resolve, reject) {
      for(var file in initalFiles){
        compareVersionsOfFile(file);
      }

      finalHTML.innerHTML = tablesHTML;

      removeExcessiveContext();

      resolve();
    });
  }

  // Hide .code-context if there is a lot of them.
  function removeExcessiveContext(){
    var diffTables = finalHTML.querySelectorAll('.diff-table');

    for (var i = 0, len = diffTables.length; i < len; i++) {
      diffTables[i].innerHTML = hideExcessiveContextInTable(diffTables[i]);
    }
  }

  function hideExcessiveContextInTable(tableElm){
    var tableRows = tableElm.querySelectorAll('tbody tr');

    for (var i = 0, len = tableRows.length; i < len; i++) {
      // Look at the next three rows, if they're not a context hide this one.
      var row = tableRows[i];

      if(row.className == "code-context"){
        if(tableRows[i + 1] == undefined || tableRows[i + 1].className == "code-context"){
          row.className += " hide";
        }
      }
    }

    return tableElm.innerHTML;
  }

  function compareVersionsOfFile(file){
    console.log("Comparing file: " + file);

    if(file == "") { return; }

    // If they're the same, skip this file.
    if(initalFiles[file].data === updatedFiles[file].data) { return; }

    // Build the diff HTML
    buildDiffTable(file);
  }

  function calcLineNumber(part){
    if( part.added ){
      return linesAdded++;
    }
    return linesContext++;
  }

  function buildDiffTable(file){
    var tableHTML = templates["table"];
    var rowsHTML = '';
    linesAdded = 0;
    linesContext = 0;
    var lineNumber = 0;

    var parts = JsDiff.diffLines(initalFiles[file].data, updatedFiles[file].data, { newlineIsToken: false });
    var part, rowType, linesOfCode;
    for(var i in parts){
      part = parts[i];
      rowType = partTemplate(part);
      linesOfCode = partLinesOfcode(part);
      linesAdded = linesContext;

      for(var i in linesOfCode){
        lineNumber = calcLineNumber(part);
        rowsHTML += buildDiffRow(rowType, linesOfCode[i], lineNumber);
      }
    }

    tableHTML = tableHTML.replace(/#{fileName}/g, file);
    tableHTML = tableHTML.replace(/#{diffTableRows}/g, rowsHTML);

    tablesHTML += tableHTML;
  }

  function buildDiffRow(rowType, code, lineNumber){
    var rowHTML = templates[rowType];
    rowHTML = rowHTML.replace(/#{lineNumber}/g, lineNumber);
    return rowHTML.replace(/#{lineOfCode}/g, code);
  }

  return {
    buildHTML: function(callback){
      return Promise.all([
        compareFiles()
      ]).then(function(){
        callback(finalHTML.outerHTML);
      }).catch(function(e){
        alert("I'm sorry: " + e);
      });
    }
  }
}
