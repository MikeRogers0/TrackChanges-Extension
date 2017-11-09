export function TrackChangesOptions() {
  var defaultOptions = {
    ignoreHtmlSelectors: [
      'iframe',
      '.client-card > a',
      '#intercom-stylesheet',
      '#intercom-container'
    ],
    ignoreInlineStyles: {
      '*': 'transform',
      'svg *': 'matrix',
      '.modal': 'display'
    },
    ignoreAttributes: {
      '.lazyloaded, .lazyload': 'src',
      '.lazyloaded, .lazyload': 'data-src'
    },
    ignoreClassNames: {
      '*': 'front-visible',
      '.carousel-inner .item': 'active',
      '.animate': 'animate-in',
      '.modal': 'in'
    },
    ignoreDynamicElements: true,
    downloadSnapshotImmediately: true
  };

  var userOptions = {};

  function get(key){
    return getAll()[key];
  }

  function getAll(){
    userOptions = Object.assign(defaultOptions, (JSON.parse(localStorage['userOptions'] || '{}')));
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

