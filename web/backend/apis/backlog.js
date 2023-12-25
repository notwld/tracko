const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authorize = require('../middlewares/authorize.js');

router.get("/:project_id", authorize, async (req, res) => {
  const { project_id } = req.params
  if (!project_id) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }
  try {
    const productBacklogs = await prisma.product_backlog.findMany({
      where: {
        project_id: project_id
      }
    })
    if (!productBacklogs) {
      return res.status(404).json({ error: "No product backlogs found" })
    }
    res.status(200).json({ productBacklogs })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }

})

router.post('/create', authorize, async (req, res) => {
  
  const { projectId, title, description, priority, progress } = req.body
  if (!projectId || !title || !description || !priority || !progress) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const newProductBacklog = await prisma.product_backlog.create({
      data: {
        project_id: parseInt(projectId),
        title,
        description,
        priority,
      
      }
    })
    if (!newProductBacklog) {
      return res.status(404).json({ error: "No product backlog found" })
    }
    const task = await prisma.task.create({
      data: {
        status: progress
      }
    })
    if  (!task) {
      return res.status(404).json({ error: "No task found" })
    }
    const updatedProductBacklog = await prisma.product_backlog.update({
      where: {
        product_backlog_id: newProductBacklog.product_backlog_id
      },
      data: {
        task_id: task.task_id
      }
    })
    if (!updatedProductBacklog) {
      return res.status(404).json({ error: "No product backlog found" })
    }
    // update project 
    const updatedProject = await prisma.project.update({
      where: {
        project_id: parseInt(projectId)
      },
      data: {
        product_backlog_id: newProductBacklog.product_backlog_id
      }
    })
    if (!updatedProject) {
      return res.status(404).json({ error: "No project found" })
    }
    res.status(200).json({ "message": "Product Backlog created successfully", updatedProductBacklog })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
});

// router.get('/product-backlogs/:id', authorize, async (req, res) => {
//   const backlogId = parseInt(req.params.id, 10);

//   try {
//     const productBacklog = await prisma.product_backlog.findUnique({
//       where: { product_backlog_id: backlogId },
//     });

//     if (!productBacklog) {
//       return res.status(404).json({ error: 'Product Backlog not found' });
//     }

//     res.status(200).json({ productBacklog });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// router.put('/product-backlogs/:id', authorize, async (req, res) => {
//   const backlogId = parseInt(req.params.id, 10);
//   const { title, description, priority, assignee, reporter, task_id, estimates_id } = req.body;

//   try {
//     const updatedProductBacklog = await prisma.product_backlog.update({
//       where: { product_backlog_id: backlogId },
//       data: {
//         title,
//         description,
//         priority,
//         assignee,
//         reporter,
//         task_id,
//         estimates_id,
//       },
//     });

//     res.status(200).json({ message: 'Product Backlog updated successfully', updatedProductBacklog });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// router.delete('/product-backlogs/:id', authorize, async (req, res) => {
//   const backlogId = parseInt(req.params.id, 10);

//   try {
//     const deletedProductBacklog = await prisma.product_backlog.delete({
//       where: { product_backlog_id: backlogId },
//     });

//     res.status(200).json({ message: 'Product Backlog deleted successfully', deletedProductBacklog });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

module.exports = router;