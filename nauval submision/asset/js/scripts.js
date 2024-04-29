const listBooks = [];
const RenderEvent = 'RenderEvent';
const DeleteEvent = 'DeleteEvent';
const SAVED_EVENT = 'savedBookData';
const STORAGE_KEY = 'SIPEKU';
let idToDelete;

function generateId() {
  return Math.floor(Math.random() * Date.now());
}

function generateDataObject(idInput,title, author,yearInput,isComplete) {
  const id = Number(idInput);
  const year = Number(yearInput);
 return  {
  id: id,
  title: title,
  author :author,
  year : year,
  isComplete :isComplete }
}

function findBookbyId(bookId) {
  for (const book of listBooks) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in listBooks) {
    if (listBooks[index].id === bookId) {
      return index;
    }
  }
  return -1;
}


function isStorageExist(){
  if (typeof (Storage) === undefined) {
    alert('Yah Local Storage Tidak Didukung');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(listBooks);
    console.log(listBooks);
    console.log(parsed);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
  document.dispatchEvent(new Event(RenderEvent));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let dataBooks = JSON.parse(serializedData);

  if (dataBooks !== null) {
    for (const book of dataBooks) {
        listBooks.push(book);
    }
  }
  document.dispatchEvent(new Event(RenderEvent));
}

function makeCardElement(dataBook){
  const cardContainer = document.createElement('div');
  cardContainer.setAttribute('class','card');

  const buttonOncard= document.createElement('div');
  buttonOncard.setAttribute('class','button-card');

  const image = document.createElement('img');
  image.setAttribute('src','asset/images/book_icon.png');
  image.setAttribute('alt','book-icon');

  const figcap = document.createElement('figcaption');

  const bookTitle = document.createElement('span');
  bookTitle.innerText = dataBook.title;
  bookTitle.setAttribute('id','title-book')

  const yearBook = document.createElement('span');
  yearBook.innerText = dataBook.year;
  yearBook.setAttribute('id','year-book');
  
  const authorBook = document.createElement('span');
  authorBook.innerText = dataBook.author;
  authorBook.setAttribute('id','author-book');

  figcap.append(bookTitle,yearBook,authorBook);
  cardContainer.append(image,figcap);
  
  cardContainer.append(buttonOncard);
  cardContainer.setAttribute('id', `${dataBook.id}`);
  return cardContainer;
}

function makeDatabook(dataBook) {

  const {id,title,author,year,isComplete} = dataBook;
  const cardMaker = makeCardElement(dataBook);

  const doneButton = document.createElement('span');
  doneButton.setAttribute('class',"material-symbols-outlined");
  doneButton.innerText = "checklist";
  doneButton.setAttribute('id',"done-button");
  
  const restartButton = document.createElement('span');
  restartButton.setAttribute('class',"material-symbols-outlined");
  restartButton.innerText = "restart_alt";
  restartButton.setAttribute('id',"restart-button");

  const deleteButton = document.createElement('span');
  deleteButton.setAttribute('class',"material-symbols-outlined");
  deleteButton.innerText = "delete";
  deleteButton.setAttribute('id',"delete-button"); 

  deleteButton.addEventListener('click', function () {
    const modalDelete = document.getElementById('Modal-Delete');
    modalDelete.style.display='block';
    idToDelete = dataBook.id;
    });

  if (isComplete) {
    const restartButton = document.createElement('span');
    restartButton.setAttribute('class',"material-symbols-outlined");
    restartButton.innerText = "restart_alt";
    restartButton.setAttribute('id',"restart-button");
    restartButton.addEventListener('click', function () {
      undoBookReaded(dataBook.id);
    });
    cardMaker.children[2].append(restartButton,deleteButton);
  } else {
    const doneButton = document.createElement('span');
    doneButton.setAttribute('class',"material-symbols-outlined");
    doneButton.innerText = "checklist";
    doneButton.setAttribute('id',"done-button");
    doneButton.addEventListener('click', function () {
      addBookReaded(dataBook.id);
    });
    cardMaker.children[2].append(doneButton,deleteButton);
  }
  return cardMaker;
}



function addBookData() {
  const title = document.getElementById('title');
  const year = document.getElementById('year');
  const author = document.getElementById('author');
  const status = document.getElementById('status');
  const statusBuku = status.value === "true" ? true : false;
  const idBook = generateId();
  const dataBookObject = generateDataObject(idBook, title.value,author.value,year.value, statusBuku);
  console.log(dataBookObject);
  listBooks.push(dataBookObject);
  console.log(listBooks);
  title.value = "";
  year.value = "";
  author.value = '';
  const optionElement = document.getElementById('sudah');
  optionElement.selected = true;
  saveData();
}


function addBookReaded(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex == null) {
    alert('buku tidak dapat diubah');
  };

  listBooks[bookIndex].isComplete = true;
  document.dispatchEvent(new Event(RenderEvent));
  saveData();
}

function searchByTitle(bookTitle){
  const unreadList = document.querySelector('.unread');
  const readedList = document.querySelector('.readed');
  const info = document.querySelector('#info-search');
  info.setAttribute('hidden',false);
  info.innerText= "hasil pencarian:"+ bookTitle.value;
  readedList.innerHTML = '';
  unreadList.innerHTML = '';
  var bookIndex = -1;

  for (const book in listBooks) {
    if (listBooks[book].title == bookTitle) {
      bookIndex=  book;
      break;
    } 
  }

  if(bookIndex >= 0){
      const bookData = makeDatabook(listBooks[bookIndex]);
      if (listBooks[bookIndex].isComplete) {
        readedList.appendChild(bookData);
      } else {
        unreadList.appendChild(bookData);
      }
  }else{
    info.innerText += "data tidak ditemukan";
    document.dispatchEvent(new Event(RenderEvent));
  }
}

function deleteBookReaded(bookId) {
  var bookIndex = findBookIndex(bookId);

  if (bookIndex === -1) return;

  listBooks.splice(bookIndex, 1);
  saveData();
}

function undoBookReaded(bookId) {

  const bookIndex = findBookIndex(bookId);
  if (bookIndex == -1) return;

  listBooks[bookIndex].isComplete = false;
  saveData();
}

const searchBar = document.getElementById('search-input-bar');
  searchBar.addEventListener('input',function(event){
    event.preventDefault();
    if(searchBar.value.length !== 0 || searchBar.value !== null){
      searchByTitle(searchBar.value);
    }
  });

document.addEventListener('DOMContentLoaded', function () {

  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const title = document.getElementById('title');
    const year = document.getElementById('year');
    const author = document.getElementById('author');
    if(title.value.length != 0 && year.value.length != 0 && author.value.length != 0){ 
      addBookData();
    } else{
      alert('data buku ada yang kosong');
    }
  });
  
  const bgModal = document.getElementById('Modal-Delete');
  bgModal.addEventListener('click',function(){
    document.dispatchEvent(new Event('CloseModalEvent'));
  });
 
  const buttonConfirmModal = document.getElementById('confirm-button-modal');
  buttonConfirmModal.addEventListener('click',function (){
    document.dispatchEvent(new Event(DeleteEvent));
  });

  const closeButtonModal = document.getElementById('close-button-modal');
  closeButtonModal.addEventListener('click',function (){
   document.dispatchEvent(new Event('CloseModalEvent'));
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  alert('Data berhasil di simpan.');
});

document.addEventListener(RenderEvent, function () {
  const unreadList = document.querySelector('.unread');
  const readedList = document.querySelector('.readed');

  unreadList.innerHTML = '';
  readedList.innerHTML = '';

  for (const books of listBooks) {
    const bookData = makeDatabook(books);
    if (books.isComplete) {
      readedList.appendChild(bookData);
    } else {
      unreadList.appendChild(bookData);
    }
  }
});

function deleteEventFunc(){
  deleteBookReaded(idToDelete);
  const modal = document.getElementById('Modal-Delete');
  modal.style.display ="none";
}

document.addEventListener(DeleteEvent,deleteEventFunc);

document.addEventListener('CloseModalEvent',function(){
  const buttonConfirmModal = document.getElementById('confirm-button-modal');
  buttonConfirmModal.removeEventListener(DeleteEvent,deleteEventFunc);
  const modalBox = document.getElementById('Modal-Delete');
  modalBox.style.display = 'none';
});