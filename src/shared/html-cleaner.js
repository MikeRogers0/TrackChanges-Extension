export function HTMLCleaner(html, options) {
  var dom = null;

  // TODO = Decide on the elements to include for these.
  // Bootstrap elements 3/4
  // Foundation Elements
  // https://flyntwp.com/

  var defaults = {
    commonlyInjectedSelectors: [
      'script',
      'head > link',
      'head > style',
      'iframe',
      // Intercom
      '#intercom-stylesheet, #intercom-container',
      // Drift
      '#drift-widget-container',
      // Turbolinks
      '#nprogress',
      // Google Maps
      '.maps-wrapper',
      // Nickelled
      '.nickelled__branding, [data-nickelled-styling], [data-nickelled-component], [data-nickelled-private]',
      // Stripe
      '.__PrivateStripeElement',
      // Zendesk,
      '#contact-widget-launcher, #contact-widget',
      // ZopIM
      '.zopim'
    ],
    ignoreHtmlSelectors: [
      '.client-card > a',
      //'svg > *',
      '[aria-live]',
      '.vjs-play-progress, .vjs-seek-handle, .vjs-load-progress'
    ],
    ignoreInlineStyles: {
      '*': 'transform',
      '.modal': 'display',
      'h1.page-title': 'opacity',
    },
    ignoreAttributes: {
      '.lazyloaded, .lazyload, .img-responsive, .lazy-load .lazy-loaded .lazy': 'src data-src data-srcset sizes width height data-original',
      '.client-card img': 'alt width height',
      '[data-scene]': 'data-arrival-index data-departure-index',
      '.is_stuck, [class*="360View"], [class*="360View"], [class*="Animated"], [class*="animated"]' : 'style',
      '[aria-valuenow], [aria-valuetext]': 'aria-valuenow aria-valuetext'
    },
    ignoreClassNames: {
      '*': 'front-visible animation-ended lazyloaded lazyload lazy-load lazy-loaded nprogress-busy is-scrolling vjs-user-inactive',
      '.carousel-inner .item': 'active',
      '.animate': 'animate-in',
      '.modal': 'in',
      '.arrow-wrapper': 'show-label',
      '.cookie-hint': 'active',
      '.menu-item': 'current_page_item'
    }
  }


  function ignoreHtmlSelectors(selector){
    dom.querySelectorAll(selector).forEach(function(element) {
      element.remove();
    });
  }

  // Ignore when an element has styles like:
  // <div style="matrix: 1010; display: none; transform: none;" />
  function ignoreInlineStyles(){
    Object.keys( defaults.ignoreInlineStyles ).forEach(function(selector, index){
      var styles = defaults.ignoreInlineStyles[selector].trim();
      dom.querySelectorAll(selector).forEach(function(element) {
        styles.split(' ').forEach(function(style) {
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
    Object.keys( defaults.ignoreAttributes ).forEach(function(selector, index){
      var attributes = defaults.ignoreAttributes[selector].trim();
      dom.querySelectorAll(selector).forEach(function(element) {
        attributes.split(' ').forEach(function(attribute) {
          element.removeAttribute(attribute.trim());
        });
      });
    });
  }

  // Remoce classnames like in/animate-in
  function ignoreClassNames(){
    Object.keys( defaults.ignoreClassNames ).forEach(function(selector, index){
      var classNames = defaults.ignoreClassNames[selector].trim();
      dom.querySelectorAll(selector).forEach(function(element) {
        classNames.split(' ').forEach(function(className) {
          element.classList.remove(className.trim());
        });
      });
    });
  }

  function clean() {
    var parser = new DOMParser();
    dom = parser.parseFromString(html, "text/html");

    if(options.ignoreCommonlyInjectedElements){
      ignoreHtmlSelectors(defaults.commonlyInjectedSelectors.join(', '));
    }

    if(options.ignoreDynamicElements){
      ignoreHtmlSelectors(defaults.ignoreHtmlSelectors.join(', '));
      ignoreAttributes();
      ignoreInlineStyles();
      ignoreClassNames();
    }

    return dom.querySelector('html').outerHTML;
  }

  return {
    clean: clean
  };
}

