const token = '5836099e-0d59-4a05-b782-cd4b7efbd404';
const cohortId = 'wff-cohort-39';

const configGET = {
  method : 'GET',
  headers: {
    authorization: token
  }
};

function buildUrl(path) {
  return `https://nomoreparties.co/v1/${cohortId}/${path}`;
}

function handleAnswer(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

// получить карточки с сервера
// возвращает: массив карточек
function getInitialCards() {
  return fetch(buildUrl('cards'), configGET)
    .then(handleAnswer);
}

// получить информацию о пользователе
// возвращает: объект с информацией о пользователе
function getUserInfo() {
  return fetch(buildUrl('users/me'), configGET)
    .then(handleAnswer);
}

// обновить информацию о пользователе
// возвращает: объект с обновленной информацией о пользователе
function updateUserInfo(name, about) {
  return fetch(buildUrl('users/me'), {
      method: 'PATCH',
      headers: {
        authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
    .then(handleAnswer);
}

// обновить аватар пользователя
// возвращает: объект с обновленной информацией о пользователе
function updateAvatarLink(link) {
  return fetch(buildUrl('users/me/avatar'), {
      method: 'PATCH',
      headers: {
        authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: link
      })
    })
    .then(handleAnswer);
}

// лайкнуть карточку
// возвращает: объект с обновленной карточкой
function setLike(cardId) {
  return fetch(buildUrl(`cards/likes/${cardId}`), {
      method: 'PUT',
      headers: {
        authorization: token,
        'Content-Type': 'application/json'
      }
    })
    .then(handleAnswer);
}

// убрать лайк с карточки
// возвращает: объект с обновленной карточкой
function removeLike(cardId) {
  return fetch(buildUrl(`cards/likes/${cardId}`), {
      method: 'DELETE',
      headers: {
        authorization: token,
        'Content-Type': 'application/json'
      }
    })
    .then(handleAnswer);
}

// добавить новую карточку на сервер
// возвращает: объект с новой карточкой
function addNewCard(name, link) {
  return fetch(buildUrl('cards'), {
      method: 'POST',
      headers: {
        authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        link: link
      })
    })
    .then(handleAnswer);
}

export {
  getInitialCards,
  getUserInfo,
  updateUserInfo,
  updateAvatarLink,
  setLike,
  removeLike,
  addNewCard
};
