export function TrackChangesOptions() {
  var defaultOptions = {
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
    Object.assign(userOptions, (JSON.parse(localStorage['userOptions'] || '{}')));
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
