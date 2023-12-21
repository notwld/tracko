const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authorize = require('../middlewares/authorize.js');


// Create Product Backlog
router.post('/product-backlogs', async (req, res) => {
    const { product_owner_id, project_id, backlog_name, backlog_description } = req.body;
  
    try {
      const newProductBacklog = await prisma.product_backlog.create({
        data: {
          product_owner_id,
          project_id,
          backlog_name,
          backlog_description,
        },
      });
  
      res.status(201).json({ message: 'Product Backlog created successfully', productBacklog: newProductBacklog });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  




module.exports = router;