import { TrackChangesOptions } from '../shared/track-changes-options';
import { ChromeFiles } from '../shared/chrome-files';

window.trackChangesOptions = TrackChangesOptions();

function setupOptions(){
  document.querySelectorAll('.option').forEach(function(option) {
    option.checked = window.trackChangesOptions.get(option.name);
    option.addEventListener('change', function(e){
      window.trackChangesOptions.set(option.name, option.checked);
    });
  });
};
setupOptions();

var resetButton = document.querySelector('.reset-everything');
var resetDone = document.querySelector('.reset-everything-done');

resetButton.addEventListener('click', function(e){
  e.preventDefault();
  resetButton.setAttribute("disabled", true);
  resetButton.className += ' disabled'

  localStorage.clear();  

  ChromeFiles().clear(function(){
    resetButton.className += ' hide'
    resetDone.className = resetDone.className.replace('hide', '').trim();
  });

});
