var quotedPrintable = require('quoted-printable');

export function MHTMLParser() {

  var headers = [
    "Content-Type",
    "Content-Transfer-Encoding",
    "Content-Location"
  ]

  var MHTMLString = "";
  var MHTMLFiles = [];
  var MultipartBoundary = "--";
  var data = {};

  var setMultipartBoundary = function(){
    var MultipartBoundaryLine = MHTMLString.split("\n")[6]
    var MultipartBoundaryToken =  "" + MultipartBoundaryLine.replace('boundary="----', '').replace('----"', '').trim();
    MultipartBoundary = "------" + MultipartBoundaryToken + "----";
  }

  var splitMHTMLStringIntoFiles = function(){
    MHTMLFiles = MHTMLString.replace(MultipartBoundary + "--", "").split(MultipartBoundary);
  }

  var parseFiles = function(){
    for(var i in MHTMLFiles){
      // Skip the first block, it's just MHTML file meta info.
      if( i !== "0" ){
        parseFile(MHTMLFiles[i], i);
      }
    }
  };

  var parseFile = function(MHTMLFile, index){
    var fileData = {
      filename: "unknown-" + index,
      headerParsed: false,
      "Content-Location": "",
      data: ""
    };

    var MHTMLFileLines = MHTMLFile.split("\n");

    // Start cycling through the lines until we reach the end of the headers.
    var line = 0;
    while(!fileData.headerParsed){
      console.log( MHTMLFileLines[line] );
      console.log( typeof MHTMLFileLines[line] );
      if( typeof MHTMLFileLines[line] !== "undefined" ) {
        fileData = parseHeaderLine(MHTMLFileLines[line], fileData);
        line++;
      } else {
        fileData.headerParsed = true;
      }
    }

    // Assign the filename.
    fileData.filename = fileData["Content-Location"];

    // If it already exists (chrome returns the page twice), skip it
    if( data[fileData.filename] != undefined ) {
      return;
    }

    // Skip any files that are massive.
    if( fileData["Content-Transfer-Encoding"] === "base64" ) {
      return;
    }
      
    // Rejoin the actual content
    fileData.data = MHTMLFileLines.slice(line, MHTMLFileLines.length).join("\n");

    if( fileData["Content-Transfer-Encoding"] === "quoted-printable" ) {
      fileData.data = quotedPrintable.decode(fileData.data)
    }

    // Remove "cid:frame-1007-078dc205-110a-4a99-8c03-53a3a256e7ef@mhtml.blink" Kind of stuff from the HTML source
    if( fileData["Content-Type"] === "text/html" ) {
      fileData.data = fileData.data.replace( /cid:([a-z0-9\-]+)@mhtml\.blink/g, '' );
    }

    // Save the parsed file to the data;
    data[fileData.filename] = fileData;
  };

  var parseHeaderLine = function(line, fileData){
    // Look for the headers in the line, assign the ones we like.
    for(var i in headers){
      var header = headers[i];

      // If we find a header, then update the file data
      if( line.indexOf(header) !== -1 ){
        fileData[header] = line.replace(header + ": ", "").trim();

        return fileData;
      }
    }

    // If it's a blank line, then we're at the end of the headers
    if(fileData["Content-Location"] != ""){
      fileData.headerParsed = true
    }

    return fileData;
  }

  return {
    parseString: function(string){
      MHTMLString = string;

      setMultipartBoundary();
      splitMHTMLStringIntoFiles();

      parseFiles();

      return data;
    }
  }
}

