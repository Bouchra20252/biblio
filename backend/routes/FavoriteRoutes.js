const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

// ADD favorite
router.post('/', async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    const exists = await Favorite.findOne({ userId, bookId });
    if (exists) {
      return res.json(exists);
    }

    const favorite = new Favorite({ userId, bookId });
    await favorite.save();

    res.json(favorite);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET favorites by user
router.get('/:userId', async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId })
      .populate('bookId');

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// REMOVE favorite
router.delete('/', async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    await Favorite.findOneAndDelete({ userId, bookId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
