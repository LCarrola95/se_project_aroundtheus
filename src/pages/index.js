import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import { initialCards, validationConfig } from "../utils/constants.js";
import "../pages/index.css";

// DOM elements
const profileEditButton = document.querySelector("#profile-edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");

// Instantiate PopupWithImage
const imagePopup = new PopupWithImage("#image-modal");
imagePopup.setEventListeners();

// Section to render initial cards
const cardSection = new Section(
  {
    items: initialCards,
    renderer: (cardData) => {
      const card = new Card(cardData, "#card-template", handleImageClick);
      const cardElement = card.getView();
      cardSection.addItem(cardElement);
    },
  },
  ".cards__list"
);

cardSection.renderItems();

// Initialize form validators
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

// Create PopupWithForm for profile edit
const profilePopup = new PopupWithForm("#profile-edit-modal", (formData) => {
  userInfo.setUserInfo({
    name: formData.title,
    job: formData.description,
  });
  profilePopup.close();
});
profilePopup.setEventListeners();

// Create PopupWithForm for card addition
const addCardPopup = new PopupWithForm("#profile-card-modal", (formData) => {
  const cardData = { name: formData["title"], link: formData["url"] };
  const newCardElement = new Card(
    cardData,
    "#card-template",
    handleImageClick
  ).getView();
  cardSection.addItem(newCardElement);
  addCardPopup.close();
  cardFormValidator.disableButton();
});
addCardPopup.setEventListeners();

// Functions
function handleImageClick(cardData) {
  imagePopup.open(cardData);
}

// Event Listeners
profileEditButton.addEventListener("click", () => {
  const currentUserInfo = userInfo.getUserInfo();
  document.querySelector("#profile-name-input").value = currentUserInfo.name;
  document.querySelector("#profile-description-input").value =
    currentUserInfo.job;
  profilePopup.open();
  profileFormValidator.resetValidation();
});

addNewCardButton.addEventListener("click", () => {
  addCardPopup.open();
  cardFormValidator.resetValidation();
});
