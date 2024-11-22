export default class Card {
  constructor(
    data,
    cardSelector,
    handleImageClick,
    handleDeleteClick,
    handleLikeClick
  ) {
    this._name = data.name;
    this._link = data.link;
    this._likes = data.likes || [];
    this._id = data._id;
    this._userId = data.userId;
    this._ownerId = data.ownerId;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeClick = handleLikeClick;
  }

  _setEventListeners() {
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );
    const cardImageElement = this._cardElement.querySelector(".card__image");

    this._likeButton.addEventListener("click", () => {
      this._handleLikeClick(this, this._id);
    });

    if (this._deleteButton) {
      this._deleteButton.addEventListener("click", () => {
        this._handleDeleteClick(this._id);
      });
    }

    cardImageElement.addEventListener("click", () => {
      this._handleImageClick({ link: this._link, name: this._name });
    });
  }

  _updateLikesView() {
    const likeCountElement =
      this._cardElement.querySelector(".card__like-count");
    likeCountElement.textContent = this._likes.length;

    if (this.isLiked()) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
  }

  isLiked() {
    return this._likes.some((user) => user._id === this._userId);
  }

  setLikes(likes) {
    this._likes = likes;
    this._updateLikesView();
  }

  removeCard() {
    this._cardElement.remove();
    this._cardElement = null;
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

    if (this._ownerId !== this._userId) {
      this._deleteButton = this._cardElement.querySelector(
        ".card__delete-button"
      );
      if (this._deleteButton) this._deleteButton.remove();
    }

    this._setEventListeners();
    this._updateLikesView();

    return this._cardElement;
  }
}
