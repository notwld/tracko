const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authorize = require('../middlewares/authorize.js');

router.get('/get', authorize, async (req, res) => {
    try {
        const {projectId} = req.body;
        const cocomo = await prisma.cocomo.findMany({
            where: {
                project_id: projectId
            }
        });
        res.status(200).json({ cocomo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

