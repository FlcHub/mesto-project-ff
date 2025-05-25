//-------- Создание карточек для добавления в DOM
const cardTemplate = document.querySelector('#card-template').content;

// Создает элемент карточки для вывода в html
// * card информация о карточке (словарь):
//   name: String
//   link: String
// * deleteCard: function   - функция-обработчик события клика по иконке удаления карточки
// * likeCard: function     - функция-обработчик события клика по иконке  лайка карточки
// * clickOnImage: function - функция-обработчик события нажатия на картинку
function createCard(card, deleteCard, likeCard, clickOnImage) {
  // клонировать шаблон
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

  // установить значения вложенных элементов
  const imageElement = cardElement.querySelector('.card__image');
  imageElement.src = card.link;
  imageElement.alt = card.name;

  const descriptionElement = cardElement.querySelector('.card__description .card__title');
  descriptionElement.textContent = card.name;

  // добавить к иконке удаления обработчик клика,
  // по которому будет вызван deleteCard
  const deleteButton  = cardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', () => { deleteCard(cardElement, card._id) });

  // добавить к иконке лайка карточки обработчик клика,
  // по которому будет вызван likeCard
  const likeButton  = cardElement.querySelector('.card__like-button');
  likeButton.addEventListener('click', () => { likeCard(likeButton, cardElement, card._id)});

  imageElement.addEventListener('click', () => { clickOnImage(imageElement)});

  return cardElement;
}

export { createCard };
