import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import baseUrl from "../config/baseUrl";
import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../config/firebase";
import 'bootstrap/dist/css/bootstrap.min.css';
import SprintDetailsModal from '../components/SprintDetailsModal';

export default function Project() {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [project, setProject] = useState(location.state.project);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [inputTag, setInputTag] = useState(false);
    const [email, setEmail] = useState('');
    const [team, setTeam] = useState([]);
    const [projectSize, setProjectSize] = useState([]);
    const [flashMessage, setFlashMessage] = useState(null);
    const [totalFpPoints, setTotalFpPoints] = useState(0);
    const [sprints, setSprints] = useState([]);
    const [selectedSprint, setSelectedSprint] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchTeam = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/team/${project.project_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch team');
            }
            const teamData = await response.json();
            setTeam(teamData.team);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const authToken = localStorage.getItem('token');
            setToken(authToken);
            setUser(JSON.parse(user));
        } else {
            window.location.href = '/login';
        }
        fetchTeam();
    }, []);

    useEffect(() => {
        const collectionRef = collection(database, 'totalStoryPoints');
        const q = onSnapshot(collectionRef, (querySnapshot) => {
            const totalStoryPoint = [];
            querySnapshot.forEach((doc) => {
                totalStoryPoint.push(doc.data());
            });
            setProjectSize(totalStoryPoint);
        });
        return () => {
            q();
        };
    }, []);

    useEffect(() => {
        const collectionRef = collection(database, 'sprint');
        const q = onSnapshot(collectionRef, (querySnapshot) => {
            const sprintData = [];
            querySnapshot.forEach((doc) => {
                sprintData.push(doc.data());
            });
            setSprints(sprintData.filter(sprint => sprint.projectId === project.project_id));
        });
        return () => {
            q();
        };
    }, [project.project_id]);

    const handleOnInvite = async () => {
        setFlashMessage(null);
        setInputTag(false);
        try {
            if (email === "") {
                alert("Please enter a valid email");
                return;
            }
            const response = await fetch(`${baseUrl}/api/team/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify({
                    "member_email": email,
                    "project_id": project.project_id
                }),
            });
            if (response.ok) {
                setFlashMessage("Invitation sent");
                setEmail("");
            } else {
                console.error('Failed to send invitation');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const calculateTotalValue = (questionValues) => {
        return Object.values(questionValues).reduce((acc, value) => acc + value, 0);
    };

    const calculateTotalFp = (dataList) => {
        return dataList.reduce((acc, data) => acc + (data?.totalComplexityScore || 0), 0);
    };

    useEffect(() => {
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

        return () => {
            q();
        };
    }, [project.project_id]);

    const handleSprintClick = (sprint) => {
        setSelectedSprint(sprint);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSprint(null);
    };

    return (
        <>
            {user && (
                <div className="container" style={{ paddingLeft: "180px", marginTop: "80px" }}>
                    {flashMessage && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            {flashMessage}
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    )}

                    <div className="row mb-4">
                        <div className="col">
                            <h1 className="display-6">{project?.title}</h1>
                            <p className="lead">{project?.description}</p>
                            {projectSize.length > 0 && projectSize.map((size, i) => (
                                size.project_id === project.project_id && (
                                    <p className="lead" key={i}>Story Points: {size.points}</p>
                                )
                            ))}
                            {totalFpPoints && <p className="lead">Function Points: {totalFpPoints}</p>}
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col d-flex justify-content-between align-items-center">
                            <h2>Team</h2>
                            {user.role === "Product Owner" && (
                                <button className="btn btn-primary btn-sm" onClick={() => setInputTag(!inputTag)}>
                                    Invite
                                </button>
                            )}
                        </div>
                        {inputTag && (
                            <div className="input-group input-group-sm mt-2">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button className="btn btn-outline-secondary" onClick={handleOnInvite}>
                                    Send
                                </button>
                            </div>
                        )}
                        <table className="table mt-3" style={{ marginLeft: "0px" }} >
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {team.length > 0 ? (
                                    team.map((member, i) => {
                                        const user = member.developer?.users || member.product_owner?.users || member.scrum_master?.users;
                                        return (
                                            <tr key={i}>
                                                <td>{user?.username}</td>
                                                <td>{user
                                                    ?.role}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td className="lead text-center" colSpan="3">No team members</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="row mb-4">
                        <div className="col">
                            <h2>Sprints</h2>
                        </div>
                    </div>
                    <div className="row">
                        {sprints.length > 0 ? (
                            sprints.map((sprint, index) => (
                                <div className="col-md-4 mb-3" key={index}>
                                    <div className="card" onClick={() => handleSprintClick(sprint)}>
                                        <div className="card-body">
                                            <h5 className="card-title">{`Sprint-${index + 1}`}</h5>
                                            <p className="card-text">
                                                <strong>Sprint Length:</strong> {sprint.sprintLength} weeks<br />
                                                <strong>Working Days:</strong> {sprint.workingDays}<br />
                                                <strong>Story Points:</strong> {sprint.storyPointsPerSprint}<br />
                                                <strong>Total Availability Hours:</strong> {sprint.totalAvailabilityHours}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="lead">No sprints found.</p>
                        )}
                    </div>

                    {selectedSprint && (
                        <SprintDetailsModal
                            sprint={selectedSprint}
                            show={showModal}
                            onClose={handleCloseModal}
                        />
                    )}
                </div>
            )}
        </>
    );
}
