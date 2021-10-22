//===============
"use strict"; //+
//===============

//======================================================

//HTML template:
//--------------------------------

let post_htmlTemplate = (post_selector, post_id, userId) => {
  return `
    <div class="${post_selector}" data-id="${post_id}" data-userId="${userId}">
      <div class="${post_selector}__header">
        <a class="${post_selector}__edit" data-post="${post_id}"></a>
        <h2 class="${post_selector}__title" data-post="${post_id}" contenteditable=false></h2>
        <a class="${post_selector}__delete" data-marker="${post_id}"></a>
      </div>
      <div class="${post_selector}__main">
        <p class="${post_selector}__text" data-post="${post_id}" contenteditable=false></p>
      </div>
      <div class="${post_selector}__footer">
        <span class="${post_selector}__submit" data-post="${post_id}">submit changes</span>
        <span class="${post_selector}__name"></span>
        <span>||</span>
        <span class="${post_selector}__email"></span>
        <span class="${post_selector}__date">${new Date().getDate()}.${new Date().getMonth()}.${new Date().getHours()}.${new Date().getMinutes()}</span>
      </div>
    </div>
  `;
};

class Post extends Card {
  constructor(post, users_list, card_selector, self_close = false) {
    super(card_selector, post_htmlTemplate);
    this.title = post.title;
    this.userId = post.userId;
    this.text = post.body;
    this.post_id = post.id;
    this.name = users_list.find((e) => e.id === this.userId).name;
    this.email = users_list.find((e) => e.id === this.userId).email;
    this.self_close = self_close;
    this.card_htmlElement = post_htmlTemplate(
      this.card_selector,
      this.post_id,
      this.userId
    );
  }
  create_card(element_selectorToAdjust, position = "afterbegin") {
    try {
      document
        .querySelector(`.${element_selectorToAdjust}`)
        .insertAdjacentHTML(position, this.card_htmlElement);
      insert_text(`${this.card_selector}__title`, this.title);
      insert_text(`${this.card_selector}__text`, this.text);
      insert_text(`${this.card_selector}__name`, this.name);
      insert_text(`${this.card_selector}__email`, this.email);
      this.add_onClick_close_card();
    } catch (error) {
      console.log(error);
    }
  }
}
