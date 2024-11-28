export default class UserInfo {
  constructor({ nameSelector, jobSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._jobElement = document.querySelector(jobSelector);
    this._userId = null;
  }

  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      job: this._jobElement.textContent,
      _id: this._userId,
    };
  }

  setUserInfo({ name, job, _id }) {
    this._nameElement.textContent = name;
    this._jobElement.textContent = job;
    if (_id) this._userId = _id;
  }
}
