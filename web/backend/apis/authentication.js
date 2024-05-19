
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
router.put('/profile', authorize, async (req, res) => {
  try {
    const userId = req.session.user; // Assuming you store the user ID in the session
    const { name, email, phone, password, role, velocity } = req.body;

    const updatedUser = await prisma.users.update({
      where: { user_id: userId },
      data: {
        username: name,
        email,
        phone,
        password, // Make sure to hash the password before storing it
        role,
        developer: role === 'Developer' ? {
          update: { velocity_per_sprint: velocity },
        } : undefined,
      },
    });

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add interrupt hours
router.post('/profile/interrupts', authorize, async (req, res) => {
  console.log("API HITTING")
  try {
    const userId = req.session.user; // Assuming you store the user ID in the session
    const { name, hours, minutes, projId } = req.body;

    // Assuming you have a model for interrupts, if not create one
    const interrupt = await prisma.interrupts.create({
      data: {
        name,
        hours,
        minutes,
        
        projectId:projId,
        
       developerId:userId,
      },
    });
    console.log(interrupt);
    res.status(201).json({ message: 'Interrupt added successfully', interrupt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Remove interrupt hours
router.delete('/profile/interrupts/:id', authorize, async (req, res) => {
  try {
    const interruptId = parseInt(req.params.id);

    await prisma.interrupts.delete({
      where: { id: interruptId },
    });

    res.status(200).json({ message: 'Interrupt removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/profile/interrupts/fetch', authorize, async (req, res) => {
  try {
    const { projId ,developerId} = req.body;
    const interrupts = await prisma.interrupts.findMany({
      where: {
        projectId: projId,
        developerId:req.session.user
      },
    });
    console.log(interrupts);
    res.status(200).json({ interrupts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/logout', (req, res) => {
  // if (!req.session.user) {
  //   return res.status(400).json({ error: 'User is not logged in' });
  // }
  req.session.destroy();
  res.status(200).json({ message: 'Logout successful' });
});

router.post("/profile/velocity",(req,res)=>{
  const {velocity,developer_id} = req.body;
  prisma.developer.update({
    where:{
      developer_id:developer_id
    },
    data:{
      velocity_per_sprint:velocity
    }
  }).then((data)=>{
    res.status(200).json({message:"Velocity updated successfully",data:data})
  }).catch((error)=>{
    res.status(500).json({error:"Internal Server Error"})
  })
})

router.post("/profile/velocity/update",(req,res)=>{
  const {velocity,developer_id} = req.body;
  prisma.developer.update({
    where:{
      developer_id:developer_id
    },
    data:{
      velocity_per_sprint:velocity
    }
  }).then((data)=>{
    res.status(200).json({message:"Velocity updated successfully",data:data})
  }).catch((error)=>{
    res.status(500).json({error:"Internal Server Error"})
  })
})

router.get("/profile/velocity/:developer_id",(req,res)=>{
  const {developer_id} = req.params;
  prisma.developer.findFirst({
    where:{
      developer_id:parseInt(developer_id)
    }
  }).then((data)=>{
    res.status(200).json({message:"Velocity fetched successfully",data:data.velocity_per_sprint})
  }).catch((error)=>{
    res.status(500).json({error:"Internal Server Error"})
  })
})

router.delete("/profile/velocity/:developer_id",(req,res)=>{
  const {developer_id} = req.params;
  prisma.developer.update({
    where:{
      developer_id:parseInt(developer_id)
    },
    data:{
      velocity_per_sprint:null
    }
  }).then((data)=>{
    res.status(200).json({message:"Velocity deleted successfully",data:data})
  }).catch((error)=>{
    res.status(500).json({error:"Internal Server Error"})
  })
})


module.exports = router;
