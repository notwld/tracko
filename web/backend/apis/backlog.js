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
        project_id: parseInt(project_id)
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

router.delete("/delete", authorize, async (req, res) => {
  const { backlogs } = req.body;

  if (!backlogs) {
    return res.status(404).json({ message: "Please provide backlogs to delete" });
  }

  try {
    for (const backlog of backlogs) {
      if (!backlog.task_id || !backlog.product_backlog_id) {
        console.log("Invalid task_id or product_backlog_id for the current backlog:", backlog);
        continue; // Skip to the next iteration if task_id or product_backlog_id is not valid
      }
      const taskToDelete = await prisma.task.findMany({
        where: {
            product_backlog_id: backlog.product_backlog_id,
        }
      })
      if (!taskToDelete) {
        console.log("Task does not exist for the current backlog:", backlog);
        continue; // Skip to the next iteration if the task does not exist
      }
      

      // Check and delete product_backlog
      const productBacklogToDelete = await prisma.product_backlog.findUnique({
        where: {
          product_backlog_id: backlog.product_backlog_id,
        },
      });

      if (!productBacklogToDelete) {
        console.log("Product backlog does not exist for the current backlog:", backlog);
        continue; // Skip to the next iteration if the product backlog does not exist
      }
      

      await prisma.product_backlog.delete({
        where: {
          product_backlog_id: backlog.product_backlog_id,
        },

      });

      console.log("Product backlog deleted for the current backlog:", backlog);
      await prisma.task.deleteMany({
        where: {
          task_id: backlog.task_id,
          product_backlog_id: backlog.product_backlog_id,
        },
      });

      console.log("Task deleted for the current backlog:", backlog);
      // Check and update project
      const projectToUpdate = await prisma.project.findUnique({
        where: {
          project_id: backlog.project_id,
        },
      });

      if (!projectToUpdate) {
        console.log("Project does not exist for the current backlog:", backlog);
        continue; // Skip to the next iteration if the project does not exist
      }

      await prisma.project.update({
        where: {
          project_id: backlog.project_id,
        },
        data:{
          product_backlog_id: null
        }
      });

      console.log("Project updated for the current backlog:", backlog);

      // Add similar checks and deletion logic for other related entities as needed

    }

    return res.status(201).json({ message: "All given product backlogs have been deleted!" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "All given product backlogs have not been deleted!" });
  }
});



router.post('/create', authorize, async (req, res) => {
  console.log(req.body)
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
        status: progress,
        product_backlog_id: newProductBacklog.product_backlog_id
      }
    })
    if (!task) {
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
    const updatedTask = await prisma.task.update({
      where: {
        task_id: task.task_id
      },
      data: {
        product_backlog_id: newProductBacklog.product_backlog_id
      }
    })
    if (!updatedTask) {
      return res.status(404).json({ error: "No task found" })
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
router.post('/update-estimates', async (req, res) => {
  const {product_backlog_id, points,user_id} = req.body
  // console.log(req.body)
  if (!product_backlog_id || !points || !user_id) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }
  //check if product backlog exists and its estimates is null
  try {
    const developer_id = await prisma.developer.findUnique({
      where: {
        users:{
          user_id: parseInt(user_id)
        }
      }}).developer_id
    if (!developer_id) {
      return res.status(404).json({ error: "No developer found" })
    }
    const productBacklog = await prisma.product_backlog.findUnique({
      where: {
        product_backlog_id: parseInt(product_backlog_id)
      }
    })
    if (!productBacklog) {
      return res.status(404).json({ error: "No product backlog found" })
    }
    if (productBacklog.estimates_id) {
      const estimates = await prisma.estimates.findUnique({
        where: {
          estimates_id: productBacklog.estimates_id
        }
      })
      if (!estimates) {
        return res.status(404).json({ error: "No estimates found" })
      }
      const updatedEstimates = await prisma.estimates.update({
        where: {
          estimates_id: productBacklog.estimates_id
        },
        data: {
          story_points: points,
          developer_id: parseInt(developer_id)
        }
      })
      if (!updatedEstimates) {
        return res.status(404).json({ error: "Error" })
      }
      res.status(200).json({ "message": "Estimates updated successfully", updatedEstimates })
    }
    const estimates = await prisma.estimates.create({
      data: {
        story_points: points,
        developer_id: parseInt(developer_id)
      }
    })
    if (!estimates) {
      return res.status(404).json({ error: "No estimates found" })
    }
    const updatedProductBacklog = await prisma.product_backlog.update({
      where: {
        product_backlog_id: parseInt(product_backlog_id)
      },
      data: {
        estimates_id: estimates.estimates_id
      }
    })
    if (!updatedProductBacklog) {
      return res.status(404).json({ error: "No product backlog found" })
    }
    res.status(200).json({ "message": "Estimates updated successfully", updatedProductBacklog })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }

})
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