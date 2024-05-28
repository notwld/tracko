import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import baseUrl from '../config/baseUrl';
import Calculations from './Calculations';
import { collection, onSnapshot, getDocs, query, where } from 'firebase/firestore';
import { database } from '../config/firebase';

const Sprint = ({ initialBacklogs, onClose }) => {

    const calculateTotalValue = (questionValues) => {
        return Object.values(questionValues).reduce((acc, value) => acc + value, 0);
    };

    const calculateTotalFp = (dataList) => {
        return dataList.reduce((acc, data) => acc + (data?.totalComplexityScore || 0), 0);
    };
    console.log('Initial Backlogs:', initialBacklogs);
    const [useFp, setUseFp] = useState(false);
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
    const [hrsPerStoryPoint, setHrsPerStoryPoint] = useState(1);
    const [totalStoryPoints, setTotalStoryPoints] = useState(0);
    const [totalAvailabilityHours, setTotalAvailabilityHours] = useState(0);
    const [showLimitPopup, setShowLimitPopup] = useState(false);
    const [currentSprintPoints, setCurrentSprintPoints] = useState(0);
    const [toggleUseCases, setToggleUseCases] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [totalFpPoints, setTotalFpPoints] = useState(0);

    const [salaries, setSalaries] = useState(JSON.parse(localStorage.getItem('salaries')) || {});
    const [perDaySalaries, setPerDaySalaries] = useState(JSON.parse(localStorage.getItem('perDaySalaries')) || {});

    useEffect(() => {
        setBacklogs(initialBacklogs);
        setUserStories(initialBacklogs);
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
        const totalPoints = userStories.reduce((acc, item) => acc + parseFloat(item.storyPoints || 0), 0);
        setTotalStoryPoints(totalPoints);
    }, [userStories]);
    useEffect(() => {
        const project = JSON.parse(localStorage.getItem('project'));

        const collectionRef = collection(database, 'questions');
        const q = onSnapshot(collectionRef, (querySnapshot) => {
            const questions = [];
            querySnapshot.forEach((doc) => {
                questions.push(doc.data());
            });
            const question = questions.filter((q) => q.projectId === project.project_id);
            const questionComplexity = question.map((q) => q.complexities);
            const collectionRef2 = collection(database, 'storypointsWithFP');
            const q2 = onSnapshot(collectionRef2, (querySnapshot) => {
                const fps = [];
                querySnapshot.forEach((doc) => {
                    fps.push(doc.data());
                });
                const filteredFp = fps.filter((fp) => fp.project_id === project.project_id);
                const totalComplexity = calculateTotalFp(filteredFp);
                const totalFpPoints = totalComplexity + calculateTotalValue(questionComplexity[0]);
                setTotalFpPoints(totalFpPoints);
            });
        });


        const collectionRef3 = collection(database, 'sprint');
        const q3 = onSnapshot(collectionRef3, (querySnapshot) => {
            const sprints = [];
            querySnapshot.forEach((doc) => {
                sprints.push(doc.data());
            });
            const sprint = sprints.filter((s) => s.projectId === project.project_id);
            const inProgressItems = sprint.flatMap(s => s.sprintItems.filter(item => item.progress === "In Progress"));

            setSprintItems(inProgressItems);
            setCurrentSprintPoints(inProgressItems.reduce((acc, item) => acc + parseFloat(item.storyPoints || 0), 0));            
        });
        // remove sprint items from users stories
        
        setUserStories(userStories.filter(story => !sprintItems.includes(story)));
        return () => {
            q();
            q3();
        };
    }, []);
    useEffect(() => {
        const updateBacklogStoryPoints = async () => {
            try {
                const updatedBacklogs = await Promise.all(
                    initialBacklogs.map(async (item) => {
                        const storyPointsRef = collection(database, 'storypoints');
                        const q = query(storyPointsRef, where("product_backlog_id", "==", item.product_backlog_id));
                        const querySnapshot = await getDocs(q);

                        const storyPoints = [];
                        querySnapshot.forEach((doc) => {
                            storyPoints.push({ ...doc.data(), id: doc.id });
                        });

                        const storyPointFrequency = {};
                        storyPoints.forEach((storyPoint) => {
                            if (storyPointFrequency[storyPoint.storyPoint]) {
                                storyPointFrequency[storyPoint.storyPoint] += 1;
                            } else {
                                storyPointFrequency[storyPoint.storyPoint] = 1;
                            }
                        });

                        let maxFrequency = 0;
                        let maxStoryPoint = null;
                        for (const storyPoint in storyPointFrequency) {
                            if (storyPointFrequency[storyPoint] > maxFrequency) {
                                maxFrequency = storyPointFrequency[storyPoint];
                                maxStoryPoint = storyPoint;
                            }
                        }

                        return {
                            ...item,
                            storyPoints: maxStoryPoint,
                        };
                    })
                );

                setUserStories(updatedBacklogs);
                console.log("updatedBacklogs", updatedBacklogs);
            } catch (error) {
                console.error("Error updating backlog story points:", error);
            }
        };

        updateBacklogStoryPoints();
    }, [initialBacklogs]);

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
            setAgileUsecases(data);
        });
    }, []);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (!sprintLength || !workingDays || !officeHours) {
            setAlertMessage("Please fill in all the required fields.");
            return;
        }
        console.log('Sprint Length:', sprintLength);
        console.log('Working Days:', workingDays);
        console.log('Available Days:', availableDays);
        console.log('Interrupt Hours:', interruptHours);
        setAlertMessage(null);
    };

    const handleAvailableDaysChange = (e, member) => {
        setAvailableDays(prev => ({ ...prev, [member]: e.target.value }));
    };

    const handleStoryPointsChange = (e, itemId) => {
        const newUserStories = userStories.map(item =>
            item.product_backlog_id === itemId ? { ...item, storyPoints: e.target.value } : item
        );
        const newBacklogs = backlogs.map(item =>
            item.product_backlog_id === itemId ? { ...item, storyPoints: e.target.value } : item
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
    const numberOfSprintsInFP = (totalFpPoints / storyPointsPerSprint).toFixed(2);

    const calculateUsecasePoints = (usecase) => {
        const actorPoints = Object.values(usecase.actorWeights).reduce((acc, weight) => acc + weight, 0);
        return actorPoints + usecase.useCasePoints;
    };

    const totalUsecasePoints = agileUsecases.reduce((acc, usecase) => acc + calculateUsecasePoints(usecase), 0);
    const usecasePointsPerSprint = (totalAvailabilityHours / hrsPerStoryPoint).toFixed(2);
    const numberOfSprintsInUsecase = (totalUsecasePoints / storyPointsPerSprint).toFixed(2);

    const handleCheckboxChange = (e, item, isUseCase = false) => {
        item.progress = "In Progress"
        const itemPoints = isUseCase ? calculateUsecasePoints(item) : parseFloat(item.storyPoints || 0);
        const pointsPerSprint = isUseCase ? usecasePointsPerSprint : storyPointsPerSprint;

        if (e.target.checked) {
            let newSprintPoints = currentSprintPoints + itemPoints;
            if (newSprintPoints > pointsPerSprint) {
                setShowLimitPopup(true);
                newSprintPoints -= itemPoints;
                return;
            }
            setSprintItems([...sprintItems, item]);
            setCurrentSprintPoints(newSprintPoints);
        } else {
            const updatedSprintItems = sprintItems.filter(i => (isUseCase ? i.usecase_id !== item.usecase_id : i.product_backlog_id !== item.product_backlog_id));
            const updatedSprintPoints = updatedSprintItems.reduce((acc, i) => acc + (isUseCase ? calculateUsecasePoints(i) : parseFloat(i.storyPoints || 0)), 0);
            setSprintItems(updatedSprintItems);
            setCurrentSprintPoints(updatedSprintPoints);
        }
    };

    const getRemainingItems = () => {
        const remainingUserStories = userStories.filter(story => !sprintItems.includes(story));
        const remainingUsecases = agileUsecases.filter(usecase => !sprintItems.includes(usecase));

        if (remainingUserStories.length > 0) {
            localStorage.setItem('remainingUserStories', JSON.stringify(remainingUserStories));
        }

        if (remainingUsecases.length > 0) {
            localStorage.setItem('remainingUsecases', JSON.stringify(remainingUsecases));
        }

        return {
            remainingUserStories,
            remainingUsecases,
        };
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg" style={{ maxWidth: '80%' }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Sprint Planning</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {alertMessage && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {alertMessage}
                                <button type="button" className="btn-close" onClick={() => setAlertMessage(null)}></button>
                            </div>
                        )}
                        <form onSubmit={handleFormSubmit} className="mb-4">
                            <div className="row mb-3" style={{ flexDirection: 'row' }}>
                                <div className="col mb-3">
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
                                <div className="col mb-3">
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
                                <div className="col mb-3">
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
                                <table className="table table-bordered" style={{ marginLeft: "0px" }}>
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
                                <label htmlFor="hrsPerStoryPoint" className="form-label">Hours per (Story Point/FP/Usecase)</label>
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
                            {/* <button className="btn btn-primary my-2" onClick={() => { setUseFp(false);setToggleUseCases(!toggleUseCases); setSprintItems([]); setCurrentSprintPoints(0); }}>
                                {toggleUseCases ? 'Show User Stories' : 'Show Use Cases'}
                            </button>
                            <button className='btn btn-primary' onClick={() => {
                                setUseFp(!useFp);
                            }}>{useFp ? 'Hide FP' : 'Use Function Points'}</button> */}
                            <div className="row d-flex justify-content-center">
                                <div className="col">
                                <select className="form-select" onChange={(e) => {
                                    if (e.target.value === 'useFp') {
                                        setUseFp(true);
                                        setToggleUseCases(false);
                                    } else if (e.target.value === 'useUsecases') {
                                        setUseFp(false);
                                        setToggleUseCases(true);
                                    } else {
                                        setUseFp(false);
                                        setToggleUseCases(false);
                                    }
                                }
                                }>
                                    <option value="useStories">Use Stories</option>
                                    <option value="useFp">Use Function Points</option>
                                    <option value="useUsecases">Use Usecases</option>
                                </select>
                                </div>

                            </div>

                            {!useFp && (toggleUseCases ? (
                                <div className='col-12'>
                                    <table className="table table-bordered" style={{ marginLeft: "0px" }}>
                                        <thead>
                                            <tr>
                                                <th scope="col">Usecase</th>
                                                <th scope="col">Description</th>
                                                <th scope="col">Usecase Points</th>
                                                <th scope="col">Actor Weights</th>
                                                <th scope="col">Total Usecase Points</th>
                                                <th scope="col">Usecase Points (hours)</th>
                                                <th scope="col">Add to Sprint</th>
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
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            onChange={(e) => handleCheckboxChange(e, usecase, true)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="col-12">
                                    <table className="table table-bordered" style={{ marginLeft: "0px" }}>
                                        <thead>
                                            <tr>
                                                <th scope="col">User Story</th>
                                                <th scope="col">Story Points</th>
                                                <th scope="col">Story Points (hours)</th>
                                                <th scope="col">Add to Sprint</th>
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
                                                            value={item.storyPoints || ''}
                                                            onChange={(e) => handleStoryPointsChange(e, item.product_backlog_id)}
                                                            required
                                                        />
                                                    </td>
                                                    <td>{(item.storyPoints * hrsPerStoryPoint).toFixed(2)}</td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            onChange={(e) => handleCheckboxChange(e, item)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                        <div className="row mb-4">
                            <div className="col-12">
                                
                                {useFp && (
                                    totalFpPoints && (
                                        <>
                                        <h5>Total Function Points: {totalFpPoints} (calculated via Poker Planning)</h5>
                                        <h5>Fp Points per Sprint: {usecasePointsPerSprint}</h5>
                                        </>

                                    )
                                )}
                                {!useFp && (toggleUseCases ? (
                                    <>
                                        <h5>Total Usecase Points: {totalUsecasePoints}</h5>
                                        <h5>Usecase Points per Sprint: {usecasePointsPerSprint}</h5>
                                    </>
                                ) : (
                                    <>
                                        <h5>Total Story Points: {totalStoryPoints.toFixed(2)}</h5>
                                        <h5>Story Points per Sprint: {storyPointsPerSprint}</h5>
                                    </>
                                ))}
                                <h5>Total Availability Hours (in Sprint): {totalAvailabilityHours.toFixed(2)}</h5>
                                <h5>Number of Sprints Required: {useFp?numberOfSprintsInFP:!toggleUseCases ? numberOfSprints : numberOfSprintsInUsecase}</h5>
                            </div>
                        </div>
                        <div className="row">
                            {showLimitPopup && (
                                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                    <strong>Limit Reached!</strong> The sprint cannot accommodate more points.
                                    <button type="button" className="btn-close" onClick={() => setShowLimitPopup(false)}></button>
                                </div>
                            )}
                        </div>

                        {!useFp&&(<div className="row">
                            <div className="col-6">
                                <h4>Sprint</h4>
                                <table className="table table-bordered" style={{ marginLeft: "0px" }}>
                                    <thead>
                                        <tr>
                                            <th scope="col">Item</th>
                                            <th scope="col">Points</th>
                                            <th scope="col">Points (hours)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sprintItems.map((item) => (
                                            <tr key={item.product_backlog_id || item.usecase_id}>
                                                <td>{item.title || item.usecase.title}</td>
                                                <td>{item.storyPoints || calculateUsecasePoints(item)}</td>
                                                <td>{((item.storyPoints || calculateUsecasePoints(item)) * hrsPerStoryPoint).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-6">
                                <h4>Backlogs</h4>
                                <table className="table table-bordered" style={{ marginLeft: "0px" }}>
                                    <thead>
                                        <tr>
                                            <th scope="col">Item</th>
                                            <th scope="col">Points</th>
                                            <th scope="col">Points (hours)</th>
                                            <th scope="col">Add to Sprint</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {toggleUseCases
                                            ? agileUsecases.map((item) => (
                                                <tr key={item.usecase_id}>
                                                    <td>{item.usecase.title}</td>
                                                    <td>{calculateUsecasePoints(item)}</td>
                                                    <td>{(calculateUsecasePoints(item) * hrsPerStoryPoint).toFixed(2)}</td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            onChange={(e) => handleCheckboxChange(e, item, true)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                            : userStories.map((item) => (
                                                <tr key={item.product_backlog_id}>
                                                    <td>{item.title}</td>
                                                    <td>{item.storyPoints}</td>
                                                    <td>{(item.storyPoints * hrsPerStoryPoint).toFixed(2)}</td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            onChange={(e) => handleCheckboxChange(e, item)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>)}
                        <div className="row mt-1">


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
                                sprintItems={sprintItems}
                                getRemainingItems={getRemainingItems}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sprint;
