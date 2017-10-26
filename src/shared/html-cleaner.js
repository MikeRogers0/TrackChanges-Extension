export function HTMLCleaner(html, options) {
  var dom = null;

  function clean() {
    // Create a HTML fragment
    dom = document.createElement("html");
    dom.outerHTML = html;

    

    return dom.outerHTML;
  }

  return {
    clean: clean
  };
}

