const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// CREATE (Admin)
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ (Library)
router.get('/', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// READ ONE
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.json(book);
});

// UPDATE (Admin)
router.put('/:id', async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(book);
});

// DELETE (Admin)
router.delete('/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Book deleted' });
});

module.exports = router;
