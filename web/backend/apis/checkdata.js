
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


const project =  prisma.project.findFirst({
    where: {
        title:"tracko"
    },
   
}).then((project) => {
    console.log(project);
    const project_team = prisma.project_team.findMany({
        where: {
            project_id: project.project_id,
        },
        include: {
            developer: {
                include: {
                    users: true,
                },
            },
        },
    }).then((project_team) => {
        console.log(project_team);
        return project_team;
    }).catch((error) => {
        console.log(error);
        return error;
    }
    );
    return project;
}).catch((error) => {
    console.log(error);
    return error;
}
);
// console.log(project);