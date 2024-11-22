import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js";
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

// Delete Confirmation Popup
const deletePopup = new PopupWithForm("#delete-card-modal", (cardId) => {
  api
    .deleteCard(cardId)
    .then(() => {
      document.getElementById(cardId).remove();
      deletePopup.close();
    })
    .catch((err) => console.error(err));
});
deletePopup.setEventListeners();

function handleDeleteButtonClick(cardId) {
  deletePopup.open(cardId);
}

function handleLikeButtonClick(card, cardId) {
  const isLiked = card.isLiked();

  const likeAction = isLiked ? api.dislikeCard(cardId) : api.likeCard(cardId);

  likeAction
    .then((updatedCard) => {
      card.updateLikes(updatedCard.likes.length);
      card.toggleLike();
    })
    .catch((err) => console.error(err));
}

function createCard(cardData) {
  const card = new Card(
    cardData,
    "#card-template",
    handleImageClick,
    handleDeleteButtonClick,
    handleLikeButtonClick
  );
  return card.getView();
}

// DOM elements
const profileEditButton = document.querySelector("#profile-edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");
const profileNameInput = document.querySelector("#profile-name-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const profileImage = document.querySelector(".profile__image");

// Instantiate Form Validators
const profileFormValidator = new FormValidator(
  validationConfig,
  document.querySelector("#profile-edit-form")
);
const cardFormValidator = new FormValidator(
  validationConfig,
  document.querySelector("#add-card-form")
);
const avatarFormValidator = new FormValidator(
  validationConfig,
  document.querySelector("#avatar-edit-form")
);

profileFormValidator.enableValidation();
cardFormValidator.enableValidation();
avatarFormValidator.enableValidation();
cardFormValidator.disableButton();

// Instantiate UserInfo Class
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
});

// Section to Render Cards
const cardSection = new Section(
  {
    items: [],
    renderer: (cardData) => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
    },
  },
  ".cards__list"
);

// Profile Edit Popup
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

// Add Card Popup
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

// Avatar Update Popup
const avatarPopup = new PopupWithForm("#avatar-edit-modal", (formData) => {
  api
    .updateUserAvatar({ avatar: formData["avatar-link"] })
    .then((data) => {
      profileImage.src = data.avatar;
      avatarPopup.close();
    })
    .catch((err) => {
      console.error("Error updating avatar:", err);
      alert("Failed to update avatar. Please try again.");
    });
});
avatarPopup.setEventListeners();

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

profileImage.addEventListener("click", () => {
  avatarPopup.open();
  avatarFormValidator.resetValidation();
});

// Initial Data Fetch
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, initialCards]) => {
    userInfo.setUserInfo({
      name: userData.name,
      job: userData.about,
    });

    profileImage.src = userData.avatar;
    cardSection.renderItems(initialCards);
  })
  .catch((err) => console.error(err));
