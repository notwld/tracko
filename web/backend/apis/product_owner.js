// Import necessary modules and Prisma client
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Route for creating a new product owner
router.post('/product-owners', async (req, res) => {
  const { user_id, name } = req.body;

  try {
    // Create a new product owner
    const newProductOwner = await prisma.product_owner.create({
      data: {
        user_id,
        name,
      },
    });

    res.status(201).json({ message: 'Product Owner created successfully', productOwner: newProductOwner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export the router
module.exports = router;
