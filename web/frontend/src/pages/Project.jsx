import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function Project() {
    const location = useLocation();
    const [user, setUser] = useState(null)
    const [project, setProject] = useState(location.state.project)
    const [token, setToken] = useState(null)
    const [inputTag, setInputTag] = useState(false)
    const [email, setEmail] = useState('')
    const [team, setTeam] = useState([])
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

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(JSON.parse(user));
            const authToken = localStorage.getItem('token');
            setToken(authToken)
            console.log(project)
        }
        else {
            window.location.href = '/login'
        }
    }
        , []);

    const handleOnInvite = async () => {
        setInputTag(false)
        try {
            await fetch(`http://localhost:3000/api/team/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    "member_email": email,
                    "project_id": project.project_id
                }),
            }).then((response) => {
                if (response.ok) {
                    console.log(response)
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

    return (
        <>
            {user && <div className="container my-0 px-0 ps-4">
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
                                {user.role === "Product Owner" && inputTag && <input type="text" className="form-control" placeholder="Invite via email" onBlur={() => { handleOnInvite() }} autoFocus onChange={(e) => { setEmail(e.target.value) }} />}
                                <button className="btn btn-sm btn-primary ms-2" onClick={() => { setInputTag(true) }}>Add Member</button>

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

                                    </tbody></>) : (<tbody><tr><td className="lead text-center">No team members</td></tr></tbody>)
                            }
                        </table>
                    </div>
                </div>
            </div>}
        </>
    )
}
