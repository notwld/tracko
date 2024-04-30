const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authorize = require('../middlewares/authorize.js');

router.get('/fp', authorize, async (req, res) => {
    try {
        const {projectId} = req.body;
        const fp = await prisma.fp.findMany({
            where: {
                project_id: projectId
            }
        });
        res.status(200).json({ fp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/create', authorize, async (req, res) => {
    const {inputs, outputs, inquiries, files, interfaces, projectId} = req.body;
    if (!inputs || !outputs || !inquiries || !files || !interfaces || !projectId) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }
    try {
        const fp = await prisma.fp.create({
            data: {
                inputs,
                outputs,
                inquiries,
                files,
                interfaces,
                project_id: projectId
            }
        });
        res.status(200).json({ fp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.put('/update', authorize, async (req, res) => {
    const {id, inputs, outputs, inquiries, files, interfaces} = req.body;
    if (!id || !inputs || !outputs || !inquiries || !files || !interfaces) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }
    try {
        const fp = await prisma.fp.update({
            where: {
                id: id
            },
            data: {
                inputs,
                outputs,
                inquiries,
                files,
                interfaces
            }
        });
        res.status(200).json({ fp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.delete('/delete', authorize, async (req, res) => {
    const {id} = req.body;
    if (!id) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }
    try {
        const fp = await prisma.fp.delete({
            where: {
                id: id
            }
        });
        res.status(200).json({ fp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


module.exports = router;