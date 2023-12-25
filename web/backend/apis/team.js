const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authorize = require('../middlewares/authorize.js');


// GET /api/team
router.get('/:project_id', authorize, async (req, res) => {
    const { project_id } = req.params;
    if (!project_id) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    try {
        const team = await prisma.project_team.findMany({
            where: {
                project_id: parseInt(project_id),
            },
           select:{
                developer:{
                    select:{
                        users:true
                    }
                },
                product_owner:{
                    select:{
                        users:true
                    }
                },
                
           }
        });
        console.log(team);
        if (!team || team.length === 0) {
            return res.status(404).json({ error: 'No team found' });
        }

        res.status(200).json({ team });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/team

router.post('/add', authorize, async (req, res) => {
    console.log(req.body);
    const { project_id, product_owner_id, developer_id, invitation_id } = req.body;

    try {
        if (!project_id || !product_owner_id || !developer_id) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        // Check if the developer exists
        const existingDeveloper = await prisma.developer.findUnique({
            where: {
                developer_id: developer_id,
            },
        });

        if (!existingDeveloper) {
            return res.status(400).json({ error: 'Developer does not exist' });
        }

        const invitation = await prisma.invitation.findUnique({
            where: {
                invitation_id: invitation_id,
            },
        });

        if (!invitation) {
            return res.status(400).json({ error: 'Invitation does not exist' });
        }

        const project = await prisma.project.findUnique({
            where: {
                project_id: project_id,
            },
        });

        if (!project) {
            return res.status(400).json({ error: 'Project does not exist' });
        }

        const teamMember = await prisma.project_team.findFirst({
            where: {
                project_id: project_id,
                developer_id: developer_id,
            },
        });

        if (teamMember) {
            return res.status(400).json({ error: 'Developer is already in the team' });
        }

        const newTeam = await prisma.project_team.create({
            data: {
                developer: {
                    connect: {
                        developer_id: developer_id,
                    }
                },

                product_owner: {
                    connect: {
                        product_owner_id: product_owner_id,
                    },
                },
                project: {
                    connect: {
                        project_id: project_id,
                    }
                }
            },
        });
        // update the invitation status
        const updatedInvitation = await prisma.invitation.update({
            where: {
                invitation_id: invitation_id,
            },
            data: {
                status: 'accepted',
            },
        });

        //update project

        const project_update = await prisma.project.update({
            where: {
                project_id: project_id
            },
            data: {
                project_team_id: newTeam.project_team_id
            }
        })

        res.status(201).json({ message: 'Team member added successfully', team: newTeam });
    } catch (error) {
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
                product_owner_id: project.product_owner_id
            },
            include: {
                users: true
            }
        });

        // console.log(productOwnerOfProject);
        const invitation = await prisma.invitation.create({
            data: {
                project_id: project_id,
                developer_id: member.developer_id,
                product_owner_id: project.product_owner_id,
                status: 'pending',
            },
        });
        const notify = await prisma.notification.create({
            data: {
                users: {
                    connect: {
                        user_id: member.users.user_id
                    },
                },
                invitation: {
                    connect: {
                        invitation_id: invitation.invitation_id
                    }
                },
                message: `You have been invited to join the project ${project.title} by ${productOwnerOfProject.users.username}`,
            },


        });

        res.status(201).json({ message: 'Team member invited successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

module.exports = router;