const listBooks = [];
// event untuk menambahkan card
const RenderEvent = 'RenderEvent';
// event untuk save data

const DeleteEvent = 'DeleteEvent';

const SAVED_EVENT = 'savedBookData';
// keyword local storage
const STORAGE_KEY = 'SIPEKU';

let idToDelete;

function generateId() {
  return Math.floor(Math.random() * Date.now()).toString(16);
}

function generateDataObject(id,title, author,year,isReaded) {
  return {
    id,
    title,
    author,
    year,
    isReaded
  };
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

  const {id,title,author,year,isReaded} = dataBook;
  console.log('create databook');
  console.log(dataBook);
  console.log(typeof dataBook.isReaded)
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
    console.log('tekan tombol hapus');
    const modalDelete = document.getElementById('Modal-Delete');
    modalDelete.style.display='block';
    idToDelete = dataBook.id;
    });

  if (isReaded) {
    console.log('sudah terbaca untuk membaut data');
    const restartButton = document.createElement('span');
    restartButton.setAttribute('class',"material-symbols-outlined");
    restartButton.innerText = "restart_alt";
    restartButton.setAttribute('id',"restart-button");
    restartButton.addEventListener('click', function () {
      undoBookReaded(dataBook.id);
    });
    

    cardMaker.children[2].append(restartButton,deleteButton);
  } else {
    console.log('belum terbaca untuk membaut data');
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
  console.log('data status buku');
  console.log(title.value);
  console.log(year.value);
  console.log(author.value);
  console.log(status.value);
  const statusBuku = status.value === "true" ? true : false
  console.log("status buku");
  console.log(statusBuku);
  const idBook = generateId();
  const dataBookObject = generateDataObject(idBook,title.value,author.value, year.value, statusBuku);
  console.log(dataBookObject);
  listBooks.push(dataBookObject);
  console.log(listBooks);
  console.log("---------");
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

  listBooks[bookIndex].isReaded = true;
  document.dispatchEvent(new Event(RenderEvent));
  saveData();
}

function searchByTitle(bookTitle){
  console.log('proses filter by judul');
  console.log(bookTitle);
  
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
      console.log('buku ditemukan');
      bookIndex=  book;
      break;
    } 
  }

  if(bookIndex >= 0){
      const bookData = makeDatabook(listBooks[bookIndex]);
      if (listBooks[bookIndex].isReaded) {
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
  console.log(bookId);
  var bookIndex = findBookIndex(bookId);

  if (bookIndex === -1) return;

  listBooks.splice(bookIndex, 1);
  saveData();
}

function undoBookReaded(bookId) {

  const bookIndex = findBookIndex(bookId);
  if (bookIndex == -1) return;

  listBooks[bookIndex].isReaded = false;
  saveData();
}

const searchBar = document.getElementById('search-input-bar');
  searchBar.addEventListener('input',function(event){
    event.preventDefault();
    console.log('search button diklik');
    console.log(searchBar.value);
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
    console.log('storage ada');
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  alert('Data berhasil di simpan.');
});

document.addEventListener(RenderEvent, function () {

   console.log('render function');
  const unreadList = document.querySelector('.unread');
  const readedList = document.querySelector('.readed');

  unreadList.innerHTML = '';
  readedList.innerHTML = '';
  console.log(listBooks);

  for (const books of listBooks) {
    console.log('sebelum masuk card book');
    console.log(typeof books.isReaded);
    const bookData = makeDatabook(books);
    if (books.isReaded) {
      console.log('sudah terbaca');
      readedList.appendChild(bookData);
    } else {
      console.log('belum terbaca');
      unreadList.appendChild(bookData);
    }
  }
});

function deleteEventFunc(){
  console.log("delete.........");
  deleteBookReaded(idToDelete);
  const modal = document.getElementById('Modal-Delete');
  modal.style.display ="none";
}

document.addEventListener(DeleteEvent,deleteEventFunc);


document.addEventListener('CloseModalEvent',function(){
  const buttonConfirmModal = document.getElementById('confirm-button-modal');
  buttonConfirmModal.removeEventListener(DeleteEvent,deleteEventFunc);
  console.log('batalkan event listener');
  const modalBox = document.getElementById('Modal-Delete');
  modalBox.style.display = 'none';
});