const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Function to check if the user exists
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return new Promise((resolve, reject) => {
    // Resolving the promise immediately with the static books variable
    resolve(books);
  })
  .then(books => {
    // Once the promise is resolved, send the response
    return res.status(200).json({message: JSON.stringify(books)});
  })
  .catch(error => {
    // If there's an error at any point, handle it here
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return new Promise((resolve, reject) => {
    let book = books[req.params.isbn];
    if (book !== undefined) {
      resolve(book); // If book found, resolve the promise with book details
    } else {
      reject(new Error("No book found")); // If book not found, reject the promise
    }
  })
  .then(book => {
    // Once the promise is resolved, send the response with book details
    return res.status(200).json({message: JSON.stringify(book)});
  })
  .catch(error => {
    // If there's an error at any point, handle it here
    console.error("Error:", error);
    return res.status(404).json({message: "No book found"});
  });
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  return new Promise((resolve, reject) => {
    let author = req.params.author;
    let filteredBooks = {};
    for (let key in books) {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        filteredBooks[key] = books[key];
      }
    }
    if (Object.keys(filteredBooks).length > 0) {
      resolve(filteredBooks); // If books are found, resolve the promise with filtered books
    } else {
      reject(new Error("No books found for the given author")); // If no books are found, reject the promise
    }
  })
  .then(filteredBooks => {
    // Once the promise is resolved, send the response with filtered books
    return res.status(200).json({message: JSON.stringify(filteredBooks)});
  })
  .catch(error => {
    // If there's an error at any point, handle it here
    console.error("Error:", error);
    return res.status(404).json({message: "No books found for the given author"});
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  return new Promise((resolve, reject) => {
    let title = req.params.title;
    let filteredBooks = {};
    for (let key in books) {
      if (books[key].title.toLowerCase().replace(/\s/g, '') === title.toLowerCase().replace(/\s/g, '')) {
        filteredBooks[key] = books[key];
      }
    }
    if (Object.keys(filteredBooks).length > 0) {
      resolve(filteredBooks); // If books are found, resolve the promise with filtered books
    } else {
      reject(new Error("No books found for the given title")); // If no books are found, reject the promise
    }
  })
  .then(filteredBooks => {
    // Once the promise is resolved, send the response with filtered books
    return res.status(200).json({message: JSON.stringify(filteredBooks)});
  })
  .catch(error => {
    // If there's an error at any point, handle it here
    console.error("Error:", error);
    return res.status(404).json({message: "No books found for the given title"});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn
  let reviews = {};
  for (let key in books) {
    if (key === isbn) {
      reviews = books[key].reviews;
    }
  }
  return res.status(200).json({message: JSON.stringify(reviews)});
});

module.exports.general = public_users;
