const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


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
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://example.com/books');
    res.json(response.data); 
  } 
  catch (error) {
    res.status(500).json({ message: "Books not available" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;

  try {
    const response = await axios.get(`https://example.com/books/${isbn}`);
    const book = response.data.items?.[0];
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book by ISBN" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params;
  try {
    const response = await axios.get(`https://example.com/books/${author}`);
    const books = response.data.author;
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
    const response = await axios.get(`https://example.com/books/${title}`);
    const books = response.data.title;
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  console.log(books[isbn].reviews);
  return res.status(200).json(books[isbn].reviews)
  
});

module.exports.general = public_users;
