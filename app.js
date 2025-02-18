const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
const port = 3000;

// Initialize Sequelize: https://sequelize.org/
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

// Define User model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

// Middleware and view engine 
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('index', { users });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/', async (req, res) => {
  const { name, email } = req.body;
  try {
    await User.create({ name, email });
    res.redirect('/');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
