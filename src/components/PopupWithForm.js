import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._formElement = this._popupElement.querySelector(".modal__form");
    this._inputList = Array.from(
      this._formElement.querySelectorAll(".modal__input")
    );
    this._submitButton = this._formElement.querySelector(".modal__button");
    this._submitButtonText = this._submitButton.textContent;
  }

  resetForm() {
    this._formElement.reset();
  }

  _getInputValues() {
    const formValues = {};
    this._inputList.forEach((input) => {
      formValues[input.name] = input.value;
    });
    return formValues;
  }

  setEventListeners() {
    super.setEventListeners();
    this._formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      this._handleFormSubmit(this._getInputValues());
    });
  }

  renderLoading(isLoading, loadingText = "Saving...") {
    if (this._submitButton) {
      this._submitButton.textContent = isLoading
        ? loadingText
        : this._submitButtonText;
    }
  }

  close() {
    super.close();
  }
}
