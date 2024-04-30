import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import baseUrl from "../config/baseUrl"
import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../config/firebase";


export default function Project() {
    const location = useLocation();
    const [user, setUser] = useState(null)
    const [project, setProject] = useState(location.state.project)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [inputTag, setInputTag] = useState(false)
    const [email, setEmail] = useState('')
    const [team, setTeam] = useState([])
    const [projectSize, setProjectSize] = useState([])
    const [flashMessage, setFlashMessage] = useState(null)
    const [totalFpPoints, setTotalFpPoints] = useState(0)
    // const fetchProject = async () => {
    //     try {
    //         const response = await fetch(`http://localhost:3000/api/project/${projectId}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': "application/json",
    //                 'Authorization': `Bearer ${token}`,
    //             },
    //         })
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch projects');
    //         }
    //         const projectData = await response.json();
    //         console.log(projectData);
    //         setProject(projectData.project);
    //     }
    //     catch (error) {
    //         console.log(error)
    //     }
    // }
    const fetchTeam = async () => {
        try {
            const response = await fetch(baseUrl + `/api/team/${project.project_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `${token}`,
                },
            })
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const teamData = await response.json();
            console.log(teamData);
            setTeam(teamData.team);
        }
        catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const authToken = localStorage.getItem('token');
            setToken(authToken)
            setUser(JSON.parse(user));
            console.log(project)

        }
        else {
            window.location.href = '/login'
        }
        fetchTeam()
    }
        , []);

    useEffect(() => {
        const collectionRef = collection(database, 'totalStoryPoints');
        const q = onSnapshot(collectionRef, (querySnapshot) => {
            const totalStoryPoint = [];
            querySnapshot.forEach((doc) => {

                totalStoryPoint.push(doc.data());

            });
            setProjectSize(totalStoryPoint);
            console.log(totalStoryPoint);
        });
        return () => {
            q();
        };
    }, [])

    const handleOnInvite = async () => {
        setFlashMessage(null)
        setInputTag(false)
        try {
            if (email === "") {
                alert("Please enter a valid email")
            }
            await fetch(baseUrl + `/api/team/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify({
                    "member_email": email,
                    "project_id": project.project_id
                }),
            }).then((response) => {
                if (response.ok) {
                    console.log(response)
                    setFlashMessage("Invitation sent")
                    setEmail("")
                }
                else {
                    console.log(response)
                }
            })
        }
        catch (error) {
            console.log(error)
        }
    }
    const calculateTotalValue = (questionValues) => {
        let totalValue = 0;

        for (const question in questionValues) {
            totalValue += questionValues[question];
        }

        return totalValue;
    };
    const calculateTotalFp = (dataList) => {
        let totalSum = 0;

        // Iterate over the dataList and accumulate totalComplexityScore values
        dataList.forEach((data) => {
            if (data && typeof data.totalComplexityScore === 'number') {
                totalSum += data.totalComplexityScore;
            }
        });

        return totalSum;
    };
    
    useEffect(() => {
        const collectionRef = collection(database, 'questions');
        const q = onSnapshot(collectionRef, (querySnapshot) => {
            const questions = [];
            querySnapshot.forEach((doc) => {

                questions.push(doc.data());

            });

            const question = questions.filter((question) => question.projectId === project.project_id);
            // console.log(questions);
            console.log(question);
            const questionComplexity = question.map((question) => question.complexities);
            console.log(calculateTotalValue(questionComplexity[0]));
        const collectionRef2 = collection(database, 'storypointsWithFP');
        const q2 = onSnapshot(collectionRef2, (querySnapshot) => {
            const fps = [];
            querySnapshot.forEach((doc) => {

                fps.push(doc.data());

            });
            console.log(fps)
            console.log("____________totalComplexity______________");
            const filterdFp = fps.filter((fp) => fp.project_id === project.project_id);
            const totalComplexity = calculateTotalFp(filterdFp);
            console.log(totalComplexity);
            const totalFpPoints = totalComplexity + calculateTotalValue(questionComplexity[0]);
            console.log(totalFpPoints);
            setTotalFpPoints(totalFpPoints);
        });
    });


        return () => {
            q();
        };


    }, [])
    
    return (
        <>
            {user && <div className="container my-0 px-0 ps-4">
                {flashMessage && <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {flashMessage}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>}
                <div className="row mt-4">
                    <div className="container">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Project</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="container">
                            <h1 className="display-6">{project && project.title}</h1>
                            <p className="lead">{project && project.description}</p>
                            {
                                projectSize?.length > 0 && projectSize.map((size, i) => {
                                    return (
                                        size.project_id === project.project_id && i == projectSize.length - 1 && <p className="lead" key={i}>
                                            Story Points: {size.points}
                                        </p>

                                    )
                                })

                            }
                            {
                                totalFpPoints&&<p className="lead">
                                    Function Points: {totalFpPoints}
                                </p>

                            }
                        </div>
                    </div>
                </div>
                <div className="row ps-2">
                    <div className="col">
                        <div className="d-flex justify-content-between align-items-center">
                            <h1 className="display-6">
                                Team
                            </h1>
                            <div className='d-flex justify-content-end align-items-center'>
                                {user.role === "Product Owner" ? <button className="btn btn-primary btn-sm" onClick={() => setInputTag(!inputTag)}>Invite</button> : null}
                                {
                                    inputTag && <div className="input-group input-group-sm mx-2">
                                        <input type="text" className="form-control" placeholder="Enter email" aria-label="Enter email" aria-describedby="button-addon2" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
                                        <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={() => handleOnInvite()}>Send</button>
                                    </div>
                                }
                            </div>
                        </div>
                        <table className="table">
                            {
                                team.length > 0 ? (<> <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Role</th>
                                        <th>Productive Hours</th>
                                    </tr>
                                </thead>
                                    <tbody>
                                        {team.map((member, i) => {
                                            const user = member.developer?.users || member.product_owner?.users || member.scrum_master?.users;

                                            return (
                                                <tr key={i}>
                                                    <td>{user?.username}</td>
                                                    <td>{user?.role}</td>
                                                    <td>0</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody></>) : (<tbody><tr><td className="lead text-center">No team members</td></tr></tbody>)
                            }
                        </table>
                    </div>
                </div>
                <div className="row ps-2">
                    <div className="col">
                        <div className="d-flex justify-content-between align-items-center">
                            <h1 className="display-6">
                                Sprints
                            </h1>

                        </div>
                    </div>
                </div>
                <div className="ps-2 row my-2">
                    <div className="card">
                        <div className="card-content p-2">
                            <span className="lead">
                                Milestone-1
                            </span>
                        </div>
                    </div>
                </div>
                <div className="ps-2 row my-2">
                    <div className="card">
                        <div className="card-content p-2">
                            <span className="lead">
                                Milestone-1
                            </span>
                        </div>
                    </div>
                </div>
                <div className="ps-2 row my-2">
                    <div className="card">
                        <div className="card-content p-2">
                            <span className="lead">
                                Milestone-1
                            </span>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}
