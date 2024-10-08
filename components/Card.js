export default class Card {
  constructor(data, cardSelector, handleImageClick) {
    this._name = data.name;
    this._link = data.link;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
  }

  _setEventListeners() {
    const likeButton = this._cardElement.querySelector(".card__like-button");
    const deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );
    const cardImageElement = this._cardElement.querySelector(".card__image");

    likeButton.addEventListener("click", () => {
      this._handleLikeIcon();
    });

    deleteButton.addEventListener("click", () => {
      this._handleDeleteCard();
    });

    cardImageElement.addEventListener("click", () => {
      this._handleImageClick({ link: this._link, name: this._name });
    });
  }

  _handleLikeIcon() {
    this._cardElement
      .querySelector(".card__like-button")
      .classList.toggle("card__like-button_active");
  }

  _handleDeleteCard() {
    this._cardElement.remove();
  }

  getView() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    const cardImageElement = this._cardElement.querySelector(".card__image");
    cardImageElement.src = this._link;
    cardImageElement.alt = this._name;

    this._cardElement.querySelector(".card__title").textContent = this._name;

    this._setEventListeners();

    return this._cardElement;
  }
}
