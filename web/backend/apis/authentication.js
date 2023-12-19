
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authorize = require('../middlewares/authorize.js');




// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if the email exists
  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    return res.status(401).json({ error: 'Email not found' });
  }

  try {
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    
    const secretKey = 'jigrahasdhashdhasdh';
    
    const token = jwt.sign({ userId: user.user_id, email: user.email }, secretKey);

    
    req.session.token = token;

    res.status(200).json({ message: 'Login successful', user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Protected route example using the authorize middleware
router.get('/protected', authorize, (req, res) => {
  res.send(`Welcome ${req.user.email}! This is a protected route.`);
});

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  console.log(req.body);

  // Check if the email already exists
  const existingUser = await prisma.user.findFirst({ where: { email:email } });

  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        username:username,
        email:email,
        password: hashedPassword,
        role:role,
      },
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Logout route
router.post('/logout', (req, res) => {
  // Clear the session token
  req.session.token = null;
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
