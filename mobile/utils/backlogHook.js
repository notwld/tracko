


let backlogs


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
