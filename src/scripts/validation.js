function showInputError(formElement, inputElement, errorMessage, inputErrorClass, errorClass) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(errorClass);
}

function hideInputError(formElement, inputElement, inputErrorClass, errorClass) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(inputErrorClass);
  errorElement.classList.remove(errorClass);
  errorElement.textContent = '';
}

function checkInputValidity(formElement, inputElement, inputErrorClass, errorClass) {
  if (inputElement.validity.patternMismatch) {
    // Данные атрибута доступны у элемента инпута через ключевое слово dataset.
    // В HTML имя атрибута пишется в kebab-case, в js - camelCase
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, inputErrorClass, errorClass);
  } else {
    hideInputError(formElement, inputElement, inputErrorClass, errorClass);
  }
}

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

function toggleButtonState(inputList, buttonElement, inactiveButtonClass) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(inactiveButtonClass);
  } else {
    buttonElement.classList.remove(inactiveButtonClass);
  }
}

function setEventListeners(formElement, popupProperties) {
  const inputList = Array.from(formElement.querySelectorAll(popupProperties.inputSelector));
  const buttonElement = formElement.querySelector(popupProperties.submitButtonSelector);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, popupProperties.inputErrorClass, popupProperties.errorClass);
      toggleButtonState(inputList, buttonElement, popupProperties.inactiveButtonClass);
    });
  });
  toggleButtonState(inputList, buttonElement, popupProperties.inactiveButtonClass);
}

function enableValidation(popupProperties) {
  const formList = Array.from(document.querySelectorAll(popupProperties.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, popupProperties);
  });
}

function clearValidation(formElement, popupProperties) {
  const inputList = Array.from(formElement.querySelectorAll(popupProperties.inputSelector));
  const buttonElement = formElement.querySelector(popupProperties.submitButtonSelector);
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, popupProperties.inputErrorClass, popupProperties.errorClass);
  });
  toggleButtonState(inputList, buttonElement, popupProperties.inactiveButtonClass);
}

export { enableValidation, clearValidation };
