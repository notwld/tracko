// Import necessary modules and Prisma client
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Route for creating a new project
router.post('/projects', async (req, res) => {
  const { product_owner_id, project_name, project_description, project_start_date, project_end_date, project_status } = req.body;

  try {
    // Create a new project
    const newProject = await prisma.projects.create({
      data: {
        product_owner_id,
        project_name,
        project_description,
        project_start_date,
        project_end_date,
        project_status,
      },
    });

    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export the router
module.exports = router;
