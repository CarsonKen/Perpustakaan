let currentBookIndex = null;
let books = [];

// Memuat data dari Local Storage
window.onload = function () {
    const savedBooks = localStorage.getItem('books');
    if (savedBooks) {
        books = JSON.parse(savedBooks);
        updateBookList();
    }
};

// Tambah Buku Baru
document.getElementById('bookForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const content = document.getElementById('bookContentInput').value;

    const book = { title, author, content };
    books.push(book);
    updateBookList();
    document.getElementById('bookForm').reset();
    saveBooksToLocalStorage();
});

// Perbarui Daftar Buku
function updateBookList() {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    books.forEach((book, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${book.title} oleh ${book.author}`;
        listItem.addEventListener('click', function () {
            showBookPage(index);
        });
        bookList.appendChild(listItem);
    });
}

// Proses Konten Teks
function processContent(content) {
    const lines = content.split('\n');
    return lines
        .map(line => {
            if (line.startsWith("=:|")) {
                return `<p class="align-right">${line.substring(3).trim()}</p>`;
            } else if (line.startsWith("=:~")) {
                return `<p class="align-center">${line.substring(3).trim()}</p>`;
            } else if (line.startsWith("=:=:")) {
                return `<p class="align-justify">${line.substring(4).trim()}</p>`;
            } else if (line.startsWith("=:=|")) {
                return `<p class="align-left">${line.substring(4).trim()}</p>`;
            } else {
                return `<p>${line.trim()}</p>`;
            }
        })
        .join('');
}

// Tampilkan Halaman Buku
function showBookPage(index) {
    currentBookIndex = index;
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('bookPage').style.display = 'block';
    document.getElementById('bookTitleDisplay').textContent = books[index].title;
    document.getElementById('bookContent').innerHTML = processContent(books[index].content);
}

// Tombol Home
document.getElementById('homeButton').addEventListener('click', function () {
    document.getElementById('bookPage').style.display = 'none';
    document.getElementById('homePage').style.display = 'block';
});

// Edit Buku
document.getElementById('editButton').addEventListener('click', function () {
    if (currentBookIndex !== null) {
        const book = books[currentBookIndex];
        document.getElementById('editBookTitle').value = book.title;
        document.getElementById('editBookAuthor').value = book.author;
        document.getElementById('editBookContent').value = book.content;

        document.getElementById('bookPage').style.display = 'none';
        document.getElementById('editPage').style.display = 'block';
    }
});

// Kembali ke Halaman Buku
document.getElementById('backButton').addEventListener('click', function () {
    document.getElementById('editPage').style.display = 'none';
    document.getElementById('bookPage').style.display = 'block';
});

// Simpan Perubahan
document.getElementById('saveButton').addEventListener('click', function () {
    if (currentBookIndex !== null) {
        const updatedTitle = document.getElementById('editBookTitle').value;
        const updatedAuthor = document.getElementById('editBookAuthor').value;
        const updatedContent = document.getElementById('editBookContent').value;

        books[currentBookIndex] = { title: updatedTitle, author: updatedAuthor, content: updatedContent };
        updateBookList();
        saveBooksToLocalStorage();
        showBookPage(currentBookIndex);
    }
});

// Hapus Buku
document.getElementById('deleteButton').addEventListener('click', function () {
    if (currentBookIndex !== null) {
        const confirmation = confirm("Apakah Anda yakin ingin menghapus buku ini?");
        if (confirmation) {
            books.splice(currentBookIndex, 1);
            currentBookIndex = null;
            updateBookList();
            saveBooksToLocalStorage();
            document.getElementById('bookPage').style.display = 'none';
            document.getElementById('homePage').style.display = 'block';
        }
    }
});

// Simpan Buku ke Local Storage
function saveBooksToLocalStorage() {
    localStorage.setItem('books', JSON.stringify(books));
}
