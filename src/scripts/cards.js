const initialCards = [
    {
      name: "Архыз",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
    },
    {
      name: "Челябинская область",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
    },
    {
      name: "Иваново",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
    },
    {
      name: "Камчатка",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
    },
    {
      name: "Холмогорский район",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
    },
    {
      name: "Байкал",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
    }
];

function constructCard(placeName, link) {
  return {
    name: placeName,
    link: link,
  }
}

//-------- Добавление карточек в DOM
const cardTemplate = document.querySelector('#card-template').content;

// Создает элемент карточки для вывода в html
// * card информация о карточке (словарь):
//   name: String
//   link: String
// * deleteCb - колбэк для удаления карточки
// * clickCb - колбэк для обработки нажатия на картинку
function createCard(card, deleteCb, likeCb, clickCb) {
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

  // добавить к иконке лайка карточки обработчик клика,
  // по которому будет вызван likeCb
  const likeButton  = cardElement.querySelector('.card__like-button');
  likeButton.addEventListener('click', likeCb);

  clickCb(imageElement);

  return cardElement;
}

// Удаляет карточку
function deleteCard(evt) {
  const deleteButton = evt.target;
  const listItem = deleteButton.closest('.places__item');
  listItem.remove();
}

//-------- функция лайка карточки
function handleLikeButtonClickEvent(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

export { createCard, deleteCard, handleLikeButtonClickEvent as likeCard, initialCards, constructCard };
