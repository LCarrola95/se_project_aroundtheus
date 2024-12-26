export default class UserInfo {
  constructor({ nameSelector, jobSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._jobElement = document.querySelector(jobSelector);
    this._avatarElement = document.querySelector(".profile__image");
    this._userId = null;
  }

  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      job: this._jobElement.textContent,
      _id: this._userId,
      avatar: this._avatarElement.src,
    };
  }

  setUserInfo({ name, job, _id, avatar }) {
    if (name) this._nameElement.textContent = name;
    if (job) this._jobElement.textContent = job;
    if (_id) this._userId = _id;
    if (avatar) this._avatarElement.src = avatar;
  }
}
