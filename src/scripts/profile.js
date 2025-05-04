// функции редактирования модалного окна профиля

const profileEditButton = document.querySelector('.profile__edit-button');
const formElement = document.querySelector('.popup_type_edit');

// поля input формы formElement
const nameInput = formElement.querySelector('.popup__input_type_name');
const jobInput = formElement.querySelector('.popup__input_type_description');

// имя профиля и работа, поля, куда надо вставить значения из nameInput и jobInput
const nameLabel = document.querySelector('.profile__title');
const jobLabel = document.querySelector('.profile__description');

// для закрытия формы
const clickCbArr = [];

// Обработчик «отправки» формы
function handleFormSubmit(evt) {
    evt.preventDefault(); // Отменить стандартную отправку формы.

    const name = nameInput.value;
    const job = jobInput.value;

    nameLabel.textContent = name;
    jobLabel.textContent = job;

    clickCbArr.forEach((item) => item());
}

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
formElement.addEventListener('submit', handleFormSubmit);

// Обработчик для кнопки, открывающей форму, чтобы перезаписать значения полей ввода
profileEditButton.addEventListener('click', function(evt) {
  nameInput.value = nameLabel.textContent;
  jobInput.value = jobLabel.textContent;
});


function addSubmitProfileCb(cb) {
  clickCbArr.push(cb);
}

export { addSubmitProfileCb };
