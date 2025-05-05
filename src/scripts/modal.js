// экспортировать openModal и closeModal
// обе функции принимают в качестве аргумента модальное окно

// функция обработчик события нажатия на клавишу Esc
function handleEscKeydownEvent(evt) {
  if (evt.key !== 'Escape') {
    return;
  }

  closeModal(document.querySelector('.popup_is-opened'));
}

// функция обработчик события клика по оверлею или на крестик
function handleClickOnOverlayEvent(evt) {
  const modal = document.querySelector('.popup_is-opened');

  // если кликнули за пределами модального окна
  if (!evt.target.closest('.popup__content')) {
    closeModal(modal);
    return
  }

  // если кликнули по крестику
  if (evt.target.classList.contains('popup__close')) {
    closeModal(modal);
  }
}

function openModal(modal) {
  // показать окно
  modal.classList.add('popup_is-opened');

  modal.addEventListener('click', handleClickOnOverlayEvent);
  document.addEventListener('keydown', handleEscKeydownEvent);
}

function closeModal(modal) {
  // скрыть окно
  modal.classList.remove('popup_is-opened');

  modal.removeEventListener('click', handleClickOnOverlayEvent);
  document.removeEventListener('keydown', handleEscKeydownEvent);
}

export { openModal, closeModal };
