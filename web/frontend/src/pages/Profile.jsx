import React, { useState, useEffect } from 'react';
import baseUrl from "../config/baseUrl";
import 'bootstrap/dist/css/bootstrap.min.css';

const interruptType = [
    'Sick time', 'Reviews and walk-throughs', 'Interviewing candidates', 'Meetings', 'Demonstrations',
    'Personnel issues', 'Phone calls', 'Special projects', 'Management review', 'Training Email',
    'Reviews and walk-throughs', 'Interviewing candidates', 'Task Switching', 'Bug fixing in current releases', "Others"
];

export default function Profile() {
    const [user, setUser] = useState({});
    const [interrupts, setInterrupts] = useState([]);
    const [interrupt, setInterrupt] = useState({ name: "", hours: 0, minutes: 0 });
    const [inputEvent, setInputEvent] = useState({ interrupt: false, otherInterrupts: false });
    const [additionalInterrupt, setAdditionalInterrupt] = useState('');
    const [flashMessage, setFlashMessage] = useState(null);
    const [project, setProject] = useState(JSON.parse(localStorage.getItem('project')));
    const [velocity, setVelocity] = useState(null);

    useEffect(() => {
        console.log("Project from localStorage: ", project);

        const fetchProfile = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setUser(data.user);
                    fetchInterrupts(data.user.developer_id, project.project_id);
                } else {
                    console.error('Failed to fetch profile data', data);
                }
            } catch (error) {
                console.error('Error fetching profile data', error);
            }
        };

        

        fetchProfile();
    }, [project]);
    const fetchInterrupts = async (developerId, projectId) => {
        try {
            const response = await fetch(`${baseUrl}/api/auth/profile/interrupts/fetch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    projId: projectId,
                    developerId: developerId
                })
            }).then(response => response.json())
            .then(data => {
                console.log("Data: ", data.interrupts);
                setInterrupts(data.interrupts);
            }
            );
        } catch (error) {
            console.error('Error fetching interrupts', error);
        }
    };
    const handleSaveProfile = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify(user)
            });
            if (response.ok) {
                setFlashMessage('Profile updated successfully');
            } else {
                console.error('Failed to update profile', response);
            }
        } catch (error) {
            console.error('Error updating profile', error);
        }
    };

    const handleOnBlur = async () => {
       
        console.log("Project from localStorage: ", project.project_id);
        try {
            const response = await fetch(`${baseUrl}/api/auth/profile/interrupts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: interrupt.name === 'Others' ? additionalInterrupt : interrupt.name,
                    hours: interrupt.hours,
                    minutes: interrupt.minutes,
                    projId: project.project_id
                })
            });
            const data = await response.json();
            if (response.ok) {
                // setInterrupts([...interrupts, data.interrupt]);
                fetchInterrupts(user.developer_id, project.project_id);
                setInputEvent({ interrupt: false, otherInterrupts: false });
                setInterrupt({ name: "", hours: 0, minutes: 0 });
            } else {
                console.error('Failed to add interrupt', data);
            }
        } catch (error) {
            console.error('Error adding interrupt', error);
        }
    };

    const removeItem = async (index) => {
        const interruptId = interrupts[index].id; // Ensure you have an ID for each interrupt
        try {
            const response = await fetch(`${baseUrl}/api/auth/profile/interrupts/${interruptId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                setInterrupts((prevInterrupts) => {
                    const newInterrupts = [...prevInterrupts];
                    newInterrupts.splice(index, 1);
                    return newInterrupts;
                });
            } else {
                console.error('Failed to remove interrupt');
            }
        } catch (error) {
            console.error('Error removing interrupt', error);
        }
    };

    return (
        <div className="container" style={{ paddingLeft: "180px", marginTop: '80px' }}>
            {flashMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {flashMessage}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}
            <div className="row">
                <div className="col">
                    <h1 className="display-5">Profile</h1>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-container">
                        <div className="row">
                            <div className="col">
                                <div className="mb-2">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        value={user.username || ''}
                                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                                        placeholder="Name"
                                    />
                                </div>
                            </div>
                            <div className="col">
                                <div className="mb-2">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={user.email || ''}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        placeholder="Email"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="mb-2">
                                    <label htmlFor="pass" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Password"
                                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="col">
                                <div className="mb-4">
                                    <label htmlFor="role" className="form-label">Role</label>
                                    <input
                                        disabled
                                        type="text"
                                        className="form-control"
                                        id="role"
                                        value={user.role || ''}
                                        onChange={(e) => setUser({ ...user, role: e.target.value })}
                                        placeholder="Role"
                                    />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col">
                                <h1 className="display-6 text-center">Interrupt Hours</h1>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col d-flex justify-content-center align-items-center">
                                <table className="table" style={{ width: 'fit-content' }}>
                                    <tbody>
                                        {interrupts.length > 0 ? (
                                            interrupts.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td className="px-5">{`${item.hours}h ${item.minutes}m`}</td>
                                                    <td>
                                                        <div className="d-flex justify-content-center align-items-center">
                                                            <button className="btn btn-danger btn-sm" onClick={() => removeItem(index)}>-</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td>No Interrupts</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="row mt-3">
                            {inputEvent.interrupt ? (
                                <div className="col d-flex justify-content-center align-items-center">
                                    <div className="mb-3 me-3">
                                        <select
                                            className="form-select"
                                            value={interrupt.name}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setInterrupt({ ...interrupt, name: value });
                                                if (value === "Others") {
                                                    setInputEvent({ ...inputEvent, otherInterrupts: true });
                                                } else {
                                                    setInputEvent({ ...inputEvent, otherInterrupts: false });
                                                }
                                            }}
                                        >
                                            <option value="" disabled>Select Interrupt Type</option>
                                            {interruptType.map((item, index) => (
                                                <option key={index} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {inputEvent.otherInterrupts && (
                                        <div className="mb-3 mx-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="interruptName"
                                                placeholder="Type"
                                                value={additionalInterrupt}
                                                onChange={(e) => setAdditionalInterrupt(e.target.value)}
                                            />
                                        </div>
                                    )}
                                    <div className="mb-3 mx-2">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="interruptHours"
                                            placeholder="Hours"
                                            value={interrupt.hours}
                                            onChange={(e) => setInterrupt({ ...interrupt, hours: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="mb-3 mx-2">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="interruptMinutes"
                                            placeholder="Minutes"
                                            value={interrupt.minutes}
                                            onChange={(e) => setInterrupt({ ...interrupt, minutes: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="mb-3 mx-2">
                                        <button className="btn btn-primary" onClick={handleOnBlur}>+</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="col d-flex justify-content-center align-items-center">
                                    <span className="me-4" onClick={() => setInputEvent({ ...inputEvent, interrupt: true })} style={{ cursor: "pointer" }}>
                                        + Add Interrupt
                                    </span>
                                </div>
                            )}
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col">
                                <h1 className="display-6 text-center">Velocity</h1>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col d-flex justify-content-center align-items-center">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="velocity"
                                    placeholder="Story points per Sprint"
                                    value={user.velocity || ''}
                                    onChange={(e) => setUser({ ...user, velocity: e.target.value })}
                                    style={{ width: "fit-content" }}
                                />
                            </div>
                        </div>
                        <div className="row my-3">
                            <div className="d-flex justify-content-center align-items-center">
                                <button className="btn btn-primary" onClick={handleSaveProfile}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
