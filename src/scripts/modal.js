// экспортировать openModal и closeModal
// обе функции принимают в качестве аргумента DOM-элемент модального окна

function openModal(modal) {
  // показать окно
  modal.classList.add('popup_is-opened');
}

function closeModal(modal) {
  // скрыть окно
  modal.classList.remove('popup_is-opened');
}

export { openModal, closeModal };
