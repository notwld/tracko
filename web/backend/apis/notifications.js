const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authorize = require('../middlewares/authorize.js');

// GET /api/notificaions

router.post('/list', authorize, async (req, res) => {
    const {user_id} = req.body
    // console.log(req.body)
    // console.log(user_id,"from notifications.js")
    try {

        const notifications = await prisma.notification.findMany({
            where: {
                users:{
                    user_id: user_id,
                }
            },
            include:{
                invitation:true
            }
        });
        if (!notifications) {
            return res.status(404).json({ error: 'No notifications found' });
        }

        res.status(200).json({ notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;