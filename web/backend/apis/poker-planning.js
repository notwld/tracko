
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
    const {projectId} = req.body;
    console.log(projectId);
    if (!projectId) {
        return res.status(400).json({message: "Please provide all required fields"});
    }
    projId = projectId;
    inviteCode = Math.random().toString(36).substring(2, 7);
    return res.status(200).json({inviteCode});
})

router.post('/join', async (req, res) => {
    const {code,email} = req.body;
    try{
        if (!code || !email) {
            res.status(400).json({message: "Please provide all required fields"});
        }
        if (code === inviteCode) {
            const user = await prisma.users.findFirst({
                where: {
                    email: email
                }
            })
            if (!user) {
                return res.status(400).json({message: "User not found"});
            }
            const project = await prisma.project.findUnique({
                where: {
                    project_id: projId
                },
            })
            if (!project) {
                return res.status(400).json({message: "Project not found"});
            }
            const product_backlogs = await prisma.product_backlog.findMany({
                where: {
                    project_id: projId
                }
            });
            if (!product_backlogs) {
                return res.status(400).json({message: "Product backlogs not found"});
            }
            return res.status(200).json({project,user,product_backlogs});
        } else {
            return res.status(400).json({message: "Invalid invite code"});
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
    return res.status(200).json({message: "Invite code and project id reset"});
})

module.exports = router;