document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.querySelector("#input-book");
  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
    const inputSection = document.querySelector(".input_section");
    const blurLayer = document.querySelector("#layer");
    blurLayer.classList.toggle("active");
    inputSection.classList.toggle("active");
  });
  const searchForm = document.querySelector("#search-form");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchBook();
  });
  const searchInput = document.querySelector("#search-book-title");
  searchInput.addEventListener("keyup", searchBook);

  const closeBtn = document.querySelectorAll(".close-btn");
  closeBtn.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.currentTarget.parentElement.classList.toggle("active");
      const blurLayer = document.querySelector("#layer");
      blurLayer.classList.toggle("active");
    })
  );

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

const showAddBookForm = () => {
  const inputSection = document.querySelector(".input_section");
  const blurLayer = document.querySelector("#layer");
  resetForm();
  blurLayer.classList.toggle("active");
  inputSection.classList.toggle("active");
};

const showEditForm = (bookId) => {
  const targetBook = findBook(bookId);
  if (!targetBook) return;

  resetForm();
  const targetBookCopy = { ...targetBook };

  const titleInput = document.querySelector("#edit-book-title");
  const authorInput = document.querySelector("#edit-book-author");
  const yearInput = document.querySelector("#edit-book-year");
  const completedCheckbox = document.querySelector("#edit-book-complete");

  titleInput.value = targetBookCopy.title;
  authorInput.value = targetBookCopy.author;
  yearInput.value = targetBookCopy.year;
  completedCheckbox.checked = targetBookCopy.isCompleted;

  const formEdit = document.querySelector("#edit-book-form");
  const oldListener = formEdit._listener;

  if (oldListener) {
    formEdit.removeEventListener("submit", oldListener);
  }

  const newListener = (e) => {
    e.preventDefault();

    const newTitle = titleInput.value;
    const newAuthor = authorInput.value;
    const newYear = parseInt(yearInput.value);
    const newIsCompleted = completedCheckbox.checked;

    targetBookCopy.title = newTitle;
    targetBookCopy.author = newAuthor;
    targetBookCopy.year = newYear;
    targetBookCopy.isCompleted = newIsCompleted;

    const bookIndex = findBookIndex(bookId);
    if (bookIndex !== -1) {
      books[bookIndex] = targetBookCopy;
    }

    editForm.classList.toggle("active");
    blurLayer.classList.toggle("active");

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  };

  formEdit.addEventListener("submit", newListener);
  formEdit._listener = newListener;

  const editForm = document.querySelector(".edit-form");
  const blurLayer = document.querySelector("#layer");
  blurLayer.classList.toggle("active");
  editForm.classList.toggle("active");
};

const resetForm = () => {
  const bookTitle = document.querySelector("#input-book-title");
  const bookAuthor = document.querySelector("#input-book-author");
  const bookYear = document.querySelector("#input-book-year");
  const checkCompleted = document.querySelector("#input-book-complete");

  const editTitle = document.querySelector("#edit-book-title");
  const editAutor = document.querySelector("#edit-book-author");
  const editYear = document.querySelector("#edit-book-year");
  const editCompletedCheckbox = document.querySelector("#edit-book-complete");

  bookTitle.value = "";
  bookAuthor.value = "";
  bookYear.value = "";
  checkCompleted.unchecked;

  editTitle.value = "";
  editAutor.value = "";
  editYear.value = "";
  editCompletedCheckbox.unchecked;
};
const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.querySelector("#book-uncomplete");
  const completedBOOKList = document.querySelector("#book-complete");

  uncompletedBOOKList.innerHTML = "";
  completedBOOKList.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBook(book);
    if (!book.isCompleted) {
      uncompletedBOOKList.append(bookElement);
    } else {
      completedBOOKList.append(bookElement);
    }
  }
  feather.replace();
});
const addBook = () => {
  const bookTitleText = document.querySelector("#input-book-title").value;
  const bookAuthorText = document.querySelector("#input-book-author").value;
  const bookYearText = parseInt(
    document.querySelector("#input-book-year").value
  );
  const checkCompleted = document.querySelector("#input-book-complete");

  const bookIsCompleted = !!checkCompleted.checked;
  const bookId = generateId();
  const bookObject = generateBookObject(
    bookId,
    bookTitleText,
    bookAuthorText,
    bookYearText,
    bookIsCompleted
  );
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const generateId = () => {
  return +new Date();
};
const generateBookObject = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
};
const searchBook = () => {
  const storedBooks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const keywords = document
    .querySelector("#search-book-title")
    .value.toLowerCase();

  const filteredBooks = storedBooks.filter((book) => {
    const titleMatch = book.title.toLowerCase().includes(keywords);
    const authorMatch = book.author.toLowerCase().includes(keywords);
    const yearMatch = book.year.toString().includes(keywords);
    return titleMatch || authorMatch || yearMatch;
  });

  const uncompletedBOOKList = document.querySelector("#book-uncomplete");
  const completedBOOKList = document.querySelector("#book-complete");

  uncompletedBOOKList.innerHTML = "";
  completedBOOKList.innerHTML = "";

  for (const book of filteredBooks) {
    const bookElement = makeBook(book);
    if (!book.isCompleted) {
      uncompletedBOOKList.append(bookElement);
    } else {
      completedBOOKList.append(bookElement);
    }
  }
  feather.replace();
};
const makeBook = (book) => {
  const bookElement = document.createElement("div");
  bookElement.classList.add("book");
  bookElement.setAttribute("id", book.id);

  const btnElement = document.createElement("div");
  btnElement.classList.add("book-btn");

  const editIcon = document.createElement("i");
  editIcon.setAttribute("data-feather", "edit");
  editIcon.classList.add("edit-icon");

  const arrow = document.createElement("i");
  if (!book.isCompleted) {
    arrow.setAttribute("data-feather", "arrow-right");
    arrow.classList.add("uncompleted");
  } else {
    arrow.setAttribute("data-feather", "arrow-left");
    arrow.classList.add("completed");
  }

  const trashIcon = document.createElement("i");
  trashIcon.setAttribute("data-feather", "trash-2");
  trashIcon.classList.add("delete-icon");

  const titleElement = document.createElement("h2");
  titleElement.textContent = book.title;

  const authorElement = document.createElement("p");
  authorElement.textContent = `Penulis: ${book.author}`;

  const yearElement = document.createElement("p");
  yearElement.textContent = `Tahun: ${book.year}`;

  const readElement = document.createElement("p");
  readElement.textContent = `Dibaca: ${book.isCompleted ? "Sudah" : "Belum"}`;

  bookElement.addEventListener("click", (event) => {
    const targetElement = event.target;
    const bookId = bookElement.getAttribute("id");
    if (targetElement.classList.contains("delete-icon")) {
      if (targetElement.classList.contains("delete-icon")) {
        const blurLayer = document.querySelector("#layer");
        blurLayer.classList.toggle("active");

        const deleteDialog = document.querySelector("#custom-dialog");
        deleteDialog.classList.toggle("active");

        const onDeleteBookTitle = document.querySelector("#on-delete-title");
        onDeleteBookTitle.innerText = book.title;

        const cancelDeleteBtn = document.querySelector("#cancel-delete");
        const confirmDeleteBtn = document.querySelector("#confirm-delete");

        const onCancelDelete = (e) => {
          e.preventDefault();
          deleteDialog.classList.toggle("active");
          blurLayer.classList.toggle("active");
          cancelDeleteBtn.removeEventListener("click", onCancelDelete);
          confirmDeleteBtn.removeEventListener("click", onConfirmDelete);
        };

        const onConfirmDelete = (e) => {
          e.preventDefault();
          removeBook(bookId);
          deleteDialog.classList.toggle("active");
          blurLayer.classList.toggle("active");
          cancelDeleteBtn.removeEventListener("click", onCancelDelete);
          confirmDeleteBtn.removeEventListener("click", onConfirmDelete);
        };

        cancelDeleteBtn.addEventListener("click", onCancelDelete);
        confirmDeleteBtn.addEventListener("click", onConfirmDelete);
      }
    }
    if (targetElement.classList.contains("uncompleted")) {
      addBookToCompleted(bookId);
    }
    if (targetElement.classList.contains("completed")) {
      addBookToUncompleted(bookId);
    }
    if (targetElement.classList.contains("edit-icon")) {
      showEditForm(bookId);
    }
    console.log(targetElement);
  });

  btnElement.append(editIcon, arrow, trashIcon);
  bookElement.append(
    btnElement,
    titleElement,
    authorElement,
    yearElement,
    readElement
  );

  return bookElement;
};
const findBookIndex = (bookId) => {
  for (let i = 0; i < books.length; i++) {
    if (books[i].id == bookId) {
      return i;
    }
  }
  return -1;
};
const findBook = (bookId) => {
  for (let book of books) {
    if (book.id == bookId) {
      return book;
    }
  }
  return null;
};
const removeBook = (bookId) => {
  const targetBookIndex = findBookIndex(bookId);

  if (targetBookIndex === -1) return;

  books.splice(targetBookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};
const addBookToCompleted = (bookId) => {
  const targetBook = findBook(bookId);

  if (targetBook == null) return;

  targetBook.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};
const addBookToUncompleted = (bookId) => {
  const targetBook = findBook(bookId);

  if (targetBook == null) return;

  targetBook.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

const isStorageExist = () => {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
};
const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};
const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};
