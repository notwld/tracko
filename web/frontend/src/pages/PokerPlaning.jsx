import React, { useEffect, useState } from 'react'
import { auth, database, app } from '../config/firebase';
import { getStorage, ref } from 'firebase/storage';
import { orderBy, query, collection, onSnapshot, addDoc } from 'firebase/firestore';
import baseUrl from "../config/baseUrl"

export default function PokerPlaning() {
    const [user, setUser] = useState(localStorage.getItem('user'))
    const [project, setProject] = useState(localStorage.getItem('project'))
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [session, setSession] = useState(false);
    const [messages, setMessages] = useState([])
    const [formValue, setFormValue] = useState('');
    const [current, setCurrent] = useState('')
    const [storyPoints, setStoryPoints] = useState([])
    const [team, setTeam] = useState([
        {
            name: 'Muhammad Waleed',
            role: 'Developer',
            status: 'Joined'
        },
        {
            name: 'Farhan Ali',
            role: 'Developer',
            status: 'Joined'
        },
        {
            name: 'Abrar',
            role: 'Developer',
            status: 'Joined'
        },
        {
            name: 'Ameen',
            role: 'Developer',
            status: 'Joined'
        }

    ])
    const [code, setCode] = useState('')
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const authToken = localStorage.getItem('token');
            const project = localStorage.getItem('project');
            setProject(JSON.parse(project))
            setToken(authToken)
            setUser(JSON.parse(user));
            console.log(project)
        }
        else {
            window.location.href = '/login'
        }
    }, [])
    const handleSessionStart = async () => {
        try {
            console.log(project.project_id)
            const response = await fetch(baseUrl + `/api/poker-planning/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `${token}`,
                },
                body: JSON.stringify({
                    'projectId': project.project_id,

                })
            })
            if (!response.ok) {
                console.log(await response.json())
            }
            const code = await response.json();
            console.log(code);
            setCode(code)
            setSession(true)
        }
        catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const collectionRef = collection(database, 'chats');
        const q = onSnapshot(collectionRef, (querySnapshot) => {
            const messages = [];
            querySnapshot.forEach((doc) => {
                messages.push({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user._id.split('@')[0],
                    avatar: doc.data().user.avatar,
                });
            });
            setMessages(messages.reverse());
            console.log(messages);
        });

        const currentRef = collection(database, 'current');
        const currentQuery = onSnapshot(currentRef, (querySnapshot) => {
            const currentBacklog = [];
            querySnapshot.forEach((doc) => {
                currentBacklog.push({
                    ...doc.data(),
                });
            });
            console.log(currentBacklog);
            setCurrent(currentBacklog[0]); // Assuming there is only one document in the current collection
        });

        const storyPointsRef = collection(database, 'storypoints');
        const storyPointsQuery = onSnapshot(storyPointsRef, (querySnapshot) => {
            const storyPointsData = [];
            querySnapshot.forEach((doc) => {
                storyPointsData.push({
                    ...doc.data(),
                });
            });
            setStoryPoints(storyPointsData);
        });

        return () => {
            q();
            currentQuery();
            storyPointsQuery();
        };
    }, []);
    const sendMessage = async (e) => {
        e.preventDefault();

        // Check if user is defined and has necessary properties
        if (!user || !user.id || !user.name) {
            console.error("Invalid user object");
            return;
        }

        const uid = user.id;
        const name = user.name;
        const photoURL = "";
        const createdAt = new Date();

        try {
            // Ensure that the data being added does not contain undefined values
            const messageData = {
                _id: user.email || "", // Use a default value if user.email is undefined
                createdAt,
                text: formValue || "", // Use a default value if formValue is undefined
                username: name || "", // Use a default value if name is undefined
                photoURL,
            };

            addDoc(collection(database, 'chats'), messageData);
            setFormValue('');
        } catch (error) {
            console.error(error);
        }
    };


    const [selectedTeam, setSelectedTeam] = useState([])
    return (
        <div className='container my-0 px-0 ps-4' >

            <div className="row mt-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Poker Planning</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className="row">
                <div className="col">

                    <div className="d-flex justify-content-between align-items-center w-100 mb-3" style={{ width: "100%!important" }}>
                        <div>
                            <h1 className="display-5">
                                Poker Planning
                            </h1>
                        </div>
                        <div className="btns">
                            <button className=" btn btn-sm btn-primary" onClick={() => {
                                handleSessionStart()
                            }}>
                                Start Session
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            <div className="row">

                <div className="col">
                    <select className="form-select" aria-label="Default select example">
                        <option selected>Select Sizing Technique</option>
                        <option value="1">Fibonacci</option>

                    </select>
                </div>

            </div>
            <div className="row mt-3">
                {code && <div className="col">
                    <p className='lead'>
                        Invite Code: {code.inviteCode}
                    </p>
                </div>}
            </div>
            {session &&<><div className="row my-2">
                {current && (
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-content">{current.title}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="my-2">
                {
                    storyPoints?.length > 0 && storyPoints.map((point, i) => (
                        point?.product_backlog_id == current?.product_backlog_id &&<div className="card my-2" key={i}>
                            <div className="card-body">
                                { point.assignedBy + " assigned story point " + point.storyPoint}

                            </div>
                        </div>
                    ))
                }
            </div></>}
            {session && <div className='row'>
                <div className="col">
                    <div className="card">
                        <div className="card-body">
                            {
                                messages.map(msg => (
                                    <div key={msg._id} className='py-1 px-3 my-1' style={{ backgroundColor: "#e9ecef",width:"fit-content",borderRadius:"10px" }}>
                                        <div className="d-flex justify-content-start align-items-center my-3">
                                            <div className="d-flex justify-content-center align-items-center" style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#e9ecef" }}>
                                                <img src={msg.avatar} alt="" className="pe-2" style={{ borderRadius: "50%" }} width={40} />
                                            </div>
                                            <div className="ms-2">
                                                <span className='fw-bold'>
                                                    {msg.user}
                                                </span>
                                                <p className="card-text">{msg.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" placeholder="Enter message" aria-label="Recipient's username" aria-describedby="button-addon2" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                                <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={sendMessage}>Send</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>}
            {/* <div className="row mt-4 ms-1">
                <table className="table">
                    <tbody>
                        {
                            selectedTeam.length>0?selectedTeam.map((member, i) => (
                                <tr key={i}>
                                    <td>
                                        {member.name}
                                    </td>
                                    <td>
                                        {member.role}
                                    </td>
                                    <td>
                                        {member.status}
                                    </td>
                                </tr>
                            )):
                            <tr >
                                <td className='text-center'>
                                    No members selected
                                </td>
                            </tr>

                        }
                    </tbody>
                </table>

            </div>
            <div className="row">
                {
                    team.map((member, i) => (
                        <div className="col" key={i}
                            style={{
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                setSelectedTeam([...selectedTeam, member])
                                team.splice(i, 1)
                            }}
                        >
                            <span className="badge bg-primary text-wrap" style={{ width: "fit-content" }}>
                                + {member.name}
                            </span>
                        </div>
                    ))
                }
            </div> */}
        </div>
    )
}
