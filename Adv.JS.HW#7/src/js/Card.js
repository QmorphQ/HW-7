//==============
"use strict"; //+
//==============

//=====================================================

//HTML template:
//--------------------------------
 // const some_htmlTemplate = (selector) => {...};


class Card {
  constructor(card_selector, html_exp, self_close = true) {
    this.card_selector = card_selector;
    this.self_close = self_close;
    this.card_htmlElement = html_exp(this.card_selector);
  }
  create_window(element_selectorToAdjust, position = "afterbegin") {
    try {
      document
        .querySelector(`.${element_selectorToAdjust}`)
        .insertAdjacentHTML(position, this.card_htmlElement);
      this.add_onClick_close_card();
    } catch (error) {
      console.log(error);
    }
  }
  add_onClick_close_card() {
    if (this.self_close) {
      let btn = document.querySelector(`.${this.card_selector}__delete`);
      btn.addEventListener("click", (event) => {
        event.target.closest("." + this.card_selector).remove();
      });
    } else return;
  }
  insert_text(element_selector, text) {
    return document
      .querySelector("." + element_selector)
      .insertAdjacentText("afterbegin", text);
  }
}
