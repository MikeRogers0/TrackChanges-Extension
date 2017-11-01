export function HTMLCleaner(html, options) {
  var dom = null;

//window.default_options = {
  //ignore_html_selector: [
    //'iframe',
    //'.client-card > a'
  //],
  //ignore_inline_styles: {
    //'*': 'transform',
    //'svg *': 'matrix',
    //'.modal': 'display'
  //},
  //ignore_attributes: {
    //'.lazyloaded, .lazyload': 'src',
    //'.lazyloaded, .lazyload': 'data-src'
  //},
  //ignore_class_names: {
    //'*': '.front-visible',
    //'.carousel-inner .item': '.active',
    //'.animate': '.animate-in',
    //'.modal': '.in'
  //},
//};

  function ignoreHtmlSelector(){
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

    return dom.innerHTML;
  }

  return {
    clean: clean
  };
}

