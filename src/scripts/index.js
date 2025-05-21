import '../pages/index.css'; // Импорт стилей для Webpack

// модальное окно картинки, и её параметры (сама картинка и подпись)
const popupTypeImage = document.querySelector('.popup_type_image');
const popupImage = popupTypeImage.querySelector('.popup__image');
const popupCaption = popupTypeImage.querySelector('.popup__caption');

import { openModal, closeModal } from './modal.js' // работа с модальными окнами
import { createCard, deleteCard, likeCard, constructCard } from './cards.js'
import { initialCards } from './initial_cards.js'


//-------- Выводит карточки на страницу
const cardContainer  = document.querySelector('.places__list');

function showAllCards() {
  initialCards.forEach((item) => {
    // создать карточку
    const cardElement = createCard(item, deleteCard, likeCard, clickOnImage);

    // добавить карточку в DOM
    cardContainer.append(cardElement);
  });
}

showAllCards();


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

// Обработчик «отправки» формы
function handleEditFormSubmit(evt) {
  evt.preventDefault(); // Отменить стандартную отправку формы.

  const name = nameInput.value;
  const job = jobInput.value;

  nameLabel.textContent = name;
  jobLabel.textContent = job;

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
