const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authorize = require('../middlewares/authorize.js');

router.get("/:projId/fetch-all", authorize, async (req, res) => {
    try {
        const { projectId } = req.params;
        let usecases = await prisma.usecase.findMany({
            where: {
                project_id: projectId
            }
        });
        const actors = []
        for (const usecase of usecases) {
            const actor = await prisma.actor.findMany({
                where: {
                    usecaseId: usecase.usecase_id
                }
            });
            actors.push(actor);
        }
        
        usecases = usecases.map((usecase, index) => {
            return {
                ...usecase,
                actors: actors[index]
            }
        });
        res.status(200).json({ usecases });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/create", authorize, async (req, res) => {
    const { title, description, preconditions, postconditions, steps, projectId, actors } = req.body;
    if (!title || !description || !preconditions || !postconditions || !steps || !projectId) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    try {
        const usecase = await prisma.usecase.create({
            data: {
                title,
                description,
                pre_condition: preconditions,
                post_condition: postconditions,
                steps,
                project_id: Number(projectId),
                
            },
            include: {
                actor: true
            }
        });

        const createactors = await prisma.actor.createMany({
            data: actors.map(actor => ({
                name: actor.name,
                usecaseId: usecase.usecase_id
            }))
        });


        res.status(200).json({ usecase });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/update", authorize, async (req, res) => {
    const { id, title, description, preconditions, postconditions, steps, actors } = req.body;
    if (!id || !title || !description || !preconditions || !postconditions || !steps) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }
    let usecase = await prisma.usecase.update({
        where: {
            usecase_id: id
        },
        data: {
            title,
            description,
            pre_condition: preconditions,
            post_condition: postconditions,
            steps
        }
    });
    let actorsUpdated = []
    for (const actor of actors) {
        const newActor = await prisma.actor.update({
            where: {
                actor_id: actor.actor_id
            },
            data: {
                name: actor.name
            }
        });
        actorsUpdated.push(newActor);
    }
    usecase = {
        ...usecase,
        actors: actorsUpdated
    }
    res.status(200).json({ usecase });

});

router.delete("/delete", authorize, async (req, res) => {
    const { usecases } = req.body;
    if (!usecases) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }
    try {
        for (const usecase of usecases) {
            await prisma.usecase.delete({
                where: {
                    usecase_id: usecase.usecase_id
                }
            }).then(() => {
                console.log(`Usecase with id ${usecase.usecase_id} deleted successfully`);
            }).catch((error) => {
                console.error(`Error deleting usecase with id ${usecase.usecase_id}`);
                console.error(error);
                return res.status(500).json({ error: "Internal Server Error" });
            });
        }

        res.status(200).json({ message: "Usecases deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
