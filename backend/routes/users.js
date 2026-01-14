const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/finish-book', async (req, res) => {
  const { userId, bookId } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { booksRead: bookId } },//just incase makanch
      { new: true } 
    );

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
});

module.exports = router;