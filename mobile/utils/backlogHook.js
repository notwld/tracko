


let backlogs = [
    {
        backlogId: 1,
        storyPoint: 0,
        backLog: "As a User I want to do something"
    },
    {
        backlogId: 2,
        storyPoint: 0,
        backLog: "As a Admin I want to do something"
    },
    {
        backlogId: 3,
        storyPoint: 0,
        backLog: "As a Dev I want to do something"
    },

]


const updateStoryPoint = (point, backlogId) => {
    console.log(point, backlogId);
    const updatedBacklog = backlogs.map((backlog) => {
        if (backlog.backlogId === backlogId) {
            return {
                ...backlog,
                storyPoint: point
            }
        }
        return backlog;
    })
    backlogs = updatedBacklog;
}

export { updateStoryPoint,backlogs };
