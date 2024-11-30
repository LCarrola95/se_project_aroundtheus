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

//Functions
function handleSubmit(request, popupInstance, loadingText = "Saving...") {
  popupInstance.renderLoading(true, loadingText);
  request()
    .then(() => {
      popupInstance.resetForm();
      popupInstance.close();
    })
    .catch(console.error)
    .finally(() => {
      popupInstance.renderLoading(false);
    });
}

function handleDeleteButtonClick(cardId) {
  deleteConfirmPopup.open(cardId);
}

function handleLikeButtonClick(card, cardId) {
  const isLiked = card.isLiked();

  const likeAction = isLiked ? api.dislikeCard(cardId) : api.likeCard(cardId);

  likeAction
    .then((updatedCard) => {
      card.setLikes(updatedCard.isLiked);
    })
    .catch((err) => {
      console.error("Like operation failed:", err);

      if (card._likeButton) {
      }
    });
}

function handleImageClick(cardData) {
  imagePopup.open({ name: cardData.name, link: cardData.link });
}

function createCard(cardData) {
  const card = new Card(
    {
      ...cardData,
      userId: userInfo.getUserInfo()._id,
      owner: cardData.owner || { _id: cardData.ownerId },
      isLiked: cardData.isLiked,
    },
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

// Edit Profile
const profilePopup = new PopupWithForm("#profile-edit-modal", (formData) => {
  function makeRequest() {
    return api
      .updateUserProfile({
        name: formData.title,
        about: formData.description,
      })
      .then((updatedUser) => {
        userInfo.setUserInfo({
          name: updatedUser.name,
          job: updatedUser.about,
        });
      });
  }
  handleSubmit(makeRequest, profilePopup);
});
profilePopup.setEventListeners();

// Add New Card
const addCardPopup = new PopupWithForm("#profile-card-modal", (formData) => {
  function makeRequest() {
    return api
      .addCard({
        name: formData["title"],
        link: formData["url"],
      })
      .then((newCard) => {
        const newCardElement = createCard({
          ...newCard,
          userId: userInfo.getUserInfo()._id,
        });
        cardSection.addItem(newCardElement);
        cardFormValidator.disableButton();
      });
  }
  handleSubmit(makeRequest, addCardPopup);
});
addCardPopup.setEventListeners();

// Avatar Update
const avatarPopup = new PopupWithForm("#avatar-edit-modal", (formData) => {
  function makeRequest() {
    return api
      .updateUserAvatar({
        avatar: formData["avatar-link"],
      })
      .then((data) => {
        userInfo.setUserInfo({ avatar: data.avatar });
        avatarFormValidator.disableButton();
      });
  }
  handleSubmit(makeRequest, avatarPopup);
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
});

// Initial Data Fetch
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, initialCards]) => {
    userInfo.setUserInfo({
      name: userData.name,
      job: userData.about,
      _id: userData._id,
      avatar: userData.avatar,
    });

    cardSection.renderItems(
      initialCards.map((card) => ({
        ...card,
        userId: userData._id,
        isLiked: card.isLiked,
      }))
    );
  })
  .catch((err) => console.error(err));
