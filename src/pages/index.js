import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js"; // Import Api class
import { validationConfig } from "../utils/constants.js";
import "../pages/index.css";

// API Initialization
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "81e44564-32cf-4c2a-b8fb-18b8f71d8ac2",
    "Content-Type": "application/json",
  },
});

// Instantiate PopupWithImage
const imagePopup = new PopupWithImage("#image-modal");
imagePopup.setEventListeners();

// DOM elements
const profileEditButton = document.querySelector("#profile-edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");
const profileNameInput = document.querySelector("#profile-name-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);

// Instantiate form validators
const profileFormValidator = new FormValidator(
  validationConfig,
  document.querySelector("#profile-edit-form")
);
const cardFormValidator = new FormValidator(
  validationConfig,
  document.querySelector("#add-card-form")
);
profileFormValidator.enableValidation();
cardFormValidator.enableValidation();
cardFormValidator.disableButton();

// Instantiate UserInfo class
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
});

function createCard(cardData) {
  const card = new Card(cardData, "#card-template", handleImageClick);
  return card.getView();
}

// Section to render cards
const cardSection = new Section(
  {
    items: [], // Items will be dynamically loaded
    renderer: (cardData) => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
    },
  },
  ".cards__list"
);

// Create PopupWithForm for profile edit
const profilePopup = new PopupWithForm("#profile-edit-modal", (formData) => {
  api
    .updateUserProfile({ name: formData.title, about: formData.description })
    .then((updatedUser) => {
      userInfo.setUserInfo({
        name: updatedUser.name,
        job: updatedUser.about,
      });
      profilePopup.close();
    })
    .catch((err) => console.error(err));
});
profilePopup.setEventListeners();

// Create PopupWithForm for card addition
const addCardPopup = new PopupWithForm("#profile-card-modal", (formData) => {
  const cardData = { name: formData["title"], link: formData["url"] };
  api
    .addCard(cardData)
    .then((newCard) => {
      const newCardElement = createCard(newCard);
      cardSection.addItem(newCardElement);
      addCardPopup.close();
      addCardPopup.resetForm();
      cardFormValidator.disableButton();
    })
    .catch((err) => console.error(err));
});
addCardPopup.setEventListeners();

// Functions
function handleImageClick(cardData) {
  imagePopup.open(cardData);
}

// Event Listeners
profileEditButton.addEventListener("click", () => {
  const currentUserInfo = userInfo.getUserInfo();

  profileNameInput.value = currentUserInfo.name;
  profileDescriptionInput.value = currentUserInfo.job;

  profilePopup.open();
  profileFormValidator.resetValidation();
});

addNewCardButton.addEventListener("click", () => {
  addCardPopup.open();
});

// Initial Data Fetch
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, initialCards]) => {
    userInfo.setUserInfo({
      name: userData.name,
      job: userData.about,
    });

    cardSection.renderItems(initialCards);
  })
  .catch((err) => console.error(err));
