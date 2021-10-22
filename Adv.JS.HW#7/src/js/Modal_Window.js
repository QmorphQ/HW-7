//===============
"use strict"; //+
//===============

//======================================================

//HTML template:
//--------------------------------

let window_htmlTemplate = (window_selector) => {
  return `
  <div class="window">
  <a class="${window_selector}__delete"></a>
  <div class="${window_selector}__header">
      <h2 class="${window_selector}__title"><input class="${window_selector}__input-title"></h2>
      <a class="${window_selector}__edit">Submit</a>
    </div>
    <div class="${window_selector}__main">
      <div class="${window_selector}__text"><textarea class="${window_selector}__input-text" name="" id="" cols="30" rows="10"></textarea></div>
    </div>
    <div class="${window_selector}__footer">
    </div>
</div>  `
};

class Modal_Window extends Card {}
