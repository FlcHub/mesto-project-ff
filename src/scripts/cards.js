//-------- Создание карточек для добавления в DOM
const cardTemplate = document.querySelector('#card-template').content;

const hiddenElementClass = 'element-hidden';

// Создает элемент карточки для вывода в html
// * card информация о карточке (словарь):
//   name: String
//   link: String
// * deleteCard: function   - функция-обработчик события клика по иконке удаления карточки
// * likeCard: function     - функция-обработчик события клика по иконке  лайка карточки
// * clickOnImage: function - функция-обработчик события нажатия на картинку
// * userId: String - ID текущего пользователя
function createCard(card, deleteCard, likeCard, clickOnImage, userId) {
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
  deleteButton.addEventListener('click', () => deleteCard(cardElement, card._id));

  // если это не карточка текущего пользователя, то скрыть кнопку удаления карточки
  if (card.owner._id !== userId) {
    deleteButton.classList.add(hiddenElementClass);
  }

  // добавить к иконке лайка карточки обработчик клика,
  // по которому будет вызван likeCard
  const likeButton  = cardElement.querySelector('.card__like-button');
  likeButton.addEventListener('click', () => likeCard(likeButton, cardElement, card._id));

  // отобразить лайк текущего пользователя, если он был поставлен
  showMyLike(cardElement, card, userId);

  // отобразить количество лайков на карточке
  showLikesCount(cardElement, card);

  imageElement.addEventListener('click', () => clickOnImage(imageElement));

  return cardElement;
}

// проверить, есть ли на карточке мой лайк
function hasCardMyLike(card, userId) {
  return card.likes.some((item) => {
    return item._id === userId;
  });
}

// получить количество лайков с карточки
function getLikesCount(card) {
  return card.likes.length;
}

// отобразить мой лайк, если он есть
function showMyLike(cardElement, card, userId) {
  const likeButton  = cardElement.querySelector('.card__like-button');
  const classList = likeButton.classList;

  if (hasCardMyLike(card, userId)) {
    classList.add('card__like-button_is-active');
  } else {
    classList.remove('card__like-button_is-active');
  }
}

// отобразить количество лайков
function showLikesCount(cardElement, card) {
  // элемент с количеством лайков
  const counterElement = cardElement.querySelector('.card__like-count');
  const likesCount = getLikesCount(card);

  // если лайков нет, то спрятать количество лайков вообще
  if (likesCount === 0) {
    counterElement.classList.add(hiddenElementClass);
    return;
  }

  // иначе отобразить число лайков
  counterElement.classList.remove(hiddenElementClass);
  counterElement.textContent = likesCount;
}

// удалить карточку из отображаемого списка карточек
function deleteCard(cardElement) {
  cardElement.remove();
}

export {
  createCard,
  showMyLike,
  showLikesCount,
  deleteCard
};
