const token = '5836099e-0d59-4a05-b782-cd4b7efbd404';

const configGET = {
  method : 'GET',
  headers: {
    authorization: token
  }
};

function buildUrl(path) {
  return `https://nomoreparties.co/v1/wff-cohort-39/${path}`;
}

function handleAnswer(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

// получить карточки с сервера
function getInitialCards() {
  return fetch(buildUrl('cards'), configGET)
    .then(handleAnswer);
}

// получить информацию о пользователе
function getUserInfo() {
  return fetch(buildUrl('users/me'), configGET)
    .then(handleAnswer);
}

// обновить информацию о пользователе
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

export {
  getInitialCards,
  getUserInfo,
  updateUserInfo,
  updateAvatarLink
};
