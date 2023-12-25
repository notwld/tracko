const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authorize = require('../middlewares/authorize.js');

// Route for creating a new project
router.post('/create', authorize, async (req, res) => {
  const { title, description, product_owner_id } = req.body;
  console.log(req.body);
  try {
    // Validate input
    if (!title || !description) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    console.log(req.session.user);
    // Create a new project
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        product_owner_id: product_owner_id,
      },
    });

    // connect the project with the product owner
    const productOwner = await prisma.product_owner.update({
      where: {
        product_owner_id: product_owner_id,
      },
      data: {
        project_id: newProject.project_id,
      },
    });

    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    console.error(error);

    if (error.code === 'P2002' && error.meta.target.includes('title')) {
      return res.status(400).json({ error: 'Project with the same title already exists' });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for retrieving all projects
router.post('/list', authorize, async (req, res) => {
  const { user_id } = req.body;
  try{
    const user = await prisma.users.findUnique({
      where: {
        user_id: user_id,
      }
    });
    if(user.role==="Product Owner"){
      const productOwner = await prisma.product_owner.findFirst({
        where: {
          users:{
            user_id: user_id,
          }
        }
      });
      const projects = await prisma.project.findMany({
        where: {
          product_owner_id: productOwner.product_owner_id,
        },
      });
      if (!projects) {
        return res.status(404).json({ error: 'No projects found' });
      }
      res.status(200).json({ projects });
    }
    else if(user.role === "Developer"){
      const developer = await prisma.developer.findFirst({
        where: {
          users:{
            user_id: user_id,
          }
        }
      });

      try{
        const projects = await prisma.project_team.findMany({
          where: {
            developer_id: developer.developer_id,
          },
          include: {
            project: true,
          },
        });
      }
      catch(error){
        console.error(error);
        res.status(404).json({ error: 'no projects found' });
      }

      if (!projects) {
        return res.status(404).json({ error: 'No projects found' });
      }
      res.status(200).json({ projects });

    }
   
  }
  catch(error){
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Route for updating a project
router.put('/update/:projectId', authorize, async (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);
  const { title, description } = req.body;

  try {
    // Validate input
    if (!title || !description) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Update the project
    const updatedProject = await prisma.project.update({
      where: {
        project_id: projectId,
      },
      data: {
        title,
        description,
      },
    });

    res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
  } catch (error) {
    console.error(error);

    if (error.code === 'P2002' && error.meta.target.includes('title')) {
      return res.status(400).json({ error: 'Project with the same title already exists' });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for deleting a project
router.delete('/delete/:projectId', authorize, async (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);

  try {
    // Delete the project
    const deletedProject = await prisma.project.delete({
      where: {
        project_id: projectId,
      },
    });

    res.status(200).json({ message: 'Project deleted successfully', project: deletedProject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get("/:projectId", authorize, async (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);
  try {
    const project = await prisma.project.findUnique({
      where: {
        project_id: projectId
      }
    })
    res.status(200).json({ project })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
module.exports = router;
