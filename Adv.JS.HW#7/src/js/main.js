//==============
"use strict"; //+
//==============

//=========================================

//Pressets:
//--------------
let url = "https://ajax.test-danit.com/api/json";

//--------------
let target_data = {
  users: "users",
  posts: "posts",
};

//--------------
let method = {
  get: "GET",
  post: "POST",
  delete: "DELETE",
  put: "PUT",
};

//--------------
const users_targetProp = ["name", "email", "id"];

//Selectors:
//-----------------------------------
const card_selector = "card";
const window_selector = "window";
const element_toAdjustCards = "main";

//Data collectors:
//--------
let users;
let posts;

//Partial pressets:
//--------------------------------------------
let url_users = url + `/${target_data.users}`;
let url_posts = url + `/${target_data.posts}`;

//------------------------------------------------------
const load_htmlString = `<div class="spinner-container">
<svg class="spinner" viewBox="0 0 50 50">
    <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
  </svg>
</div>`;

//Get DOM elements:
//---------------------------------------------------------
const btn_addPost = document.querySelector(".header__btn");

//Service functions:
//----------------------------------------
const log = (value) => console.log(value);

//Functions:
//------------------------------------------------------
const insert_text = function (element_selector, text) {
  return document
    .querySelector("." + element_selector)
    .insertAdjacentText("afterbegin", text);
};

//Send request with options:
//----------------------------------------------------------
const send_request = function (url, method, body = false) {
  switch (method) {
    case "GET":
      return fetch(url).then(function (data) {
        return data.json();
      });
    case "DELETE":
      return fetch(url, {
        method: "DELETE",
      });
    case "POST":
      return fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      });
    case "PUT":
      return fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
  }
};

//Create obj with target properties:
//-------------------------------------------------------
function create_obj(target_obj, ...properties_toCopy) {
  let result_obj = {};
  properties_toCopy.forEach((prop) => {
    return (result_obj[prop] = target_obj[prop]);
  });
  return result_obj;
}

//Add element as HTML string on page:
//--------------------------------------
const add_htmlElementOnPage = function (
  elem_selector,
  htmlString,
  position = "afterbegin"
) {
  return document
    .querySelector(elem_selector)
    .insertAdjacentHTML(position, htmlString);
};

//Remove element from page:
//-----------------------------------------------------------
const remove_node = function (element_selector, log = false) {
  try {
    document.querySelector(element_selector).remove();
  } catch (error) {
    if (error instanceof TypeError) {
      console.log(
        `%c Probably incorrect selector name or there is no element with ${element_selector} selector on page.`,
        "background-color:orange; color: blue"
      );
    } else console.log(error);
  } finally {
    if (log)
      return document.querySelector(element_selector)
        ? console.log(
            `%c ${element_selector} exist`,
            "background-color:orange; color: blue"
          )
        : console.log(
            `%c There is no element with ${element_selector} selector`,
            "background-color:orange; color: blue"
          );
  }
};

//Alert window as html string certain text: <-------------Skip!
//-----------------------------------------------------
let alert_message = function (text_toShow) {
  return `<div class="alert__window">${text_toShow}</div>`;
};

//--------------
//Clock on page:
clock("clock");
clock.turn_on();

//--------------
//Load animation:
add_htmlElementOnPage("." + element_toAdjustCards, load_htmlString);

//=======================================================================================================
//Create cards:

//Send request
//----------------------------------
Promise.all([
  send_request(url_users, method.get),
  send_request(url_posts, method.get),
])

  //Receiv data:
  //--------------
  .then(function (value) {
    let [users_data, posts_data] = [...value];
    users = users_data
      .sort((a, b) => a["id"] - b["id"])
      .map((a) => create_obj(a, ...users_targetProp));
    posts = posts_data.map((a) => create_obj(a, ...Object.keys(posts_data[0])));
    return [users, posts];
  })

  //Creating posts:
  //------------------------------------------------------------------------
  .then(function ([users, posts]) {
    return posts.map((user_post) => new Post(user_post, users, card_selector));
  })
  .then(function (cards) {
    cards.forEach((card) => card.create_card(element_toAdjustCards));

    //Remove loading animation:
    //---------------------------
    remove_node(".spinner-container");

    //Deleting:
    //Add Listener to body for remove btn:
    //------------------------------------------
    document.body.addEventListener("click", (event) => {
      if (event.target.hasAttribute("data-marker")) {

        //Send request:
        //----------------------------------------------------------------
        send_request(
          `${url_posts}/${event.target.getAttribute("data-marker")}`,
          method.delete
        ).then(function (response) {
          console.log(response);
          if (
            (response.status === 200,
            response.ok,
            document.querySelector(
              `.card[data-id="${event.target.getAttribute("data-marker")}"]`
            ))
          ) {
            document
              .querySelector(
                `.card[data-id="${event.target.getAttribute("data-marker")}"]`
              )
              .remove();
          } else {
            console.log("Processing: ", response);
          }
        });
      }
    });
  });

//=======================================================================================================
//Add post:

//Add event listener for add_post btn:
//-----------------------------------------------
btn_addPost.addEventListener("click", (event) => {
  let window = new Modal_Window(window_selector, window_htmlTemplate);
  window.create_window("main");
  let edit_windowBtn = document.querySelector(".window__edit");
  edit_windowBtn.addEventListener("click", (event) => {

    //Collect data on input text:
    //----------------------------------------------------------------
    let input_title = document.querySelector(".window__input-title");
    let input_text = document.querySelector(".window__input-text");
    if (input_title.value && input_text.value) {
      let body = {
        title: input_title.value,
        body: input_text.value,
        userId: 1,
        id: document.querySelectorAll(`.card[data-userId="1"]`).length,
      };

      //Send request:
      //--------------------------------------------------------------
      Promise.all([
        send_request(url_posts, method.post, body),
        send_request(url_users, method.get),
      ])

        //Collect requred data:
        .then(function (res) {
          let [, users_list] = [...res];
          return users_list;
        })

        //Create post:
        //------------------------------------------------------------
        .then((users_list) => new Post(body, users_list, card_selector))
        .then((post) => post.create_card(element_toAdjustCards))
        .then(function (e) {
          remove_node("." + window_selector);
        });
    }
  });
});

//=======================================================================================================
//Edit post:

//Add Listener on edit_btn:
//------------------------------------------------------------------------
document.querySelector(".main").addEventListener("click", (event) => {
  if (event.target.className === "card__edit") {

    //Submit btn on window on click:
    //-----------------------------------------------------------------
    let submit_btn = document.querySelector(
      `.card__submit[data-post="${event.target.getAttribute("data-post")}"]`
    );
    submit_btn.style.display = "block";
    let parent_post = event.target.closest("." + card_selector);
    let post_id = event.target.getAttribute("data-post");
    let title = document.querySelector(`.card__title[data-post="${post_id}"]`);
    let text = document.querySelector(`.card__text[data-post="${post_id}"]`);

    //Save previous text:
    //-----------------------------
    let backUp_postData = {
      post_id: post_id,
      title_content: title.value,
      text_content: text.value,
    };

    //Editable fields of window:
    //----------------------------------------------
    title.setAttribute("contenteditable", true);
    text.setAttribute("contenteditable", true);

    //Add actions on event "click" for submit_btn:
    //---------------------------------------------------------------
    submit_btn.addEventListener("click", function listener(event) {
      title.setAttribute("contenteditable", false);
      text.setAttribute("contenteditable", false);
      submit_btn.removeEventListener("click", listener);
      submit_btn.style.display = "none";

      //Collect input data:
      //---------------------------------------------
      let body = {
        id: post_id,
        title: title.value,
        body: text.value,
        userId: parent_post.getAttribute("data-userId"),
      };

      //Send request:
      //------------------------------------------------------------------------
      send_request(url_posts + "/" + body.id, method.put, body).then(function (
        e
      ) {
        if (e.status === 200 && e.ok) {
          return;
        } else {
          return (
            title.innerHTML(backUp_postData.title_content),
            text.innerHTML(backUp_postData.text_content),
            console.log("Try again later")
          );
        }
      });
    });
  }
});
