export function HTMLCleaner(html, options) {
  var dom = null;

//window.defaultOptions = {
  //ignoreHtmlSelector: [
    //'iframe',
    //'.client-card > a'
  //],
  //ignoreInlineStyles: {
    //'*': 'transform',
    //'svg *': 'matrix',
    //'.modal': 'display'
  //},
  //ignoreAttributes: {
    //'.lazyloaded, .lazyload': 'src',
    //'.lazyloaded, .lazyload': 'data-src'
  //},
  //ignoreClassNames: {
    //'*': '.front-visible',
    //'.carousel-inner .item': '.active',
    //'.animate': '.animate-in',
    //'.modal': '.in'
  //},
//};

  function ignoreHtmlSelector(){
    console.log(dom);
  }

  function ignoreInlineStyles(){
  }

  function ignoreAttributes(){
  }

  function ignoreClassNames(){
  }

  function clean() {
    // Create a HTML fragment
    dom = document.implementation.createHTMLDocument('html-cleaner-file').createElement("html");
    dom.innerHTML = html;

    ignoreHtmlSelector();
    ignoreInlineStyles();
    ignoreAttributes();
    ignoreClassNames();

    debugger;

    return dom.innerHTML;
  }

  return {
    clean: clean
  };
}

