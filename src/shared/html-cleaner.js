export function HTMLCleaner(html, options) {
  var dom = null;

  function ignoreHtmlSelector(){
    dom.querySelectorAll(options.ignoreHtmlSelectors.join(', ')).forEach(function(element) {
      element.remove();
    });
  }

  // Ignore when an element has styles like:
  // <div style="matrix: 1010; display: none; transform: none;" />
  function ignoreInlineStyles(){
    Object.keys( options.ignoreInlineStyles ).forEach(function(selector, index){
      var styles = options.ignoreInlineStyles[selector];
      dom.querySelectorAll(selector).forEach(function(element) {
        styles.split(',').forEach(function(style) {
          element.style.removeProperty(style.trim());
        });

        if( ( element.getAttribute('style') || '' ).trim() == '' ){
          element.removeAttribute('style');
        }
      });
    });
  }

  // If an element has attributes like 'data-src', we can safely ignore those also.
  function ignoreAttributes(){
    Object.keys( options.ignoreAttributes ).forEach(function(selector, index){
      var attributes = options.ignoreAttributes[selector];
      dom.querySelectorAll(selector).forEach(function(element) {
        attributes.split(',').forEach(function(attribute) {
          element.removeAttribute(className.trim());
        });
      });
    });
  }

  // Remoce classnames like in/animate-in
  function ignoreClassNames(){
    Object.keys( options.ignoreClassNames ).forEach(function(selector, index){
      var classNames = options.ignoreClassNames[selector];
      dom.querySelectorAll(selector).forEach(function(element) {
        classNames.split(',').forEach(function(className) {
          element.classList.remove(className.trim());
        });
      });
    });
  }

  function clean() {
    var parser = new DOMParser();
    var dom = parser.parseFromString(html, "text/html");

    if(options.ignoreDynamicElements){
      ignoreHtmlSelector();
      ignoreInlineStyles();
      ignoreAttributes();
      ignoreClassNames();
    }

    return dom.querySelector('html').outerHTML;
  }

  return {
    clean: clean
  };
}

