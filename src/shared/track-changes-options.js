export function TrackChangesOptions() {
  var defaultOptions = {
    ignoreHtmlSelectors: [
      'iframe',
      '.client-card > a',
      '#intercom-stylesheet',
      '#intercom-container',
      'svg > *',
      '.maps-wrapper',
      'head > link',
      'head > style',
      'script'
    ],
    ignoreInlineStyles: {
      '*': 'transform',
      '.modal': 'display',
      'h1.page-title': 'opacity'
    },
    ignoreAttributes: {
      '.lazyloaded, .lazyload, .img-responsive': 'src data-src data-srcset sizes width height',
      '.client-card img': 'alt width height'
    },
    ignoreClassNames: {
      '*': 'front-visible animation-ended lazyloaded lazyload',
      '.carousel-inner .item': 'active',
      '.animate': 'animate-in',
      '.modal': 'in',
      '.arrow-wrapper': 'show-label'
    },
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
