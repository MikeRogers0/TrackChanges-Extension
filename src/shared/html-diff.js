// Takes two text files and outputs the differences as HTML node.
// Assumes you have styling for 
// .added {}
// .removed {}

var JsDiff = require("diff");

export function HTMLDiff() {
  var options = {
    html_contextual_lines: 3,
    show_line_number: false
  }

  var codeElm = document.createElement('code');
  var lineNumber = 0;

  var appendNode = function(line, className){
    var div = document.createElement('div');
    div.className = className;
    div.setAttribute("line_numer", lineNumber);
    div.appendChild(document.createTextNode(part.value));
    codeElm.appendChild(div);
  }

  var appendContextNodes = function(part){
    // Add either the last `html_contextual_lines` (first change), or the last 3 lines. Updating the line numbers as we go.
    if(lineNumber == 0) {
      // Add the last `html_contextual_lines`

      //lineNumber = part.split
    } else {
      // Add the first `html_contextual_lines`
    }

    appendNode(part, "contextual-line")
  }

  var appendChangedNodes = function(part){
    var className = part.added ? 'added' : part.removed ? 'removed' : '';

    // Split the part by line, increasing each loop.
    appendNode(part, className)
  }

  // Add the part to the dom assigning it a classname based on if it has changed or not.
  var addPartToDom = function(part){
    if( !part.added && !part.removed ){
      appendContextNodes(part);
    } else {
      appendChangedNodes(part);
    }
  }

  return {
    // Returns a line by line diff, minus the unchanged white space.
    diffLines: function(original, latest){

      JsDiff.diffLines(original, latest, { newlineIsToken: false }).forEach(function(part){
        addPartToDom(part, lineNumer, codeElm);
      });

      return codeElm;
    }
  }
}
