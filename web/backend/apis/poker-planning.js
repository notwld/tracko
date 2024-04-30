
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authorize = require('../middlewares/authorize.js');

let inviteCode = "";
let projId
router.post('/invite', authorize, async (req, res) => {
    const { projectId } = req.body;
    console.log(projectId);
    if (!projectId) {
        console.log("Please provide all required fields");
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    projId = projectId;
    inviteCode = Math.random().toString(36).substring(2, 7);
    return res.status(200).json({ inviteCode });
})

router.post('/join', async (req, res) => {
    const { code, email } = req.body;
    try {
        if (!code || !email) {
            console.log("Please provide all required fields");
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        if (code === inviteCode) {
            const user = await prisma.users.findFirst({
                where: {
                    email: email
                }
            })
            if (!user) {
                console.log("User not found");
                return res.status(400).json({ message: "User not found" });
            }
            const project = await prisma.project.findUnique({
                where: {
                    project_id: projId
                },
            })
            if (!project) {
                console.log("Project not found");
                return res.status(400).json({ message: "Project not found" });
            }
            const product_backlogs = await prisma.product_backlog.findMany({
                where: {
                    project_id: projId
                }
            });
            if (!product_backlogs) {
                console.log("Product backlogs not found");
                return res.status(400).json({ message: "Product backlogs not found" });
            }
            return res.status(200).json({ project, user, product_backlogs });
        } else {
            console.log("Invalid invite code");
            return res.status(400).json({ message: "Invalid invite code" });
        }
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
})
router.post('/usecase', async (req, res) => {
    const { code, email } = req.body;
    try {
        if (!code || !email) {
            console.log("Please provide all required fields");
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        if (code === inviteCode) {
            const user = await prisma.users.findFirst({
                where: {
                    email: email
                }
            })
            if (!user) {
                console.log("User not found");
                return res.status(400).json({ message: "User not found" });
            }
            console.log("User found");
            const project = await prisma.project.findUnique({
                where: {
                    project_id: projId
                },
            })
            if (!project) {
                console.log("Project not found");
                return res.status(400).json({ message: "Project not found" });
            }
            console.log(project);
            let usecases = await prisma.usecase.findMany({
                where: {
                    project_id: projId
                }
            });
            const actors = []
            for (const usecase of usecases) {
                const actor = await prisma.actor.findMany({
                    where: {
                        usecaseId: usecase.usecase_id
                    }
                })
                usecase.actors = actor;
            }
            if (!usecases) {
                console.log("Usecases not found");
                return res.status(400).json({ message: "Usecases not found" });
            }
            console.log("Usecases found");
            return res.status(200).json({ project, user, usecases });
        } else {
            console.log("Invalid invite code");
            return res.status(400).json({ message: "Invalid invite code" });
        }
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

// reset invite code, project id
router.get('/reset', async (req, res) => {
    inviteCode = "";
    projId = "";
    console.log("Invite code and project id reset");
    return res.status(200).json({ message: "Invite code and project id reset" });
})

module.exports = router;