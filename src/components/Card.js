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
    this._id = data._id;
    this._userId = data.userId;
    this._ownerId = data.owner ? data.owner._id : null;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeClick = handleLikeClick;
    this._isLiked = data.isLiked || false;
  }

  _setEventListeners() {
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );
    const cardImageElement = this._cardElement.querySelector(".card__image");

    this._likeButton.addEventListener("click", () => {
      if (this._likeButton.disabled) return;
      this._likeButton.disabled = true;
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
    if (this._isLiked) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
  }

  isLiked() {
    return this._isLiked;
  }

  setLikes(isLiked) {
    this._isLiked = isLiked;
    this._updateLikesView();
    this._likeButton.disabled = false;
  }

  getView() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    const cardImageElement = this._cardElement.querySelector(".card__image");
    cardImageElement.src = this._link;
    cardImageElement.alt = this._name;

    this._cardElement.setAttribute("data-card-id", this._id);
    this._cardElement.querySelector(".card__title").textContent = this._name;

    this._setEventListeners();
    this._updateLikesView();

    return this._cardElement;
  }
}
