import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'bootstrap/dist/css/bootstrap.min.css';
import baseUrl from '../config/baseUrl';
import Calculations from './Calculations';
import { collection, onSnapshot } from 'firebase/firestore';
import { database } from '../config/firebase';

const ItemType = {
    ITEM: 'item'
};

const DraggableItem = ({ item, type, moveItem }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemType.ITEM,
        item: { ...item, type },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                moveItem(item.product_backlog_id, item.type, dropResult.to, item.story_points);
            }
        },
    }), [item]);

    return (
        <div ref={drag} className="card m-2 shadow-sm" style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}>
            <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">{item.description}</p>
                <p className="card-text"><strong>Story Points: {item.story_points}</strong></p>
            </div>
        </div>
    );
};

const DropZone = ({ children, type }) => {
    const [, drop] = useDrop(() => ({
        accept: ItemType.ITEM,
        drop: () => ({ to: type }),
    }));

    return (
        <div ref={drop} className="drop-zone p-3" style={{ minHeight: '200px', backgroundColor: '#f8f9fa', border: 'dashed 2px #ccc' }}>
            {children.length > 0 ? children : <p className="text-center text-muted">Drag items here</p>}
        </div>
    );
};

const Sprint = ({ initialBacklogs, onClose }) => {
    console.log('Initial Backlogs:', initialBacklogs);
    const [sprintItems, setSprintItems] = useState([]);
    const [backlogs, setBacklogs] = useState([]);
    const [userStories, setUserStories] = useState([]);
    const [agileUsecases, setAgileUsecases] = useState([]);
    const [sprintLength, setSprintLength] = useState('');
    const [workingDays, setWorkingDays] = useState('');
    const [availableDays, setAvailableDays] = useState({});
    const [interruptHours, setInterruptHours] = useState({});
    const [officeHours, setOfficeHours] = useState('');
    const [weekdays, setWeekdays] = useState(0);
    const [projectId, setProjectId] = useState(JSON.parse(localStorage.getItem('project')).project_id);
    const [hrsPerStoryPoint, setHrsPerStoryPoint] = useState(1); // Default to 1 to avoid multiplication by 0
    const [totalStoryPoints, setTotalStoryPoints] = useState(0);
    const [totalAvailabilityHours, setTotalAvailabilityHours] = useState(0);
    const [showLimitPopup, setShowLimitPopup] = useState(false);
    const [currentSprintPoints, setCurrentSprintPoints] = useState(0);
    const [toggleUseCases, setToggleUseCases] = useState(false);

    const [salaries, setSalaries] = useState(JSON.parse(localStorage.getItem('salaries')) || {});
    const [perDaySalaries, setPerDaySalaries] = useState(JSON.parse(localStorage.getItem('perDaySalaries')) || {});

    useEffect(() => {
        setBacklogs(initialBacklogs);
        setUserStories(initialBacklogs); // Initialize user stories table with initial backlogs
        const fetchInterrupts = async () => {
            await fetch(baseUrl + '/api/sprint/team/stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ project_id: projectId }),
            })
                .then(response => response.json())
                .then(data => setInterruptHours(data))
                .catch(error => console.error('Error fetching team stats:', error));
        };
        fetchInterrupts();
    }, [initialBacklogs, projectId]);

    useEffect(() => {
        if (sprintLength && workingDays) {
            setWeekdays(workingDays / sprintLength);
        }
    }, [sprintLength, workingDays]);

    useEffect(() => {
        const totalPoints = userStories.reduce((acc, item) => acc + parseFloat(item.story_points || 0), 0);
        setTotalStoryPoints(totalPoints);
    }, [userStories]);

    useEffect(() => {
        const totalAvailHours = Object.keys(availableDays).reduce((acc, member) => {
            const { totalAvailableHours } = calculateAvailability(member);
            return acc + totalAvailableHours;
        }, 0);
        setTotalAvailabilityHours(totalAvailHours);
    }, [availableDays, officeHours, interruptHours, weekdays]);

    useEffect(() => {
        const collectionRef = collection(database, "usecasesAgile");
        onSnapshot(collectionRef, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push(doc.data());
            });
            console.log(data);
            setAgileUsecases(data);
        });
    }, []);

    const moveItem = (id, from, to, storyPoints) => {
        const storyPointsPerSprint = totalAvailabilityHours / hrsPerStoryPoint;
        if (from === to) {
            return;
        }

        let updatedBacklogs = [...backlogs];
        let updatedSprintItems = [...sprintItems];

        if (to === 'sprint') {
            if (currentSprintPoints + parseFloat(storyPoints) > storyPointsPerSprint) {
                setShowLimitPopup(true);
                return;
            }
            const item = backlogs.find(item => item.product_backlog_id === id);
            updatedSprintItems = [...sprintItems, item];
            updatedBacklogs = backlogs.filter(item => item.product_backlog_id !== id);
            setCurrentSprintPoints(currentSprintPoints + parseFloat(storyPoints));
        } else if (to === 'backlog') {
            const item = sprintItems.find(item => item.product_backlog_id === id);
            updatedBacklogs = [...backlogs, item];
            updatedSprintItems = sprintItems.filter(item => item.product_backlog_id !== id);
            setCurrentSprintPoints(currentSprintPoints - parseFloat(storyPoints));
        }

        setBacklogs(updatedBacklogs);
        setSprintItems(updatedSprintItems);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        console.log('Sprint Length:', sprintLength);
        console.log('Working Days:', workingDays);
        console.log('Available Days:', availableDays);
        console.log('Interrupt Hours:', interruptHours);
    };

    const handleAvailableDaysChange = (e, member) => {
        setAvailableDays(prev => ({ ...prev, [member]: e.target.value }));
    };

    const handleStoryPointsChange = (e, itemId) => {
        const newUserStories = userStories.map(item =>
            item.product_backlog_id === itemId ? { ...item, story_points: e.target.value } : item
        );
        const newBacklogs = backlogs.map(item =>
            item.product_backlog_id === itemId ? { ...item, story_points: e.target.value } : item
        );
        setUserStories(newUserStories);
        setBacklogs(newBacklogs);
    };

    const handleInterruptHoursChange = (e, member) => {
        setInterruptHours({ ...interruptHours, [member]: e.target.value });
        localStorage.setItem('interruptHours', JSON.stringify({ ...interruptHours, [member]: e.target.value }));
    };

    const calculateAvailability = (member) => {
        const interruptHoursPerWeek = interruptHours[member] / weekdays;
        const availableHoursPerDay = officeHours - interruptHoursPerWeek;
        const totalAvailableHours = availableDays[member] * availableHoursPerDay;
        return { interruptHoursPerWeek, availableHoursPerDay, totalAvailableHours };
    };

    const storyPointsPerSprint = (totalAvailabilityHours / hrsPerStoryPoint).toFixed(2);
    const numberOfSprints = (totalStoryPoints / storyPointsPerSprint).toFixed(2);

    const calculateUsecasePoints = (usecase) => {
        const actorPoints = Object.values(usecase.actorWeights).reduce((acc, weight) => acc + weight, 0);
        return actorPoints + usecase.useCasePoints;
    };

    const totalUsecasePoints = agileUsecases.reduce((acc, usecase) => acc + calculateUsecasePoints(usecase), 0);
    const usecasePointsPerSprint = (totalUsecasePoints).toFixed(2);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Sprint Planning</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleFormSubmit} className="mb-4">
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="sprintLength" className="form-label">Sprint Length (weeks)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="sprintLength"
                                            value={sprintLength}
                                            onChange={(e) => setSprintLength(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="workingDays" className="form-label">Working Days in Sprint</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="workingDays"
                                            value={workingDays}
                                            onChange={(e) => setWorkingDays(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="officeHours" className="form-label">Office Hours per Day</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="officeHours"
                                            value={officeHours}
                                            onChange={(e) => setOfficeHours(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </form>
                            <div className="row mb-4">
                                <div className="col-12">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th scope="col">Team Member</th>
                                                <th scope="col">Availability During Sprint (in Days)</th>
                                                <th scope="col">Interrupt Hours</th>
                                                <th scope="col">Interrupt Hours (per Week)</th>
                                                <th scope="col">Availability Hours (per Day)</th>
                                                <th scope="col">Total Availability Hours (in Sprint)</th>
                                                <th scope="col">Salary</th>
                                                <th scope="col">Per Day Salary</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(interruptHours).map(member => {
                                                const { interruptHoursPerWeek, availableHoursPerDay, totalAvailableHours } = calculateAvailability(member);
                                                return (
                                                    <tr key={member}>
                                                        <td>{member}</td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                value={availableDays[member] || ''}
                                                                onChange={(e) => handleAvailableDaysChange(e, member)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                value={interruptHours[member] || ''}
                                                                onChange={(e) => handleInterruptHoursChange(e, member)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>{interruptHoursPerWeek.toFixed(2)}</td>
                                                        <td>{availableHoursPerDay.toFixed(2)}</td>
                                                        <td>{totalAvailableHours.toFixed(2)}</td>
                                                        <td>{salaries[member]}</td>
                                                        <td>{perDaySalaries[member]}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-12">
                                    <label htmlFor="hrsPerStoryPoint" className="form-label">Hours per Story Point</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="hrsPerStoryPoint"
                                        value={hrsPerStoryPoint}
                                        onChange={(e) => setHrsPerStoryPoint(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row mb-4">
                                <button className="btn btn-primary" onClick={() => setToggleUseCases(!toggleUseCases)}>
                                    {toggleUseCases ? 'Hide Use Cases' : 'Show Use Cases'}
                                </button>
                                {toggleUseCases ? (
                                    <div className='col-12'>
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Usecase</th>
                                                    <th scope="col">Description</th>
                                                    <th scope="col">Usecase Points</th>
                                                    <th scope="col">Actor Weights</th>
                                                    <th scope="col">Total Usecase Points</th>
                                                    <th scope="col">Usecase Points (hours)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {agileUsecases.map((usecase) => (
                                                    <tr key={usecase.usecase_id}>
                                                        <td>{usecase.usecase.title}</td>
                                                        <td>{usecase.usecase.description}</td>
                                                        <td>{usecase.useCasePoints}</td>
                                                        <td>
                                                            {Object.entries(usecase.actorWeights).map(([actor, weight]) => (
                                                                <div key={actor}>{actor}: {weight}</div>
                                                            ))}
                                                        </td>
                                                        <td>{calculateUsecasePoints(usecase)}</td>
                                                        <td>{(calculateUsecasePoints(usecase) * hrsPerStoryPoint).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="col-12">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th scope="col">User Story</th>
                                                    <th scope="col">Story Points</th>
                                                    <th scope="col">Story Points (hours)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userStories.map((item) => (
                                                    <tr key={item.product_backlog_id}>
                                                        <td>{item.title}</td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                value={item.story_points || ''}
                                                                onChange={(e) => handleStoryPointsChange(e, item.product_backlog_id)}
                                                                required
                                                            />
                                                        </td>
                                                        <td>{(item.story_points * hrsPerStoryPoint).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="row mb-4">
                                <div className="col-12">
                                    {toggleUseCases ? (
                                        <>
                                            <h5>Total Usecase Points: {totalUsecasePoints}</h5>
                                            <h5>Usecase Points per Sprint: {usecasePointsPerSprint}</h5>
                                        </>
                                    ) : (
                                        <>
                                            <h5>Total Story Points: {totalStoryPoints.toFixed(2)}</h5>
                                            <h5>Story Points per Sprint: {storyPointsPerSprint}</h5>
                                        </>
                                    )}
                                    <h5>Total Availability Hours (in Sprint): {totalAvailabilityHours.toFixed(2)}</h5>
                                    <h5>Number of Sprints Required: {numberOfSprints}</h5>
                                </div>
                            </div>
                            <div className="row">
                                {showLimitPopup && (
                                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                        <strong>Limit Reached!</strong> The sprint cannot accommodate more story points.
                                        <button type="button" className="btn-close" onClick={() => setShowLimitPopup(false)}></button>
                                    </div>
                                )}
                            </div>
                            <div className="row mt-4">
                                <Calculations
                                    officeHoursPerDay={officeHours}
                                    sprintLength={sprintLength}
                                    workingDays={workingDays}
                                    hrsPerStoryPoint={hrsPerStoryPoint}
                                    teamMembers={Object.keys(availableDays).map(member => ({
                                        name: member,
                                        availabilityDays: availableDays[member],
                                        interruptHours: interruptHours[member],
                                        salary: salaries[member],
                                        perDaySalary: perDaySalaries[member]
                                    }))}
                                    totalAvailabilityHours={totalAvailabilityHours}
                                    totalStoryPoints={totalStoryPoints}
                                    storyPointsPerSprint={storyPointsPerSprint}
                                />
                            </div>
                            <div className="row">
                                {showLimitPopup && (
                                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                        <strong>Limit Reached!</strong> The sprint cannot accommodate more story points.
                                        <button type="button" className="btn-close" onClick={() => setShowLimitPopup(false)}></button>
                                    </div>
                                )}
                            </div>
                            <div className="row mt-4">
                                <Calculations
                                    officeHoursPerDay={officeHours}
                                    sprintLength={sprintLength}
                                    workingDays={workingDays}
                                    hrsPerStoryPoint={hrsPerStoryPoint}
                                    teamMembers={Object.keys(availableDays).map(member => ({
                                        name: member,
                                        availabilityDays: availableDays[member],
                                        interruptHours: interruptHours[member],
                                        salary: salaries[member],
                                        perDaySalary: perDaySalaries[member]
                                    }))}
                                    totalAvailabilityHours={totalAvailabilityHours}
                                    totalStoryPoints={totalStoryPoints}
                                    storyPointsPerSprint={storyPointsPerSprint}
                                />
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <h4>Sprint</h4>
                                    <DropZone type="sprint">
                                        {sprintItems.map((item) => (
                                            <DraggableItem key={item.product_backlog_id} item={item} type="sprint" moveItem={moveItem} />
                                        ))}
                                    </DropZone>
                                </div>
                                <div className="col-6">
                                    <h4>Backlogs</h4>
                                    <DropZone type="backlog">
                                        {backlogs.map((item) => (
                                            <DraggableItem key={item.product_backlog_id} item={item} type="backlog" moveItem={moveItem} />
                                        ))}
                                    </DropZone>
                                </div>
                            </div>
                            

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default Sprint;
