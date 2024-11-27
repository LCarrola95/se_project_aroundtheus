import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js";
import PopupWithConfirm from "../components/PopupWithConfirm.js";
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
const deleteConfirmPopup = new PopupWithConfirm(
  "#delete-card-modal",
  (cardId) => {
    deleteConfirmPopup.renderLoading(true);
    api
      .deleteCard(cardId)
      .then(() => {
        const cardElement = document.querySelector(
          `[data-card-id="${cardId}"]`
        );
        if (cardElement) {
          cardElement.remove();
        }
        deleteConfirmPopup.close();
      })
      .catch((err) => console.error(err))
      .finally(() => {
        deleteConfirmPopup.renderLoading(false);
      });
  }
);
deleteConfirmPopup.setEventListeners();

function handleDeleteButtonClick(cardId) {
  deleteConfirmPopup.open(cardId);
}

function handleLikeButtonClick(card, cardId) {
  const isLiked = card.isLiked();

  const likeAction = isLiked ? api.dislikeCard(cardId) : api.likeCard(cardId);

  likeAction
    .then((updatedCard) => {
      card.setLikes([{ _id: updatedCard.isLiked ? card._userId : null }]);
    })
    .catch((err) => console.error(err));
}

function handleImageClick(cardData) {
  imagePopup.open({ name: cardData.name, link: cardData.link });
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
const profileImage = document.querySelector(".profile__image");
const profileEditButton = document.querySelector("#profile-edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");
const profileNameInput = document.querySelector("#profile-name-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const profileImageContainer = document.querySelector(
  ".profile__image-container"
);

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

const profilePopup = new PopupWithForm("#profile-edit-modal", (formData) => {
  profilePopup.renderLoading(true);
  api
    .updateUserProfile({ name: formData.title, about: formData.description })
    .then((updatedUser) => {
      userInfo.setUserInfo({
        name: updatedUser.name,
        job: updatedUser.about,
      });
      profilePopup.close();
    })
    .catch((err) => console.error(err))
    .finally(() => {
      profilePopup.renderLoading(false);
    });
});
profilePopup.setEventListeners();

const addCardPopup = new PopupWithForm("#profile-card-modal", (formData) => {
  addCardPopup.renderLoading(true);
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
    .catch((err) => console.error(err))
    .finally(() => {
      addCardPopup.renderLoading(false);
    });
});
addCardPopup.setEventListeners();

// Avatar Update Popup
const avatarPopup = new PopupWithForm("#avatar-edit-modal", (formData) => {
  avatarPopup.renderLoading(true);
  api
    .updateUserAvatar({ avatar: formData["avatar-link"] })
    .then((data) => {
      profileImage.src = data.avatar;
      avatarPopup.close();
    })
    .catch((err) => {
      console.error("Error updating avatar:", err);
    })
    .finally(() => {
      avatarPopup.renderLoading(false);
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

profileImageContainer.addEventListener("click", () => {
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

    profileImageContainer.src = userData.avatar;
    cardSection.renderItems(
      initialCards.map((card) => ({
        ...card,
        userId: userData._id,
      }))
    );
  })
  .catch((err) => console.error(err));
