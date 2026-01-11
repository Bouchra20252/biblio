const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/books', require('./routes/bookRoutes'));
app.use('/reviews', require('./routes/reviewRoutes'));
app.use('/favorites', require('./routes/FavoriteRoutes'));
app.use('/auth', require('./routes/Auth'));


const User = require('./models/User'); 

// MongoDB
mongoose.connect('mongodb://localhost:27017/biblio')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));




// Signup
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({ email, password: hashedPassword }).save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful', email: user.email, _id: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Server
app.listen(5000, () => console.log('Server running on port 5000'));
