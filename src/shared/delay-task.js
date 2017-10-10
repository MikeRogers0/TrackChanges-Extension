export function DelayTask(taskName) {

  // Clear the last task with this name, queue up this instead.
  function add(callback){
    window.clearTimeout(window.delayTaskEvents[taskName]);
    window.delayTaskEvents[taskName] = window.setTimeout(callback, 350);
  }

  return {
    add: add(callback)
  };
}
