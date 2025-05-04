import '../pages/index.css'; // Импорт стилей для Webpack

// модальное окно картинки, и её параметры (сама картинка и подпись)
const popupTypeImage = document.querySelector('.popup_type_image');
const popupImage = popupTypeImage.querySelector('.popup__image');
const popupCaption = popupTypeImage.querySelector('.popup__caption');

import { openModal, closeModal } from './modal.js' // работа с модальными окнами
import { createCard, deleteCard, likeCard, initialCards, constructCard } from './cards.js'


//-------- Выводит карточки на страницу
const cardContainer  = document.querySelector('.places__list');

function showAllCards() {
  initialCards.forEach((item) => {
    // создать карточку
    const cardElement = createCard(item, deleteCard, likeCard, clickOnImageCb);

    // добавить карточку в DOM
    cardContainer.append(cardElement);
  });
}

showAllCards();

//-------- модальные окна всякие, обработка событий для открытия/закрытия модальных окон
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const popupTypeEdit = document.querySelector('.popup_type_edit');
const popupTypeNewCard = document.querySelector('.popup_type_new-card');

const popups = [
  {
    modal : popupTypeEdit,
    button : profileEditButton,
  },
  {
    modal : popupTypeNewCard,
    button : profileAddButton,
  },
  {
    modal : popupTypeImage,
  },
];

function processClose(modal) {
  // закрыть окно
  closeModal(modal);

  // удалить слушателя
  document.removeEventListener('keydown', handleKeydownEvent);
}

function handleKeydownEvent(evt) {
  if (evt.key !== 'Escape') {
    return;
  }
  popups.forEach((item) => {
    if (item.modal.classList.contains('popup_is-opened')) {
      processClose(item.modal);
    }
  });
}

function addListeners(modal, button) {
  modal.addEventListener('click', function(evt) {
    // если кликнули за пределами модального окна
    if (!evt.target.closest('.popup__content')) {
      processClose(modal);
      return
    }

    // если кликнули по крестику
    if (evt.target.classList.contains('popup__close')) {
      processClose(modal);
    }
  });

  if (button) {
    button.addEventListener('click', function(evt) {
      // открыть модальное окно
      openModal(modal);

      // добавить слушателя, который при нажатии на кнопку ESC вызывает функцию, закрывающую модальное окно
      document.addEventListener('keydown', handleKeydownEvent);
    });
  }
}

// добавить слушателей модальным окнам
popups.forEach((item) => {
  addListeners(item.modal, item.button)
});


//-------- модальное окно редактиорования профиля
import { addSubmitProfileCb } from './profile.js'; // работа с окном редактирования профиля
addSubmitProfileCb(() => {
  closeModal(popupTypeEdit);
});


//-------- модальное окно добавления новой карточки
const formElement = document.querySelector('.popup_type_new-card');

// поля input формы formElement
const placeNameInput = formElement.querySelector('.popup__input_type_card-name');
const linkInput = formElement.querySelector('.popup__input_type_url');

// для закрытия формы после submit
const clickCbArr = [];

// Обработчик «отправки» формы
function handleFormSubmit(evt) {
  evt.preventDefault(); // Отменить стандартную отправку формы.

  const placeName = placeNameInput.value;
  const link = linkInput.value;

  // очистить форму
  placeNameInput.value = '';
  linkInput.value = '';

  // создать карточку
  const card = constructCard(placeName, link);
  const cardElement = createCard(card, deleteCard, likeCard, clickOnImageCb);

  // добавить карточку в DOM в начало списка
  cardContainer.prepend(cardElement);

  // закрыть модальное окно
  closeModal(popupTypeNewCard);
}

// Прикрепить обработчик к форме:
formElement.addEventListener('submit', handleFormSubmit);


//-------- модальное окно картинки
function clickOnImageCb(imageElement) {
  imageElement.addEventListener('click', function(evt) {
    // добавить картинку и подпись
    popupImage.src = imageElement.src;
    popupImage.alt = imageElement.alt;
    popupCaption.textContent = imageElement.alt;

    // открыть модальное окно
    openModal(popupTypeImage);

    // добавить слушателя, который при нажатии на кнопку ESC вызывает функцию, закрывающую модальное окно
    document.addEventListener('keydown', handleKeydownEvent);
  });
}
