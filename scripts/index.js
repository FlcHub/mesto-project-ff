// Создает элемент карточки для вывода в html
// * card информация о карточке (словарь):
//   name: String
//   link: String
// * deleteCb - колбэк для удаления карточки
function addCard(card, deleteCb) {
  // клонировать шаблон
  const cardTemplate = document.querySelector('#card-template').content;
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
    const cardElement = addCard(item, deleteCard);

    // добавить карточку в DOM
    const cardContainer  = document.querySelector('.page__content .content .places .places__list');
    cardContainer.append(cardElement);
  });
}

showAllCards();
