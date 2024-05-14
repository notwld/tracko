import React, { useEffect, useState } from 'react'
import { auth, database, app } from '../config/firebase';
import { getStorage, ref } from 'firebase/storage';
import { orderBy, query, collection, onSnapshot, addDoc, updateDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import baseUrl from "../config/baseUrl"

export default function PokerPlaning() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [project, setProject] = useState(JSON.parse(localStorage.getItem('project')))
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [session, setSession] = useState(false);
    const [messages, setMessages] = useState([])
    const [formValue, setFormValue] = useState('');
    const [current, setCurrent] = useState('')
    const [storyPoints, setStoryPoints] = useState([])
    const [recording, setRecording] = useState(false);
    const [audio, setAudio] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

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
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        console.log(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL);
                            const createdAt = new Date();
                            const messageData = {
                                _id: new Date().getTime(),
                                createdAt,
                                downloadURL: downloadURL,
                                user: {
                                    _id: user.email || "",
                                    avatar: 'https://i.pravatar.cc/300',

                                },
                                username: user.username
                            };
                            console.log(messageData);
                            addDoc(collection(database, 'chats'), messageData).then(() => {
                                console.log('Message sent');
                            }).catch((error) => {
                                console.log(error);
                            });
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
        console.log(uri)
        const audio = new Audio(uri);
        audio.play();
    };

    const [currentFP, setCurrentFP] = useState(null);
    const [storypointsWithFP, setStorypointsWithFP] = useState([]);

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
            // sort messages by date, most recent will be last
            setMessages(messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()));
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
        const currentRef2 = collection(database, 'currentFP');
        const currentQuery2 = onSnapshot(currentRef2, (querySnapshot) => {
            const currentBacklog = [];
            querySnapshot.forEach((doc) => {
                currentBacklog.push({
                    ...doc.data(),
                });
            });
            console.log(currentBacklog);
            setCurrentFP(currentBacklog[0]); // Assuming there is only one document in the current collection});
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
        const storyPointsRef2 = collection(database, 'storypointsWithFP');
        const storyPointsQuery2 = onSnapshot(storyPointsRef2, (querySnapshot) => {
            const storyPointsData = [];
            querySnapshot.forEach((doc) => {
                storyPointsData.push({
                    ...doc.data(),
                });
            });
            setStorypointsWithFP(storyPointsData);
        });

        return () => {
            q();
            currentQuery();
            storyPointsQuery();
            storyPointsQuery2();
            currentQuery2();
        };
    }, []);
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!formValue) return;


        try {
            const createdAt = new Date();
            console.log(user)
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
            console.log(messageData);
            addDoc(collection(database, 'chats'), messageData).then(() => {
                console.log('Message sent');
            }).catch((error) => {
                console.log(error);
            });

            setFormValue('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleSessionEnd = async () => {
        fetch(baseUrl + `/api/poker-planning/reset`)
        setSession(false);
    }

    const [selectedTeam, setSelectedTeam] = useState([])

    
// const handleMethod = async (method) => {
//     try {
//         const methodsCollectionRef = collection(database, 'methods');
//         const methodsQuerySnapshot = await getDocs(methodsCollectionRef);
//         const existingMethodDoc = methodsQuerySnapshot.docs.find(doc => doc.data().method === method);

//         if (existingMethodDoc) {
//             // If the method already exists, update its timestamp
//             const methodDocRef = doc(database, 'methods', existingMethodDoc.id);
//             await updateDoc(methodDocRef, { method: method, timestamp: new Date() });
//             console.log("Method updated:", method);
//         } else {
//             // If the method doesn't exist, add it to the collection
//             await addDoc(collection(database, 'methods'), { method: method, timestamp: new Date() });
//             console.log("New method added:", method);
//         }
//     } catch (error) {
//         console.error("Error handling method:", error);
//     }
// };
const [method, setMethod] = useState(null);
const handleMethod = async (method) => {
    try {
        setMethod(method);
        console.log("__________________________", method);
        const methodsCollectionRef = collection(database, 'methods');
        const methodsQuerySnapshot = await getDocs(methodsCollectionRef);

        // delete all existing methods
        methodsQuerySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        }   );
        await addDoc(collection(database, 'methods'), { method: method, timestamp: new Date() });
        console.log("New method added:", method);
    } catch (error) {
        console.error("Error handling method:", error);
    }
};
    return (
        <div className='container my-5' style={
            {
                paddingLeft: "180px",
            }
        } >

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
                            {!session ? <button className=" btn btn-sm btn-primary" onClick={() => {
                                handleSessionStart()
                            }}>
                                Start Session
                            </button> :
                                <button className=" btn btn-sm btn-danger" onClick={() => {
                                    handleSessionEnd()
                                }}>
                                    End Session
                                </button>
                            }
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
                {code && session && <div className="col">
                    <p className='lead'>
                        Invite Code: {code.inviteCode}
                    </p>
                </div>}
                <div className="col">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onClick={() => handleMethod('FP Metrices')} />
                        <label className="form-check-label" for="flexRadioDefault1" >
                            FP Metrices
                        </label>
                    </div>

                </div>
                <div className="col">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onClick={() => handleMethod('User Story')} />
                        <label className="form-check-label" for="flexRadioDefault1" >
                            User Story
                        </label>
                    </div>

                </div>
                <div className="col">
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={() => handleMethod('Usecase Points')} />
                        <label className="form-check-label" for="flexRadioDefault2">
                            Usecase Points
                        </label>
                    </div>
                </div>
            </div>

            {session && <><div className="row my-2">
                {method==="User Story"&&current && (
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-content">{current.title}</div>
                            </div>
                        </div>
                    </div>
                )}
                {method==="FP Metrices"&&currentFP && (
                  <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-content">{currentFP.title}</div>
                            </div>
                        </div>
                    </div>
                    

                )}
            </div>
                <div className="row my-2">
                    {
                        method==="FP Metrices"&&storypointsWithFP?.length > 0 && storypointsWithFP.map((point, i) => (
                            point?.product_backlog_id == currentFP?.product_backlog_id && <div className="col" key={i}>
                                <div className="card my-2" >
                                    <div className="card-body text-center">
                                        {point.assignedBy + " assigned story point " + point.storyPoint}
                                     
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    {
                        method==="User Story"&&storyPoints?.length > 0 && storyPoints.map((point, i) => (
                            point?.product_backlog_id == current?.product_backlog_id && <div className="col" key={i}>
                                <div className="card my-2" >
                                    <div className="card-body text-center">
                                        {point.assignedBy + " assigned story point " + point.storyPoint}

                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    {
                        method==="FP Metrices"&&storypointsWithFP?.length > 0 && storypointsWithFP.map((point, i) => (
                            point?.product_backlog_id == currentFP?.product_backlog_id && <div className="col" key={i}>
                                <div className="card my-2" >
                                    <div className="card-body text-center">
                                        {point.assignedBy + " assigned story point " + point.storyPoint}
                                        <p>Inputs</p>
                                        {
                                            point.metricsData.inputs && point.metricsData.inputs.map((input, i) => (
                                                <div key={i}>
                                                    <div className="row">
                                                    <span>{input.text} - {input.complexity}</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                            <p>Outputs</p>
                                        {
                                            point.metricsData.outputs && point.metricsData.outputs.map((outputs, i) => (
                                                <div key={i}>
                                                    <div className="row">

                                                    <span>{outputs.text} - {outputs.complexity}</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                            <p>Files</p>
                                        {
                                            point.metricsData.files && point.metricsData.files.map((files, i) => (
                                                <div key={i}>
                                                    <div className="row">
                                                    <span>{files.text} - {files.complexity}</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                            <p>Inquiries</p>
                                        {
                                            point.metricsData.inquiries && point.metricsData.inquiries.map((inquiries, i) => (
                                                <div key={i}>
                                                    <div className="row">
                                                    <span>{inquiries.text} - {inquiries.complexity}</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                            <p>External Interfaces</p>
                                        {
                                            point.metricsData.externalInterfaces && point.metricsData.externalInterfaces.map((externalInterfaces, i) => (
                                                <div key={i}>
                                                    <div className="row">
                                                    <span>{externalInterfaces.text} - {externalInterfaces.complexity}</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div></>}
            {session && <div className='row'>
                <div className="col">
                    <div className="card" style={{ height: '70vh', overflow: "scroll" }}>
                        <div className="card-body" >
                            {
                                messages.map(msg => (
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
                                                    // <audio controls onPlay={() => playHandler(msg.audio)} >
                                                    //     <source src={msg.audio} type='audio/3gpp' />
                                                    //     <source src={msg.audio} type='audio/3gpp2' />
                                                    //     <source src={msg.audio} type='audio/3gp2' />
                                                    //     Your browser does not support the audio element.
                                                    // </audio>
                                                    <button className="btn btn-sm btn-primary" onClick={() => playHandler(msg.downloadURL)} >
                                                        {playing ? 'Stop' : 'Play'}
                                                    </button>

                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }


                        </div>
                    </div>
                </div>
            </div>}
            {session && <div className="row">
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
