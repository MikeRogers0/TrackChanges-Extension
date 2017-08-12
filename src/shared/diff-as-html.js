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
  var linesRemoved = 0;
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

      resolve();
    });
  }

  function compareVersionsOfFile(file){
    console.log("Comparing file: " + file);

    if(file == "") { return; }

    // If they're the same, skip this file.
    if(initalFiles[file].data === updatedFiles[file].data) { return; }

    // Build the diff HTML
    buildDiffTable(file);
  }

  function buildDiffTable(file){
    var tableHTML = templates["table"];
    var rowsHTML = '';

    JsDiff.diffLines(initalFiles[file].data, updatedFiles[file].data, { newlineIsToken: false }).forEach(function(part){
      var rowType = partTemplate(part);
      var linesOfCode = partLinesOfcode(part);

      for(var i in linesOfCode){
        buildDiffRow(rowType, linesOfCode[i]);
      }
    });

    // TODO - The above runs async, we need to wait for it to finish.

    tableHTML = tableHTML.replace(/#{fileName}/g, file);
    tableHTML = tableHTML.replace(/#{diffTableRows}/g, rowsHTML);

    tablesHTML += tableHTML;
  }

  function buildDiffRow(rowType, code){
    var rowHTML = templates[rowType];
    rowHTML = rowHTML.replace(/#{lineOfCode}/g, code);
    rowsHTML += rowHTML;
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
