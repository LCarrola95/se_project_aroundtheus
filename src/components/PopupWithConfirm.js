import Popup from "./Popup.js";

export default class PopupWithConfirm extends Popup {
  constructor(popupSelector, handleConfirm) {
    super(popupSelector);
    this._handleConfirm = handleConfirm;
    this._form = this._popupElement.querySelector("#delete-card-form");
    this._submitButton = this._form.querySelector(".modal__button");
    this._cardId = null;
  }

  open(cardId) {
    this._cardId = cardId;
    super.open();
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._handleConfirm(this._cardId);
    });
  }

  renderLoading(isLoading) {
    if (this._submitButton) {
      this._submitButton.textContent = isLoading ? "Deleting..." : "Yes";
    }
  }

  close() {
    super.close();
    this._cardId = null;
  }
}
