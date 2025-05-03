import '../pages/index.css'; // Импорт стилей для Webpack

import { openModal, closeModal } from './modal.js' // работа с модальными окнами
import { initialCards } from './cards.js' // подгружаемые на старте карточки

const cardTemplate = document.querySelector('#card-template').content;
const cardContainer  = document.querySelector('.places__list');

const popupTypeImage = document.querySelector('.popup_type_image');
const popupImage = popupTypeImage.querySelector('.popup__image');
const popupCaption = popupTypeImage.querySelector('.popup__caption');

//-------- Добавление карточек в DOM

// Создает элемент карточки для вывода в html
// * card информация о карточке (словарь):
//   name: String
//   link: String
// * deleteCb - колбэк для удаления карточки
function createCard(card, deleteCb, clickCb) {
  // клонировать шаблон
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

  // установить значения вложенных элементов
  const imageElement = cardElement.querySelector('.card__image');
  imageElement.src = card.link;
  imageElement.alt = card.name;

  const descriptionElement = cardElement.querySelector('.card__description .card__title');
  descriptionElement.textContent = card.name;

  // добавить к иконке удаления обработчик клика,
  // по которому будет вызван deleteCb
  const deleteButton  = cardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', deleteCb);

  clickCb(imageElement);

  return cardElement;
}

// Удаляет карточку
function deleteCard(evt) {
  const deleteButton = evt.target;
  const listItem = deleteButton.closest('.places__item');
  listItem.remove();
}

// Выводит карточки на страницу
function showAllCards() {
  initialCards.forEach((item) => {
    // создать карточку
    const cardElement = createCard(item, deleteCard, clickOnImageCb);

    // добавить карточку в DOM
    cardContainer.append(cardElement);
  });
}

showAllCards();


//-------- модальные окна всякие (произвольные)
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const popupTypeEdit = document.querySelector('.popup_type_edit'); // модольное окно редактирования профиля
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

popups.forEach((item) => {
  addListeners(item.modal, item.button)
});


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
