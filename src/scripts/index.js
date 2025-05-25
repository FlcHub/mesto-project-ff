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
import { createCard, deleteCard, constructCard } from './cards.js'

import * as api from './api.js';

const hiddenElementClass = 'element-hidden';

//-------- Отображение карточек и информации о профиле на странице
let initialCards = [];
let userInfo = [];

//-------- Лайк карточки

// проверить, если ли на карточке мой лайк
function hasCardMyLike(card) {
  return card.likes.some((item) => {
    return item._id === userInfo._id;
  });
}

// отобразить мой лайк, если он есть
function showMyLike(card, cardElement) {
  const likeButton  = cardElement.querySelector('.card__like-button');
  const classList = likeButton.classList;

  if (!hasCardMyLike(card)) {
    classList.remove('card__like-button_is-active');
  } else {
    classList.add('card__like-button_is-active');
  }
}

// отобразить количество лайков
function showLikesCount(card, cardElement) {
  // элемент с количеством лайков
  const counterElement = cardElement.querySelector('.card__like-count');

  // если лайков нет, то спрятать количество лайков вообще
  const likesCount = card.likes.length;
  if (likesCount === 0) {
    counterElement.classList.add(hiddenElementClass);
    return;
  }

  // иначе отобразить число лайков
  counterElement.classList.remove(hiddenElementClass);
  counterElement.textContent = likesCount;
}

// функция лайка карточки
function likeCard(likeButton, cardElement, cardId) {
  const classList = likeButton.classList;
  if (classList.contains('card__like-button_is-active')) {
    api.removeLike(cardId)
      .then((res) => {
        showMyLike(res, cardElement);
        showLikesCount(res, cardElement);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    api.setLike(cardId)
      .then((res) => {
        showMyLike(res, cardElement);
        showLikesCount(res, cardElement);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

//-------- Удаление карточки карточки
function isMyCard(card) {
  return card._id === userInfo._id;
}

function showDeleteButton(card, cardElement) {
  if (!isMyCard(card)) {
    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.classList.add(hiddenElementClass);
  }
}

//-------- Выводит карточки на страницу
function showAllCards() {
  initialCards.forEach((item) => {
    // создать карточку
    const cardElement = createCard(item, deleteCard, likeCard, clickOnImage);

    // отобразить состояние лайков
    showLikesCount(item, cardElement);
    showMyLike(item, cardElement);

    // отобразить/скрыть корзинку удаления карточки
    showDeleteButton(item, cardElement);

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
    userInfo = results[0];
    initialCards = results[1];

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

  const name = nameInput.value;
  const job = jobInput.value;

  api.updateUserInfo(name, job)
    .then((res) => {
      userInfo.name = res.name;
      userInfo.about = res.about;
      setProfileContent(userInfo.name, userInfo.about);
    })
    .catch((err) => {
      console.log(err);
    });

  closeModal(popupEdit);
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

  const avatarLink = avatarLinkInput.value;

  api.updateAvatarLink(avatarLink)
    .then((res) => {
      userInfo.avatar = res.avatar;
      setProfileAvatar(userInfo.avatar);
    })
    .catch((err) => {
      console.log(err);
    });

  closeModal(popupAvatar);
}

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
popupAvatar.addEventListener('submit', handleAvatarSubmit);

// Обработчик для кнопки, открывающей форму, чтобы перезаписать значения полей ввода
profileImage.addEventListener('click', function(evt) {
  avatarLinkInput.value = userInfo.avatar;
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

  const placeName = placeNameInput.value;
  const link = linkInput.value;

  // очистить форму
  placeNameInput.value = '';
  linkInput.value = '';

  // создать карточку
  const card = constructCard(placeName, link);
  const cardElement = createCard(card, deleteCard, likeCard, clickOnImage);

  // добавить карточку в DOM в начало списка
  cardContainer.prepend(cardElement);

  // закрыть модальное окно
  closeModal(popupNewCard);
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
