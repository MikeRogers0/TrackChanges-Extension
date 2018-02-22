export function TrackChangesOptions() {
  var defaultOptions = {
    showOptionsBox: true,
    ignoreCommonlyInjectedElements: true,
    ignoreDynamicElements: true,
    downloadSnapshotImmediately: true,
    ableToGetPermissions: true
  };

  var userOptions = {};

  var erroredOptions = {
    ableToGetPermissions: false
  }

  function get(key){
    return getAll()[key];
  }

  function getAll(){
    userOptions = defaultOptions;
    try {
      Object.assign(userOptions, (JSON.parse(localStorage['userOptions'] || '{}')));
    } catch(e) {
      console.error(e);
      return erroredOptions;
    }
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
