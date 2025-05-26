import '../pages/index.css'; // Импорт стилей для Webpack

// модальное окно картинки, и её параметры (сама картинка и подпись)
const popupTypeImage = document.querySelector('.popup_type_image');
const popupImage = popupTypeImage.querySelector('.popup__image');
const popupCaption = popupTypeImage.querySelector('.popup__caption');

// контейнер, куда помещаются карточки
const cardContainer  = document.querySelector('.places__list');

// аватарка профиля
const profileImage = document.querySelector('.profile__image');

import { openModal, closeModal } from './modal.js' // работа с модальными окнами
import * as cardLib from './cards.js'

import * as api from './api.js';

//-------- Отображение карточек и информации о профиле на странице
let initialCards = [];
let userId;

//-------- Лайк карточки
// функция лайка карточки
function likeCard(likeButton, cardElement, cardId) {
  const classList = likeButton.classList;
  const req = classList.contains('card__like-button_is-active') ? api.removeLike : api.setLike;
  req(cardId)
    .then((res) => {
      cardLib.showMyLike(cardElement, res, userId);
      cardLib.showLikesCount(cardElement, res);
    })
    .catch((err) => {
      console.log(err);
    });
}

//-------- Удаление карточки
// функция удаления карточки
function deleteCard(cardElement, cardId) {
  api.deleteCard(cardId)
    .then(() => {
      cardLib.deleteCard(cardElement);
    })
    .catch((err) => {
      console.log(err);
    });
}

//-------- Выводит карточки на страницу
function showAllCards() {
  initialCards.forEach((item) => {
    // создать карточку
    const cardElement = cardLib.createCard(item, deleteCard, likeCard, clickOnImage, userId);

    // добавить карточку в DOM
    cardContainer.append(cardElement);
  });
}


//-------- установка нового аватара
function setProfileAvatar(avatarLink) {
  profileImage.style.backgroundImage = `url(${avatarLink})`;
}

// Получить информацию о пользователе и карточках через Promise.all,
// так как отборажение карточек и работа с ними напрямую зависит от
// информации о пользователе
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then((results) => {
    const userInfo = results[0];
    initialCards = results[1];

    userId = userInfo._id;

    setProfileAvatar(userInfo.avatar);
    setProfileContent(userInfo.name, userInfo.about);
    showAllCards();
  })
  .catch((err) => {
    console.log(err);
  });


//-------- валидация форм
import { enableValidation, clearValidation } from './validation.js';

const popupProperties = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(popupProperties);


//-------- обработка кнопки Submit в форме
const buttonSubmitText = {
  inProcess : "Сохранение...",
  normal : "Сохранение",
}
function renderLoading(isLoading, buttonElement) {
  buttonElement.textContent = isLoading ? buttonSubmitText.inProcess : buttonSubmitText.normal;
}


//-------- модальные окна всякие, обработка событий для открытия/закрытия модальных окон
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');

profileAddButton.addEventListener('click', function(evt) {
  clearValidation(popupNewCard.querySelector(popupProperties.formSelector), popupProperties);
  openModal(popupNewCard);
});

//-------- модальное окно редактиорования профиля
// поля input формы popupEdit
const nameInput = popupEdit.querySelector('.popup__input_type_name');
const jobInput = popupEdit.querySelector('.popup__input_type_description');

// имя профиля и работа, поля, куда надо вставить значения из nameInput и jobInput
const nameLabel = document.querySelector('.profile__title');
const jobLabel = document.querySelector('.profile__description');

// отобразить информацию о профиле
function setProfileContent(name, job) {
  nameLabel.textContent = name;
  jobLabel.textContent = job;
}

// Обработчик отправки формы
function handleEditFormSubmit(evt) {
  evt.preventDefault(); // Отменить стандартную отправку формы.

  // поменять текст на кнопке для отображения загрузки данных на сервер
  const submitButtonElement = evt.target.querySelector('.popup__button');
  renderLoading(true, submitButtonElement);

  const name = nameInput.value;
  const job = jobInput.value;

  api.updateUserInfo(name, job)
    .then((res) => {
      setProfileContent(res.name, res.about);
      closeModal(popupEdit);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, submitButtonElement);
    });
}

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
popupEdit.addEventListener('submit', handleEditFormSubmit);

// Обработчик для кнопки, открывающей форму, чтобы перезаписать значения полей ввода
profileEditButton.addEventListener('click', function(evt) {
  nameInput.value = nameLabel.textContent;
  jobInput.value = jobLabel.textContent;
  clearValidation(popupEdit.querySelector(popupProperties.formSelector), popupProperties);
  openModal(popupEdit);
});


//-------- модальное окно редактирования изображения профиля
const popupAvatar = document.querySelector('.popup_type_avatar');
const avatarLinkInput = popupAvatar.querySelector('.popup__input_type_url');

// Обработчик отправки формы
function handleAvatarSubmit(evt) {
  evt.preventDefault(); // Отменить стандартную отправку формы.

  // поменять текст на кнопке для отображения загрузки данных на сервер
  const submitButtonElement = evt.target.querySelector('.popup__button');
  renderLoading(true, submitButtonElement);

  const avatarLink = avatarLinkInput.value;

  api.updateAvatarLink(avatarLink)
    .then((res) => {
      setProfileAvatar(res.avatar);
      closeModal(popupAvatar);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, submitButtonElement);
    });
}

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
popupAvatar.addEventListener('submit', handleAvatarSubmit);

// Обработчик для кнопки, открывающей форму, чтобы перезаписать значения полей ввода
profileImage.addEventListener('click', function(evt) {
  clearValidation(popupAvatar.querySelector(popupProperties.formSelector), popupProperties);
  openModal(popupAvatar);
});


//-------- модальное окно добавления новой карточки
// поля input формы popupNewCard
const placeNameInput = popupNewCard.querySelector('.popup__input_type_card-name');
const linkInput = popupNewCard.querySelector('.popup__input_type_url');

// Обработчик «отправки» формы
function handleCardFormSubmit(evt) {
  evt.preventDefault(); // Отменить стандартную отправку формы.

  // поменять текст на кнопке для отображения загрузки данных на сервер
  const submitButtonElement = evt.target.querySelector('.popup__button');
  renderLoading(true, submitButtonElement);

  const placeName = placeNameInput.value;
  const link = linkInput.value;

  // очистить форму
  placeNameInput.value = '';
  linkInput.value = '';

  // отправить запрос на добавление новой карточки
  api.addNewCard(placeName, link)
    .then((res) => {
      // создать карточку
      const cardElement = cardLib.createCard(res, deleteCard, likeCard, clickOnImage, userId);

      // добавить карточку в DOM в начало списка
      cardContainer.prepend(cardElement);

      // закрыть модальное окно
      closeModal(popupNewCard);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, submitButtonElement);
    });
}

// Прикрепить обработчик к форме:
popupNewCard.addEventListener('submit', handleCardFormSubmit);


//-------- модальное окно картинки
function clickOnImage(imageElement) {
  // добавить картинку и подпись
  popupImage.src = imageElement.src;
  popupImage.alt = imageElement.alt;
  popupCaption.textContent = imageElement.alt;

  // открыть модальное окно
  openModal(popupTypeImage);
}
