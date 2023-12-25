const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authorize = require('../middlewares/authorize.js');

// GET /api/notificaions

router.get('/list', authorize, async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                user_id: req.session.user,
            },
        });

        res.status(200).json({ notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;