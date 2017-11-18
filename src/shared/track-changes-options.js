export function TrackChangesOptions() {
  var defaultOptions = {
    ignoreCommonlyInjectedSelectors: [
      '#intercom-stylesheet',
      '#intercom-container',
      '#drift-widget-container',
      'script',
      'head > link',
      'head > style',
      '#nprogress',
      '.maps-wrapper',
      'iframe'
    ],
    ignoreHtmlSelectors: [
      '.client-card > a',
      'svg > *'
    ],
    ignoreInlineStyles: {
      '*': 'transform',
      '.modal': 'display',
      'h1.page-title': 'opacity'
    },
    ignoreAttributes: {
      '.lazyloaded, .lazyload, .img-responsive, .lazy-load .lazy-loaded': 'src data-src data-srcset sizes width height',
      '.client-card img': 'alt width height'
    },
    ignoreClassNames: {
      '*': 'front-visible animation-ended lazyloaded lazyload lazy-load lazy-loaded nprogress-busy',
      '.carousel-inner .item': 'active',
      '.animate': 'animate-in',
      '.modal': 'in',
      '.arrow-wrapper': 'show-label'
    },
    ignoreCommonlyInjectedElements: true,
    ignoreDynamicElements: true,
    downloadSnapshotImmediately: true
  };

  var userOptions = {};

  function get(key){
    return getAll()[key];
  }

  function getAll(){
    userOptions = defaultOptions;
    var localOptions = (JSON.parse(localStorage['userOptions'] || '{}'))

    // In the future use Object.extend across each options for a better merge.

    userOptions['ignoreDynamicElements'] = localOptions['ignoreDynamicElements'] || true
    userOptions['downloadSnapshotImmediately'] = localOptions['downloadSnapshotImmediately'] || true
    return userOptions;
  }

  function set(key, value){
    getAll();
    userOptions[key] = value;
    localStorage['userOptions'] = JSON.stringify(userOptions);
  }

  return {
    get: get,
    getAll: getAll,
    set: set
  };
}
