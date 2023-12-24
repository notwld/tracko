
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authorize = require('../middlewares/authorize.js');


// Login route
router.post('/login', async (req, res) => {
  // Check if there is an existing session
  if (req.session.user) {
    return res.status(400).json({ error: 'User is already logged in' });
  }

  const { email, password } = req.body;

  // Check if the email exists
  console.log(email);
  console.log(password);
  const user = await prisma.users.findFirst({
    where: { email },
    select: {
      user_id: true,
      username: true,
      password: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    return res.status(401).json({ error: 'Email not found' });
  }

  try {
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ user_id: user.user_id }, process.env.SECRET_TOKEN);
    const session = req.session;
    session.token = token;
    session.user = user.user_id;
    session.username = user.username;
    console.log(session.user);
    let userType;
    if (user.role === "Product Owner") {
      const productOwner = await prisma.product_owner.findFirst({
        where: {
          users: {
            user_id: user.user_id,
          },
        },
      });
      userType = productOwner
      session.product_owner_id = productOwner.product_owner_id;
    } else if (user.role === "Scrum Master") {
      const scrumMaster = await prisma.scrum_master.findFirst({
        where: {
          users: {
            user_id: user.user_id,
          },
        },
      });
      userType = scrumMaster
      session.scrum_master_id = scrumMaster.scrum_master_id;
    } else if (user.role === "Developer") {
      const developer = await prisma.developer.findFirst({
        where: {
          users: {
            user_id: user.user_id,
          },
        },
      });
      userType = developer
      session.developer_id = developer.developer_id;
    } else {
      userType = 'Unknown Role';
    }
    res.status(200).json({ message: 'Login successful', user, token, userType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  console.log(req.body);

  // Check if the email already exists
  const existingUser = await prisma.users.findFirst({ where: { email: email } });

  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.users.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
        role: role,
      },
    });
    if (role === "Product Owner") {
      await prisma.product_owner.create({
        data: {
          users: {
            connect: {
              user_id: newUser.user_id,
            },
          },
        },
      });
    } else if (role === "Scrum Master") {
      await prisma.scrum_master.create({
        data: {
          users: {
            connect: {
              user_id: newUser.user_id,
            },
          },
        },
      });
    } else if (role === "Developer") {
      await prisma.developer.create({
        data: {
          users: {
            connect: {
              user_id: newUser.user_id,
            },
          },
        },
      });
    }


    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/profile', authorize, async (req, res) => {
  try {
    const userId = req.session.user; // Assuming you store the user ID in the session

    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      include: {
        product_owner: true,
        scrum_master: true,
        developer: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let userType;
    let userProfile;

    if (user.product_owner) {
      userType = 'Product Owner';
      userProfile = user.product_owner;
    } else if (user.scrum_master) {
      userType = 'Scrum Master';
      userProfile = user.scrum_master;
    } else if (user.developer) {
      userType = 'Developer';
      userProfile = user.developer;
    } else {
      userType = 'Unknown Role';
    }

    res.status(200).json({ user, userType, userProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/logout', (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({ error: 'User is not logged in' });
  }
  req.session.destroy();
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
