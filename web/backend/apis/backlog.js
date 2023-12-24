const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authorize = require('../middlewares/authorize.js');


router.post('/product-backlogs', authorize, async (req, res) => {
  const { project_id,title, description, priority, assignee, reporter, task_id, estimates_id } = req.body;

  try {
    const productBacklog = await prisma.product_backlog.create({
      data: {
        project_id: project_id, 
        title,
        description,
        priority,
        assignee,
        reporter,
        task_id,
        estimates_id,
      },
    });

    res.status(201).json({ message: 'Product Backlog created successfully', productBacklog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/product-backlogs/:id', authorize, async (req, res) => {
  const backlogId = parseInt(req.params.id, 10);

  try {
    const productBacklog = await prisma.product_backlog.findUnique({
      where: { product_backlog_id: backlogId },
    });

    if (!productBacklog) {
      return res.status(404).json({ error: 'Product Backlog not found' });
    }

    res.status(200).json({ productBacklog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/product-backlogs/:id', authorize, async (req, res) => {
  const backlogId = parseInt(req.params.id, 10);
  const { title, description, priority, assignee, reporter, task_id, estimates_id } = req.body;

  try {
    const updatedProductBacklog = await prisma.product_backlog.update({
      where: { product_backlog_id: backlogId },
      data: {
        title,
        description,
        priority,
        assignee,
        reporter,
        task_id,
        estimates_id,
      },
    });

    res.status(200).json({ message: 'Product Backlog updated successfully', updatedProductBacklog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/product-backlogs/:id', authorize, async (req, res) => {
  const backlogId = parseInt(req.params.id, 10);

  try {
    const deletedProductBacklog = await prisma.product_backlog.delete({
      where: { product_backlog_id: backlogId },
    });

    res.status(200).json({ message: 'Product Backlog deleted successfully', deletedProductBacklog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;