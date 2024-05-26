import React, { useEffect, useState } from 'react';
import { auth, database, app } from '../config/firebase';
import { getStorage, ref } from 'firebase/storage';
import { collection, onSnapshot, addDoc, updateDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import baseUrl from "../config/baseUrl";

export default function PokerPlanning() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [project, setProject] = useState(JSON.parse(localStorage.getItem('project')));
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [session, setSession] = useState(false);
    const [messages, setMessages] = useState([]);
    const [formValue, setFormValue] = useState('');
    const [current, setCurrent] = useState('');
    const [storyPoints, setStoryPoints] = useState([]);
    const [recording, setRecording] = useState(false);
    const [audio, setAudio] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [usecasesAgile, setUsecasesAgile] = useState([]);
    const [currentUsecaseAgile, setCurrentUsecaseAgile] = useState(null);
    const [method, setMethod] = useState(null);
    const [code, setCode] = useState('');
    const [currentFP, setCurrentFP] = useState(null);
    const [storypointsWithFP, setStorypointsWithFP] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const authToken = localStorage.getItem('token');
            const project = localStorage.getItem('project');
            setProject(JSON.parse(project));
            setToken(authToken);
            setUser(JSON.parse(user));
        } else {
            window.location.href = '/login';
        }
    }, []);

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
                    downloadURL: doc.data().downloadURL
                });
            });
            setMessages(messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()));
        });

        const currentRef = collection(database, 'current');
        const currentQuery = onSnapshot(currentRef, (querySnapshot) => {
            const currentBacklog = [];
            querySnapshot.forEach((doc) => {
                currentBacklog.push({
                    ...doc.data(),
                });
            });
            setCurrent(currentBacklog[0]);
        });

        const currentFPRef = collection(database, 'currentFP');
        const currentFPQuery = onSnapshot(currentFPRef, (querySnapshot) => {
            const currentFPBacklog = [];
            querySnapshot.forEach((doc) => {
                currentFPBacklog.push({
                    ...doc.data(),
                });
            });
            setCurrentFP(currentFPBacklog[0]);
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

        const storyPointsWithFPRef = collection(database, 'storypointsWithFP');
        const storyPointsWithFPQuery = onSnapshot(storyPointsWithFPRef, (querySnapshot) => {
            const storyPointsWithFPData = [];
            querySnapshot.forEach((doc) => {
                storyPointsWithFPData.push({
                    ...doc.data(),
                });
            });
            setStorypointsWithFP(storyPointsWithFPData);
        });

        const usecasesAgileRef = collection(database, 'usecasesAgile');
        const usecasesAgileQuery = onSnapshot(usecasesAgileRef, (querySnapshot) => {
            const usecasesAgileData = [];
            querySnapshot.forEach((doc) => {
                usecasesAgileData.push({
                    ...doc.data(),
                });
            });
            setUsecasesAgile(usecasesAgileData);
        });

        const currentUsecaseAgileRef = collection(database, 'currentUsecaseAgile');
        const currentUsecaseAgileQuery = onSnapshot(currentUsecaseAgileRef, (querySnapshot) => {
            const currentUsecaseAgileData = [];
            querySnapshot.forEach((doc) => {
                currentUsecaseAgileData.push({
                    ...doc.data(),
                });
            });
            console.log(currentUsecaseAgileData);
            setCurrentUsecaseAgile(currentUsecaseAgileData[0]);
        });

        return () => {
            q();
            currentQuery();
            currentFPQuery();
            storyPointsQuery();
            storyPointsWithFPQuery();
            usecasesAgileQuery();
            currentUsecaseAgileQuery();
        };
    }, []);

    const handleSessionStart = async () => {
        try {
            const response = await fetch(baseUrl + `/api/poker-planning/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `${token}`,
                },
                body: JSON.stringify({ 'projectId': project.project_id })
            });

            if (!response.ok) {
                console.log(await response.json());
            }

            const code = await response.json();
            setCode(code);
            setSession(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSessionEnd = async () => {
        await fetch(baseUrl + `/api/poker-planning/reset`);
        setSession(false);
    };

    const handleMethod = async (method) => {
        try {
            setMethod(method);
            const methodsCollectionRef = collection(database, 'methods');
            const methodsQuerySnapshot = await getDocs(methodsCollectionRef);

            methodsQuerySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            await addDoc(collection(database, 'methods'), { method, timestamp: new Date() });
        } catch (error) {
            console.error("Error handling method:", error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!formValue) return;

        try {
            const createdAt = new Date();
            const messageData = {
                _id: user.user_id,
                createdAt,
                text: formValue,
                user: {
                    _id: user.email || "",
                    avatar: 'https://i.pravatar.cc/300'
                },
                username: user.username
            };
            await addDoc(collection(database, 'chats'), messageData);
            setFormValue('');
        } catch (error) {
            console.error(error);
        }
    };

    const recordingHandler = (status) => {
        if (status === 'start') {
            startRecording();
        } else if (status === 'stop') {
            stopRecording();
        }
    };

    const startRecording = () => {
        setRecording(true);
        const audioChunks = [];

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            setMediaRecorder(mediaRecorder);
            mediaRecorder.start();

            mediaRecorder.addEventListener('dataavailable', (event) => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks);
                const storage = getStorage(app);
                const storageRef = ref(storage, `audios/${new Date().getTime()}.3gpp`);
                const uploadTask = uploadBytesResumable(storageRef, audioBlob);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                    },
                    (error) => {
                        console.log(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            const createdAt = new Date();
                            const messageData = {
                                _id: new Date().getTime(),
                                createdAt,
                                downloadURL,
                                user: {
                                    _id: user.email || "",
                                    avatar: 'https://i.pravatar.cc/300',
                                },
                                username: user.username
                            };
                            addDoc(collection(database, 'chats'), messageData);
                        });
                    }
                );
            });
        });
    };

    const stopRecording = () => {
        setRecording(false);
        setPlaying(false);
        mediaRecorder.stop();
    };

    const playHandler = (uri) => {
        const audio = new Audio(uri);
        audio.play();
    };

    return (
        <div className='container my-5' style={{ paddingLeft: '180px' }}>
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
                <div className="col d-flex justify-content-between align-items-center mb-3">
                    <h1 className="display-5">Poker Planning</h1>
                    <div>
                        {!session ? (
                            <button className="btn btn-sm btn-primary" onClick={handleSessionStart}>
                                Start Session
                            </button>
                        ) : (
                            <button className="btn btn-sm btn-danger" onClick={handleSessionEnd}>
                                End Session
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="row">
            <div className="row">
                <div className="col">
                    <select className="form-select" aria-label="Default select example" onChange={(e) => handleMethod(e.target.value)}>
                        <option selected>Select Sizing Technique</option>
                        <option value="FP Metrices">FP Metrices</option>
                        <option value="User Story">User Story</option>
                        <option value="Usecase Points">Usecase Points</option>
                        <option value="Usecase Points Agile">Usecase Points (Agile Mode)</option>
                    </select>
                </div>
            </div>
            
            </div>
            <div className="row mt-3">
                {code && session && (
                    <div className="col">
                        <p className='lead'>Invite Code: {code.inviteCode}</p>
                    </div>
                )}
               
            </div>

            {session && (
                <>
                    <div className="row my-2">
                        {method === "User Story" && current && (
                            <div className="col">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="card-content">{current.title}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {method === "FP Metrices" && currentFP && (
                            <div className="col">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="card-content">{currentFP.title}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {
                            method === "Usecase Points Agile" && currentUsecaseAgile && (
                                <div className="col">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="card-content">{currentUsecaseAgile.usecase.title}</div>
                                            <span>Actors:</span>
                                            {currentUsecaseAgile.usecase.actors && (currentUsecaseAgile.usecase.actors.map((actor, i) => (
                                                <div key={i} className="row">
                                                    <span>{actor.name}</span>
                                                    </div>
                                                ))
                                            
                                            )}

                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className="row my-2">
                        {method === "FP Metrices" && storypointsWithFP.length > 0 && storypointsWithFP.map((point, i) => (
                            point.product_backlog_id === currentFP.product_backlog_id && (
                                <div className="col" key={i}>
                                    <div className="card my-2">
                                        <div className="card-body text-center">
                                            {point.assignedBy + " assigned story point " + point.storyPoint}
                                            <p>Inputs</p>
                                            {point.metricsData.inputs && point.metricsData.inputs.map((input, i) => (
                                                <div key={i} className="row">
                                                    <span>{input.text} - {input.complexity}</span>
                                                </div>
                                            ))}
                                            <p>Outputs</p>
                                            {point.metricsData.outputs && point.metricsData.outputs.map((outputs, i) => (
                                                <div key={i} className="row">
                                                    <span>{outputs.text} - {outputs.complexity}</span>
                                                </div>
                                            ))}
                                            <p>Files</p>
                                            {point.metricsData.files && point.metricsData.files.map((files, i) => (
                                                <div key={i} className="row">
                                                    <span>{files.text} - {files.complexity}</span>
                                                </div>
                                            ))}
                                            <p>Inquiries</p>
                                            {point.metricsData.inquiries && point.metricsData.inquiries.map((inquiries, i) => (
                                                <div key={i} className="row">
                                                    <span>{inquiries.text} - {inquiries.complexity}</span>
                                                </div>
                                            ))}
                                            <p>External Interfaces</p>
                                            {point.metricsData.externalInterfaces && point.metricsData.externalInterfaces.map((externalInterfaces, i) => (
                                                <div key={i} className="row">
                                                    <span>{externalInterfaces.text} - {externalInterfaces.complexity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                        {method === "User Story" && storyPoints?.length > 0 && storyPoints?.map((point, i) => (
                            point?.product_backlog_id === current?.product_backlog_id && (
                                <div className="col" key={i}>
                                    <div className="card my-2">
                                        <div className="card-body text-center">
                                            {point.assignedBy + " assigned story point " + point.storyPoint}
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </>
            )}
            
            <div className="row my-4">
                <div className="col">
                    {usecasesAgile?.length > 0 ? (
                        usecasesAgile?.map((usecase, index) => (
                            <div className="card my-2" key={index}>
                                <div className="card-body">
                                    <p className="card-text">{usecase?.user} assigned {usecase?.useCasePoints} to usecase and {usecasesAgile.length>0 && Object.keys(usecase.actorWeights).length > 0 && (
                                        <span>
                                            {Object.keys(usecase.actorWeights).map((actor, i) => (
                                                <div key={i} className="row">
                                                    <span> assigned {usecase?.actorWeights[actor]} to {actor}</span>
                                                </div>
                                            ))}
                                            </span>

                                    )}</p>
                                    


                                </div>
                            </div>
                        ))
                    ) : (
                        <p></p>
                    )}
                </div>
            </div>

            {session && (
                <div className="row">
                    <div className="col">
                        <div className="card" style={{ height: '70vh', overflow: "scroll" }}>
                            <div className="card-body">
                                {messages.map(msg => (
                                    <div key={msg._id} className='py-1 px-3 my-1' style={{ backgroundColor: "#e9ecef", width: "fit-content", borderRadius: "10px" }}>
                                        <div className="d-flex justify-content-start align-items-center my-3">
                                            <div className="d-flex justify-content-center align-items-center" style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#e9ecef" }}>
                                                <img src={msg.avatar} alt="" className="pe-2" style={{ borderRadius: "50%" }} width={40} />
                                            </div>
                                            <div className="ms-2 d-flex flex-column">
                                                <div>
                                                    <span className='fw-bold'>
                                                        {msg.user}
                                                    </span>
                                                    <span className="lead ms-3" style={{ fontSize: "13px" }}>
                                                        {msg.createdAt.toString().split(' ')[4].split(':')[0] + ":" + msg.createdAt.toString().split(' ')[4].split(':')[1]}
                                                    </span>
                                                </div>
                                                {msg.text ? (
                                                    <p className="card-text">{msg.text}</p>
                                                ) : (
                                                    <button className="btn btn-sm btn-primary" onClick={() => playHandler(msg.downloadURL)}>
                                                        {playing ? 'Stop' : 'Play'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {session && (
                <div className="row">
                    <div className="input-group mb-3">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            id="button-addon1"
                            onClick={() => recordingHandler(recording ? 'stop' : 'start')}
                        >
                            {recording ? 'Stop Recording' : 'Start Recording'}
                        </button>
                        <input type="text" className="form-control" placeholder="Enter message" aria-label="Recipient's username" aria-describedby="button-addon2" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                        <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}
