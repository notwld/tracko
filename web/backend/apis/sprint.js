const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authorize = require('../middlewares/authorize.js');

  
  router.post("/team/stats",authorize, async (req, res) => {
    const { project_id } = req.body;
    if (!project_id) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    try {
        // fetching interrupt hours of the team members
        const interrupt_hours = await prisma.interrupts.findMany({
            where: {
                projectId: parseInt(project_id),
            },
        });

        // Fetching developers' details and constructing stats array
        const stats = await Promise.all(interrupt_hours.map(async (interrupt) => {
            const dev = await prisma.developer.findUnique({
                where: {
                    developer_id: interrupt.developerId
                },
                select: {
                    users: true
                }
            });
            return {
                username: dev.users.username,
                interrupt_hours: interrupt.hours,
                interrupt_minutes: interrupt.minutes
            };
        }));

        const result = aggregateInterrupts(stats);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching team stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to aggregate interrupt hours and minutes
const aggregateInterrupts = (data) => {
    const aggregated = data.reduce((acc, { username, interrupt_hours, interrupt_minutes }) => {
        if (!acc[username]) {
            acc[username] = { interrupt_hours: 0, interrupt_minutes: 0 };
        }
        acc[username].interrupt_hours += interrupt_hours;
        acc[username].interrupt_minutes += interrupt_minutes;

        return acc;
    }, {});

    // Convert hours and minutes to a single decimal value
    const result = {};
    for (const user in aggregated) {
        const totalMinutes = aggregated[user].interrupt_hours * 60 + aggregated[user].interrupt_minutes;
        const hours = (totalMinutes / 60).toFixed(2); // Convert to hours and round to 2 decimal places
        result[user] = parseFloat(hours); // Convert to float
    }

    return result;
};

module.exports = router;