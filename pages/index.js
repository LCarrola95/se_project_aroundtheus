import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";

// Initial card data
const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
  },
];

const cardData = {
  name: "",
  link: "",
};

const card = new Card(cardData, "#card-template");
card.getView();

// DOM Elements
const profileEditButton = document.querySelector("#profile-edit-button");
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileCloseButton = profileEditModal.querySelector(
  "#modal-close-button"
);

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileNameInput = document.querySelector("#profile-name-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const profileEditForm = profileEditModal.querySelector("#profile-edit-form");
const cardListElement = document.querySelector(".cards__list");

const cardAddForm = document.querySelector("#add-card-form");
const cardAddModal = document.querySelector("#profile-card-modal");
const addNewCardButton = document.querySelector(".profile__add-button");
const addCloseButton = cardAddModal.querySelector("#modal-close-button");

const imagePreviewModal = document.querySelector("#image-modal");
const modalImageElement = imagePreviewModal.querySelector(".modal__image");
const modalCaption = imagePreviewModal.querySelector(".modal__caption");
const imageCloseButton = imagePreviewModal.querySelector("#modal-close-button");

const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;

//validation config
const validationConfig = {
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const profileFormValidator = new FormValidator(
  validationConfig,
  profileEditForm
);
const cardFormValidator = new FormValidator(validationConfig, cardAddForm);

profileFormValidator.enableValidation();
cardFormValidator.enableValidation();

// Functions
function openModal(modal) {
  modal.classList.add("modal_opened");
  window.addEventListener("keydown", handleEscape);
  modal.addEventListener("mousedown", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  window.removeEventListener("keydown", handleEscape);
  modal.removeEventListener("mousedown", handleOverlayClick);
}

function handleEscape(e) {
  if (e.key === `Escape`) {
    const openedModal = document.querySelector(".modal_opened");
    closeModal(openedModal);
  }
}

function handleOverlayClick(e) {
  if (e.target === e.currentTarget) {
    closeModal(e.target);
  }
}

/*function getCardElement(cardData) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardTitleElement = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_active");
  });

  deleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImageElement.addEventListener("click", () => {
    modalImageElement.src = cardData.link;
    modalImageElement.alt = cardData.name;
    modalCaption.textContent = cardData.name;
    openModal(imagePreviewModal);
  });

  cardImageElement.src = cardData.link;
  cardImageElement.alt = cardData.name;
  cardTitleElement.textContent = cardData.name;

  return cardElement;
}*/

// Function to handle the image click and open the modal
function handleImageClick(card) {
  modalImageElement.src = card._link;
  modalImageElement.alt = card._name;
  modalCaption.textContent = card._name;
  openModal(imagePreviewModal);
}

// Render initial cards
initialCards.forEach((cardData) => {
  const card = new Card(cardData, "#card-template", handleImageClick);
  const cardElement = card.getView();
  cardListElement.append(cardElement);
});

// Adding a new card via form submission
cardAddForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = e.target.title.value;
  const url = e.target.url.value;

  const card = new Card(
    { name: title, link: url },
    "#card-template",
    handleImageClick
  );
  const newCardElement = card.getView();

  cardListElement.prepend(newCardElement);
  cardAddForm.reset();
  cardFormValidator.resetValidation();
  closeModal(cardAddModal);
});

function handleProfileEditSubmit(e) {
  e.preventDefault();
  profileTitle.textContent = profileNameInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closeModal(profileEditModal);
}

// Event Listeners
profileEditButton.addEventListener("click", () => {
  profileNameInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  profileFormValidator.resetValidation();
  openModal(profileEditModal);
});

addNewCardButton.addEventListener("click", () => {
  openModal(cardAddModal);
});

profileCloseButton.addEventListener("click", () =>
  closeModal(profileEditModal)
);
addCloseButton.addEventListener("click", () => closeModal(cardAddModal));
imageCloseButton.addEventListener("click", () => closeModal(imagePreviewModal));
profileEditForm.addEventListener("submit", handleProfileEditSubmit);

/*cardAddForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = e.target.title.value;
  const url = e.target.url.value;

  const newCardElement = getCardElement({
    name: title,
    link: url,
  });

  cardListElement.prepend(newCardElement);

  cardAddForm.reset();

  closeModal(cardAddModal);
});

// Render initial cards
initialCards.forEach((cardData) => {
  const cardElement = getCardElement(cardData);
  cardListElement.append(cardElement);
});*/
