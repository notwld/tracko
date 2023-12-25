const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authorize = require('../middlewares/authorize.js');


// GET /api/team
router.get('/list', authorize, async (req, res) => {
    try {
        const team = await prisma.project_team.findMany({
            where: {
                project_id: req.body.project_id,
            },
        });

        res.status(200).json({ team });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/team

router.post('/add', authorize, async (req, res) => {
    const { project_id, member_email } = req.body;
    try {
        // Validate input
        if (!project_id || !member_email) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }
        // get project, its product owner
        const project = await prisma.project.findUnique({
            where: {
                project_id: project_id,
            },
        });

        // get developer
        const member = await prisma.developer.findUnique({
            where: {
                users: {
                    email: member_email,
                },
            },
        });

        // find team
        const team = await prisma.project_team.findMany({
            where: {
                project_id: project_id,
            },
        });

        // if team dont exist, create one
        if (!team) {
            const newTeam = await prisma.project_team.create({
                data: {
                    project_id: project_id,
                    developer_id: member.developer_id,
                    product_owner_id: project.product_owner_id,
                },
            });
        }
        else {
            const newTeam = await prisma.project_team.update({
                where: {
                    project_id: project_id,
                },
                data: {
                    developer_id: member.developer_id,
                    product_owner_id: project.product_owner_id,
                },
            });
        }
        res.status(201).json({ message: 'Team member added successfully', team: newTeam });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST invite

router.post('/invite', authorize, async (req, res) => {
    const { project_id, member_email } = req.body;
    console.log(req.body);
    try {
        // Validate input
        if (!project_id || !member_email) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }
        // find if project exist and the member is a developer
        const project = await prisma.project.findUnique({
            where: {
                project_id: project_id,
            },
            

        });
        console.log(project);
        const member = await prisma.developer.findFirst({
            where: {
                users: {
                    email: member_email,
                },
            },
            include: {
                users: true,
            },

        });
        // check if member is already in the given project team
        const team = await prisma.project_team.findFirst({
            where: {
                project_id: project_id,
                developer_id: member.developer_id,
            },
        });
        if (!project || !member || team) {
            return res.status(400).json({ error: 'Project or member does not exist' });
        }
        const productOwnerOfProject = await prisma.product_owner.findUnique({
            where: {
                product_owner_id:project.product_owner_id
            },
            include:{
                users:true
            }
        });

        console.log(productOwnerOfProject);
        const notify = await prisma.notification.create({
            data: {
                users: {
                    connect: {
                        user_id: member.users.user_id,
                    },
                },
                message: `You have been invited to join the project ${project.title} by ${productOwnerOfProject.users.username}`,
            },
            

        });
        res.status(201).json({ message: 'Team member invited successfully'});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

module.exports = router;