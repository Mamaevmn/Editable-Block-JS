'use strict'

let editBtn = document.querySelector('.edit-btn');
let saveBtn = document.querySelector('.save-btn');
let cancelBtn = document.querySelector('.cancel-btn');
let textBlock = document.querySelector('.editable__block');
let select = document.querySelector('#select');
let currentText = textBlock.innerHTML;

const STORAGE = window.localStorage;
const ORIGINAL_TEXT_NAME = 'Исходный текст';
let originalText = textBlock.innerHTML;

// сохранение исходного текста в локальном хранилище
saveOriginalTextinLocalStorage ();

// Получение отсортированного массива локального хранилища
let sortedLocalStorage = sortLocalStorage(); 

// удаление всех пользовательских ключей не относящихся к исходному тексту и изменениям этого текста
clearUserLocalStorage(sortedLocalStorage);

// Проверка локального хранилища на наличие изменений от исходного текста
checklocalStorage();

// выгрузить все значения хранилища и создать список select по ключам
createSeletcList(sortedLocalStorage);

// Редактирование поля при нажатии "Редактировать"
editBtn.addEventListener('click', function () {
  currentText = textBlock.innerHTML;
  
  editBtn.setAttribute('disabled', 'true');
  saveBtn.removeAttribute('disabled');
  cancelBtn.removeAttribute('disabled');
  textBlock.setAttribute('cursor', 'text');

  if (!textBlock.hasAttribute('contenteditable')) {
    textBlock.setAttribute('contenteditable', 'true');
  }
});

// Сохранение измененного текста при нажатии "Сохранить"
saveBtn.addEventListener('click', function () {
  let currentTextForSave = textBlock.innerHTML;

  editBtn.removeAttribute('disabled');
  saveBtn.setAttribute('disabled', 'true');
  cancelBtn.setAttribute('disabled', 'true');
  textBlock.removeAttribute('cursor');

  // Сохранение записи в хранилище, если после нажатия "Сохранить" текст изменился от доредактируемого
  if (!(currentTextForSave === currentText)){
    STORAGE.setItem(getTime(), currentTextForSave);

    createOption(getTime());
  };

  if (textBlock.hasAttribute('contenteditable')) {
    textBlock.removeAttribute('contenteditable');
  };
})

// Отмена изменения текста и возвращение к тексту до редактирования при нажатии "Отменить"
cancelBtn.addEventListener('click', function () {
  textBlock.innerHTML = currentText;

  editBtn.removeAttribute('disabled');
  saveBtn.setAttribute('disabled', 'true');
  cancelBtn.setAttribute('disabled', 'true');
  textBlock.removeAttribute('cursor');

  if (textBlock.hasAttribute('contenteditable')) {
    textBlock.removeAttribute('contenteditable');
  }
})

// Функция сохранения в локальном хранилище исходного текста 
function saveOriginalTextinLocalStorage () {
  STORAGE.setItem(ORIGINAL_TEXT_NAME, originalText);

  createOption(ORIGINAL_TEXT_NAME);
}

// создание списка select из массива данных
function createSeletcList (arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== ORIGINAL_TEXT_NAME) {
      createOption(arr[i]);
    }
  }
}

// создание option в списке select
function createOption (text) {
  let newOption = document.createElement('option');
  newOption.innerHTML = text;

  select.append(newOption);

  let currentRecordStorage = select.options[select.length - 1];

  //привоить атрибут selected созданому option
  currentRecordStorage.setAttribute('selected', 'true');

  // если длина списка select больше, чем 1, то убрать атрибут selected у предыдущего значения
  if (select.length > 1) {
    currentRecordStorage.previousSibling.removeAttribute('selected');
  }
}

// изменяет внутренний текст блока при смене option в select
function selectChanges(e) {
  select.value = e.target.value;
  let value = STORAGE.getItem(select.value);

  textBlock.innerHTML = value;
}

// Функция получения 'ключ + текущая дата'
function getTime() {
  const now = new Date();

  return 'EB ' + now
};

// Функция сортировки LocalStorage
function sortLocalStorage() {
  let localStorageArrayForSort = [];

  if (STORAGE.length > 0) {
    for (let i = 0; i < STORAGE.length; i++) {
      localStorageArrayForSort[i] = STORAGE.key(i);
    }
  }
  let sortedLocalStorageArray = localStorageArrayForSort.sort();
  return sortedLocalStorageArray;
}

// функция проверки локального хранилища на наличие изменений от исходного текста и замена исходного текста на последнее изменение
function checklocalStorage() {
  //удаление из массива исходного текста и замена его на последнее изменение, если в локальном хранилище имеются изменения
  if (sortedLocalStorage.length > 1) {
    deleteRecordOriginalText(sortedLocalStorage);

    // записываем последнее изменение отсортированного массива локального хранилища
    let lastRecordingInLocalStorage = STORAGE.getItem(sortedLocalStorage[sortedLocalStorage.length - 1]);

    // замена исходного текста на текст последнего изменения
    textBlock.innerHTML = lastRecordingInLocalStorage
  }
}

//удаление из массива элемента со значением исходного текста
function deleteRecordOriginalText (arr) {
  const DELETE_INDEX = arr.indexOf(ORIGINAL_TEXT_NAME);
  if (arr.indexOf(ORIGINAL_TEXT_NAME)) arr.splice(DELETE_INDEX, DELETE_INDEX);
}

// очистка локального хранилища пользователя 
function clearUserLocalStorage (arr) {
  arr.forEach((item) => {
    if (!item.startsWith('EB') && !item.includes(ORIGINAL_TEXT_NAME)) {
      STORAGE.removeItem(item);
    }
  })
}