export function DelayTask(taskName, delayTime=150) {

  // Clear the last task with this name, queue up this instead.
  function add(callback){
    console.log("DelayTask.add: " + taskName)
    window.clearTimeout(window.delayTaskEvents[taskName]);
    window.delayTaskEvents[taskName] = window.setTimeout(function(){
      console.log("DelayTask.run: " + taskName)
      callback();
    }, delayTime);
  }

  return {
    add: add
  };
}
