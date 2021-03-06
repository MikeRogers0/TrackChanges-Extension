// Parses HTML and turns it into individual files.
var quotedPrintable = require('quoted-printable');
var utf8 = require('utf8');
var jsbeautifier = require("js-beautify").html;

export function MHTMLParser() {

  var headers = [
    "Content-Type",
    "Content-Transfer-Encoding",
    "Content-ID",
    "Content-Location",
  ]

  var MHTMLString = "";
  var MHTMLFiles = [];
  var MultipartBoundary = "--";
  var data = {};

  var setMultipartBoundary = function(){
    var MultipartBoundaryToken =  MHTMLString.match('boundary="(.*)"')[1]
    MultipartBoundary = "--" + MultipartBoundaryToken;
    console.info("MHTMLParser().MultipartBoundary: " + MultipartBoundary);
  }

  var splitMHTMLStringIntoFiles = function(){
    MHTMLFiles = MHTMLString.replace(MultipartBoundary + "--", "").split(MultipartBoundary);
    console.info("MHTMLParser().MHTMLFiles: " + MHTMLFiles.length);
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

    // Ignore hosts that are commonly embedded on the page.
    if( typeof(fileData["Content-Location"]) !== 'undefined') {
      if(
        fileData["Content-Location"].includes("https://www.youtube.com/embed/") ||
        fileData["Content-Location"].includes("https://fonts.googleapis.com/") ||
        fileData["Content-Location"].includes("https://www.youtube.com/yts/cssbin/") ||
        fileData["Content-Location"].includes("chrome-extension://") ||
        fileData["Content-Location"].includes("chrome://")
      ) {
        return;
      }
    }
      
    // Rejoin the actual content
    fileData.data = MHTMLFileLines.slice(line, MHTMLFileLines.length).join("\n");

    if( fileData["Content-Transfer-Encoding"] === "quoted-printable" ) {
      fileData.data = utf8.decode(quotedPrintable.decode(fileData.data));
    }

    // Remove "cid:frame-1007-078dc205-110a-4a99-8c03-53a3a256e7ef@mhtml.blink" Kind of stuff from the HTML source
    if( fileData["Content-Type"] === "text/html" ) {
      fileData.data = fileData.data.replace( /cid:([a-z0-9\-]+)@mhtml\.blink/g, '' );

      fileData.data = jsbeautifier(fileData.data, {
        "indent_size": 2,
        "indent_char": " ",
        "indent_with_tabs": false,
        "eol": "\n",
        "end_with_newline": false,
        "indent_level": 0,
        "preserve_newlines": true,
        "max_preserve_newlines": 10,
        "space_in_paren": false,
        "space_in_empty_paren": false,
        "jslint_happy": false,
        "space_after_anon_function": false,
        "brace_style": "collapse",
        "break_chained_methods": false,
        "keep_array_indentation": false,
        "unescape_strings": 6,
        "wrap_line_length": 0,
        "e4x": false,
        "comma_first": false,
        "operator_position": "before-newline"
      });
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

    // The "Content-Location" is the last header, so we can assume the headers are done.
    if(fileData["Content-Location"] != ""){
      fileData.headerParsed = true
    }

    return fileData;
  }

  // I had high hopes of reinjecting iframes srcs into the page.
  var injectContentIDs = function(){
    return;

    // Make a map of the contentIDs
    //var contentIDs = {};

    //for(var i in data){
      //var file = data[i];

      //if(typeof file["Content-ID"] !== "undefined"){
        //var contentID = file["Content-ID"].replace("<", "").replace(">", "")
        //contentIDs[contentID] = file["Content-Location"];
      //}
    //}

    //// Now find and replace in the other documents.
    //for(var i in data){
      //if( data[i]["Content-Type"] == "text/html" ){
        //for(var contentID in contentIDs){
          //data[i].data = data[i].data.replace( "cid:" + contentID, contentIDs[contentID] );
        //}
      //}
    //}
  };

  return {
    parseString: function(string){
      MHTMLString = string;

      setMultipartBoundary();
      splitMHTMLStringIntoFiles();

      parseFiles();

      injectContentIDs();

      return data;
    }
  }
}

