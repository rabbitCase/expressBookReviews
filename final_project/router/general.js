const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "This user already exists" });
  }
  users.push({ username, password });
  console.log(users);
  res.status(201).json({ message: "Registration successful" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn]
  return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
   for (let key in books) {
    if (books[key].author === author) {
      return res.status(200).json(books[key]);
    }
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  for (let key in books) {
    if (books[key].title === title) {
      return res.status(200).json(books[key]);
    }
  }
  res.status(404);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  console.log(books[isbn].reviews);
  return res.status(200).json(books[isbn].reviews)
  
});

module.exports.general = public_users;
