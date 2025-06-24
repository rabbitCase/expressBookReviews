const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username : "john", password : "john123"}];

const isValid = (username) => {
  for (let user of users) {
    if (user.username === username) {
      return true;
    }
  }
  return false;
};

const authenticatedUser = (username,password)=>{
    for (let user of users) {
    if (user.username === username && user.password === password) {
      return true;
    }
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let {username , password} = req.body;
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      { username },
      "fingerprint_customer",
      { expiresIn: "1h" }
    );
    req.session.accessToken = accessToken;

    return res.status(200).json({
      message: "Login successful",
      token: accessToken
    });
  }

  return res.status(401).json({message: "Unauthorized User"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;

  const book = books[isbn];
  book.reviews[username] = review;

  return res.status(200).json({ message: "Review successfully posted", review: book.reviews[username] });

});

//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;
  const book = books[isbn];

  if (book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  }

  return res.status(404).json({ message: "No review found for this user on this book" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
