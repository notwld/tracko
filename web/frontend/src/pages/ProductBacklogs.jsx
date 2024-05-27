import { useEffect, useState } from 'react'
import "../stylesheets/product_backlog.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from "@fortawesome/free-regular-svg-icons"
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import baseUrl from "../config/baseUrl"
import { addDoc, collection, doc, updateDoc, onSnapshot, query, where, getDocs, getDoc, deleteDoc } from "firebase/firestore";
import { auth, database, app } from '../config/firebase';
import FPModal from '../components/FPModal'
import UseCaseModal from '../components/UseCaseModal'
import Sprint from '../components/Sprint'

export default function ProductBaclogs() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showSprintModal, setShowSprintModal] = useState(false)
    const [showUseCaseModal, setshowUseCaseModal] = useState(false)
    const [user, setUser] = useState(localStorage.getItem('user'))
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [projectId, setProjectId] = useState(location.pathname.split('/')[2])
    const [backlog, setBacklog] = useState([])
    const [usecases, setUseCases] = useState([])
    const [loading, setLoading] = useState(false);

    

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            // updateBacklogStoryPoints();

            const authToken = localStorage.getItem('token');
            setToken(authToken)
            setUser(JSON.parse(user));
            setProjectId(location.pathname.split('/')[2])
            console.log(projectId)
        }
        else {
            window.location.href = '/login'
        }
    }, [])
    useEffect(() => {
        fetchBacklogs()
        fetchUseCases()
        
    }, [])
    const close = () => {
        setShowSprintModal(false)
    }
    const handleModalClose = () => {
        setshowUseCaseModal(false)
    }
    const fetchBacklogs = async () => {
        try {
            const response = await fetch(baseUrl + `/api/backlog/${projectId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `${token}`,
                },
            })
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const backlogData = await response.json();
            console.log(backlogData);
            setBacklog(backlogData.productBacklogs);

        }
        catch (error) {
            console.log(error)
        }
    }
    const fetchUseCases = async () => {
        try {
            const response = await fetch(baseUrl + `/api/usecase/${projectId}/fetch-all`, {
                method: 'GET',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `${token}`,
                },
            })
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const usecaseData = await response.json();
            console.log(usecaseData);
            setUseCases(usecaseData.usecases);
        }
        catch (error) {
            console.log(error)
        }
    }


    const [show, setShow] = useState(false)
    const [backlogData, setBacklogData] = useState({
        id: 0,
        projectId: 0,
        title: "None",
        description: "None",
        priority: "None",
        assignee: "None",
        reporter: "None",
        progress: "None"
    })

    const [useCaseData, setUseCaseData] = useState({
        id: 0,
        projectId: 0,
        title: "None",
        description: "None",
        preconditions: "None",
        postconditions: "None",
        steps: "None",
        actors: "None"
    })


    const [selectBacklog, setSelectBacklog] = useState([])
    const [selectUseCase, setSelectUseCase] = useState([])
    const [inputEvent, setInputEvent] = useState({
        backlogInput: false,
        backlogDescriptionInput: false,
    })
    const [menuData, setMenuData] = useState({
        id: 0,
        projectId: 0,
        title: "None",
        description: "None",
        priority: "None",
        assignee: "None",
        reporter: "None",
    })

    const [useCaseMenuData, setUseCaseMenuData] = useState({
        id: 0,
        projectId: 0,
        title: "None",
        description: "None",
        preconditions: "None",
        postconditions: "None",
        steps: "None",
        actors: "None"
    })

    const handleDelete = async () => {
        const response = await fetch(baseUrl + '/api/backlog/delete', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
            body: JSON.stringify({ 'backlogs': selectBacklog })

        }).then(res => res.json())
            .then(data => {
                console.log(data)
                setBacklog([])
                fetchBacklogs();
            }).catch(err => console.log(err))
    }

    const handleOnBlur = async (mode) => {
        console.log("handleOnBlur")
        if (mode == "backlog") {
            if (backlogData.title != "None" && backlogData.priority != "None" && backlogData.progress != "None") {
                const projectId = location.pathname.split('/')[2]
                try {
                    console.log(backlogData)
                    const response = await fetch(baseUrl + '/api/backlog/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${token}`,
                        },
                        body: JSON.stringify({
                            'projectId': projectId,
                            'title': backlogData.title,
                            'description': backlogData.description,
                            'priority': backlogData.priority,
                            'progress': backlogData.progress,
                        }),
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error(errorData); // Log the error data
                        return;
                    }
                    const backlogs = await response.json();
                    console.log(backlogs);
                    fetchBacklogs()
                }
                catch (error) {
                    console.log(error)
                }
                // alert(`Backlog Created Successfully with title ${backlogData.title} and priority ${backlogData.priority} and progress ${backlogData.progress} and description ${backlogData.description} `)
            }
            setBacklogData({
                id: 0,
                projectId: 0,
                title: "None",
                description: "None",
                priority: "None",
                assignee: "None",
                reporter: "None",
                progress: "None"

            })
            setInputEvent((prevInputEvent) => ({
                ...prevInputEvent,
                backlogInput: false,
            }));
        }
        else if (mode == "description") {
            setInputEvent((prevInputEvent) => ({
                ...prevInputEvent,
                backlogDescriptionInput: false,
            }));
        } else {
            return
        }

        // setInputEvent((prev) => [{ id: 1, backlogInput: false }]);
        // console.log(inputEvent)
    }
    const [maxStoryPoint, setMaxStoryPoint] = useState(null);
    const [maxFrequency, setMaxFrequency] = useState(0);
    const handleMenuShow = (item) => {
        console.log(item)
        const storyPointsRef = collection(database, 'storypoints');
        const q = query(storyPointsRef, where("product_backlog_id", "==", item.product_backlog_id));
        const querySnapshot = onSnapshot(q, (querySnapshot) => {
            const storyPoints = [];
            querySnapshot.forEach((doc) => {
                storyPoints.push({ ...doc.data(), id: doc.id });
            });
            console.log(storyPoints);
            const storyPointFrequency = {};
            storyPoints.forEach((storyPoint) => {
                if (storyPointFrequency[storyPoint.storyPoint]) {
                    storyPointFrequency[storyPoint.storyPoint] += 1;
                } else {
                    storyPointFrequency[storyPoint.storyPoint] = 1;
                }
            }
            );
            console.log(storyPointFrequency);
            let maxFrequency = 0;
            let maxStoryPoint = null;
            for (const storyPoint in storyPointFrequency) {
                if (storyPointFrequency[storyPoint] > maxFrequency) {
                    maxFrequency = storyPointFrequency[storyPoint];
                    maxStoryPoint = storyPoint;
                }
            }
            console.log(maxStoryPoint);
            setMenuData((prevMenuData) => ({
                title: item.title,
                description: item.description,
                storyPoints: maxStoryPoint
            }))
            // update setBacklog
            setBacklog((prevBacklog) => prevBacklog.map((backlog) => {
                if (backlog.product_backlog_id === item.product_backlog_id) {
                    return {
                        ...backlog,
                        storyPoints: maxStoryPoint
                    }
                }
                return backlog;
            }));
            
        });
        setShow(true)


    }
 
    const [usecaseShow, setUsecaseShow] = useState(false)
    const handleUseCaseMenuShow = (item) => {
        console.log(item)
        setUseCaseMenuData((prevUseCaseMenuData) => ({
            id: item.usecase_id,
            title: item.title,
            description: item.description,
            preconditions: item.pre_condition,
            postconditions: item.post_condition,
            steps: item.steps,
            actors: item.actors
        }))
        setUsecaseShow(true)
    }

    const handlePencilIconClick = () => {
        setInputEvent((prevInputEvent) => ({
            ...prevInputEvent,
            backlogDescriptionInput: true
        }));
    };
    const handleSelection = (item) => {
        if (Array(selectBacklog).includes(item) == false) {
            setSelectBacklog([...selectBacklog, item])
        }
        else {
            setSelectBacklog(...selectBacklog, Array(selectBacklog).filter((each) => each != item))
        }
    }
    const handleUseCaseSelection = (item) => {
        if (Array(selectUseCase).includes(item) == false) {
            setSelectUseCase([...selectUseCase, item])
        }
        else {
            setSelectUseCase(...selectUseCase, Array(selectUseCase).filter((each) => each != item))
        }
    }

    const handleDeleteUseCase = async () => {
        const response = await fetch(baseUrl + '/api/usecase/delete', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
            body: JSON.stringify({ 'usecases': selectUseCase })

        }).then(res => res.json())
            .then(data => {
                console.log(data)
                setUseCases([])
                fetchUseCases();
            }).catch(err => alert(err))
    }
    const [editMode, setEditMode] = useState({
        what: "",
        status: false
    })
    const handleUseCaseUpdate = async () => {
        await fetch(baseUrl + '/api/usecase/update', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
            body: JSON.stringify({
                'id': useCaseMenuData.id,
                'name': useCaseMenuData.title,
                'description': useCaseMenuData.description,
                'preconditions': useCaseMenuData.preconditions,
                'postconditions': useCaseMenuData.postconditions,
                'steps': useCaseMenuData.steps,
                'actors': useCaseMenuData.actors.split(',').map(actor => ({ name: actor }))
            })

        }).then(res => res.json())
            .then(data => {
                console.log(data)
                setUseCases([])
                fetchUseCases();
            }).catch(err => alert(err))
    }

    return (
        <div className='container my-5' style={{
            paddingLeft: '180px',
        }} >
            <UseCaseModal show={showUseCaseModal} handleModalClose={handleModalClose} projId={projectId} fetchUsecases={fetchUseCases} />
            {showSprintModal && <Sprint initialBacklogs={backlog} onClose={close} />}
            <div className="row  mb-0 pb-0">
                <div className="col" >
                    <div className="row mt-4">
                        <div className="container">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to={'/home'}>Home</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Product Backlogs</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">

                            <div className="d-flex justify-content-between align-items-center w-100 mb-3" style={{ width: "100%!important" }}>
                                <div>
                                    <h1 className="display-5">
                                        Backlogs
                                    </h1>
                                    <div className="row mt-3">
                                        <form className="d-flex" role="search">
                                            <input className="form-control me-2" type="search" placeholder="Search &#128270;" aria-label="Search" />
                                        </form>

                                    </div>
                                </div>
                                <div className='d-flex justify-content-center align-items-center ' style={{ width: 'fit-content' }}>
                                    <div className="col">
                                        {(selectBacklog?.length > 0) && <button className='btn btn-sm btn-primary me-2' onClick={() => { handleDelete() }}>
                                            Delete
                                        </button>}
                                    </div>


                                    {backlog?.length > 0 && user.role === "Product Owner" && <button className="btn btn-sm btn-primary" onClick={() => { navigate(`/project/${projectId}/poker-planning`) }}>
                                        Initiate Poker Planning
                                    </button>}

                                    <button className="btn mx-2 btn-sm btn-primary"  data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setShowSprintModal(true) }}>
                                        Start Sprint
                                    </button>


                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="table" style={{marginLeft:"0px"}}>
                        {backlog?.length > 0 &&
                            <thead>
                                <tr>
                                    <th scope="col">Backlog</th>
                                    <th scope="col">Priority</th>
                                    <th scope="col">Progress</th>
                                    <th scope="col">Assignee</th>
                                </tr>
                            </thead>
                        }
                        <tbody>
                            {backlog?.length > 0 ? (
                                backlog.map((item, index) => (
                                    <tr key={index}>
                                        <td id='backlogTitle'>
                                            <input type="checkbox" className="mx-2" id={`btncheck${index}`} onChange={() => { handleSelection(item) }} />
                                            <FontAwesomeIcon icon={faClipboard} className='mx-2' style={{ color: "#1ec840", }} />
                                            <span onClick={() => handleMenuShow(item)} style={{ textAlign: 'left' }}>{item.title}</span>
                                        </td>
                                        <td>
                                            <span className="badge text-bg-secondary">{item.priority ? item.priority : 0}</span>
                                        </td>
                                        <td>
                                            <span className="badge text-bg-secondary">{item.progress ? item.progress : "To-Do"}</span>
                                        </td>
                                        <td >{item.reporter ? item.reporter : "Not Assigned Yet"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        <span>No Backlogs added yet</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>


                    </table>
                    {
                        inputEvent.backlogInput ? (
                            <div className="row d-flex justify-content-center input-group my-3 mb-5">
                                <div className="col">
                                    <h1 className="display-6 text-center my-3">
                                        Create Backlog
                                    </h1>
                                </div>
                                <div className="row my-3">
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter backlog title"
                                            // onBlur={() => { handleOnBlur("backlog") }}
                                            onChange={(e) => {
                                                setBacklogData((prevBacklogData) => ({
                                                    ...prevBacklogData,
                                                    title: e.target.value
                                                }))
                                            }
                                            }
                                            aria-label="Issue details"
                                            autoFocus
                                        />
                                    </div>
                                   

                                </div>
                                <div className="row">
                                    <div className="col">
                                        <select className="form-select" aria-label="Default select example" onChange={(e) => setBacklogData((prevBacklogData) => ({ ...prevBacklogData, priority: e.target.value }))}  >
                                            <option selected>Select Priority</option>
                                            <option value="high">High</option>
                                            <option value="medium">Medium</option>
                                            <option value="low">Low</option>
                                        </select>
                                    </div>
                                    <div className="col">
                                        <select className="form-select" aria-label="Default select example" onSelect={
                                            (e) => {
                                                console.log(e.target.value)
                                                setBacklogData((prevBacklogData) => ({ ...prevBacklogData, progress: e.target.value }))
                                            }
                                        }
                                            onChange={(e) => setBacklogData((prevBacklogData) => ({ ...prevBacklogData, progress: e.target.value }))} >
                                            <option value="to_do" selected>Select Status</option>
                                            <option value="to_do" >To-Do</option>
                                            <option value="in_progress">In-Progress</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </div>

                                </div>
                                <div className="row my-3" style={{ width: "fit-content" }}>
                                    

                                    <textarea
                                        className="form-control"
                                        id="exampleFormControlTextarea1"
                                        rows="3"
                                        cols={129}
                                        placeholder="Enter Description"
                                        onChange={(e) => setBacklogData((prevBacklogData) => ({ ...prevBacklogData, description: e.target.value }))}
                                    ></textarea>
                                </div>
                                <div className="row d-flex justify-content-center align-items-center" style={{ width: "fit-content" }}>

                                    <div className="col">
                                        <button className="btn btn-sm btn-primary" onClick={() => { handleOnBlur("backlog") }}>
                                            Create
                                        </button>
                                    </div>
                                    <div className="col">
                                        <button className="btn btn-sm btn-danger" onClick={() => { handleOnBlur("backlog") }}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : <span className='py-4 px-3' id='create_issue' onClick={() => {
                            setInputEvent((prevInputEvent) => ({
                                ...prevInputEvent,
                                backlogInput: true
                            }));
                        }}>
                            + Create Backlog
                        </span>}

                </div>
                {show && <div className="col-md-4 border border-2 vh-100" id='info'>
                    <div className="container py-2 px-2">
                        <div className="header my-3 d-flex justify-content-between align-items-start">
                            <div>
                                <h6>
                                    {menuData.title}
                                </h6>
                                {inputEvent.backlogDescriptionInput ? (
                                    <div className="description my-4 border p-3">
                                        <div className="row">
                                            <h6 className='mb-3'>
                                                Description
                                            </h6>
                                            <hr />
                                        </div>
                                        <div className="container">
                                            <div className="row">
                                                <div className="col">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Description"
                                                        onBlur={() => { handleOnBlur("description") }}
                                                        onChange={(e) => setMenuData({ ...menuData, description: e.target.value })}
                                                        aria-label="backlog description"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <span>
                                            {menuData.description}
                                            <FontAwesomeIcon
                                                icon={faPencil}
                                                className="ms-2"
                                                style={{ color: "#000000", cursor: "pointer" }}
                                                onClick={handlePencilIconClick} // Use a function here
                                            />
                                        </span>
                                        <span className="ms-3 badge text-bg-secondary">{menuData.progress}</span>
                                    </div>
                                )}

                            </div>
                            <div onClick={() => { setShow(false) }} id='close'>
                                x
                            </div>
                        </div>

                        <div className="details mb-4 border p-3">
                            <div className="row">
                                <h6 className='mb-3'>
                                    Details
                                </h6>
                                <hr />
                            </div>
                            <div className="container w-100">
                                <div className="row mb-3">
                                    <div className="col">
                                        <span>
                                            Sprint
                                        </span>
                                    </div>
                                    <div className="col">
                                        <span>
                                            None
                                        </span>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <span>
                                            Story Point Estimate
                                        </span>
                                    </div>
                                    <div className="col">
                                        <span>
                                            {menuData.storyPoints ? menuData.storyPoints : "-"}
                                        </span>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <span>
                                            Created At
                                        </span>
                                    </div>
                                    <div className="col">
                                        <span>
                                            None
                                        </span>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <span>
                                            Updated At
                                        </span>
                                    </div>
                                    <div className="col">
                                        <span>
                                            None
                                        </span>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <span>
                                            Reporter
                                        </span>
                                    </div>
                                    <div className="col">
                                        <span>
                                            {menuData.assignedTo ? menuData.assignedTo : "-"}

                                        </span>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <span>
                                            Assignee
                                        </span>
                                    </div>
                                    <div className="col">

                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>}

            </div>
            <div className="row my-5">
                <div className="col">
                    <div className="row">
                        <div className="col">
                            <div className="d-flex justify-content-between align-items-center w-100 mb-3" style={{ width: "100%!important" }}>
                                <div>
                                    <h1 className="display-5">
                                        Use Cases
                                    </h1>
                                    <div className="row mt-3">
                                        <form className="d-flex" role="search">
                                            <input className="form-control me-2" type="search" placeholder="Search &#128270;" aria-label="Search" />
                                        </form>

                                    </div>
                                </div>


                                <div className='d-flex justify-content-center align-items-center ' style={{ width: 'fit-content' }}>
                                    {usecases?.length > 0 && user.role === "Product Owner" && <div className='d-flex justify-content-center align-items-center ' style={{ width: 'fit-content' }}>
                                        <div className="col">
                                            {(selectUseCase?.length > 0) && <button className='btn btn-sm btn-primary me-2' onClick={() => { handleDeleteUseCase() }}>
                                                Delete
                                            </button>}
                                        </div>
                                    </div>}
                                    {usecases?.length > 0 && user.role === "Product Owner" && <button className="btn mx-2 btn-sm btn-primary" onClick={() => { navigate(`/project/${projectId}/poker-planning`) }}>
                                        Initiate Poker Planning
                                    </button>}

                                    <button className="btn mx-2 btn-sm btn-primary" onClick={() => { setshowUseCaseModal(true) }}>
                                        Add Use Case
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="table" style={{marginLeft:"0px"}}>
                        {usecases?.length > 0 &&
                            <thead>
                                <tr>
                                    <th scope="col">Use Case</th>
                                    <th scope="col">Description</th>

                                </tr>
                            </thead>
                        }
                        <tbody>
                            {usecases?.length > 0 ? (
                                usecases.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input type="checkbox" className="mx-2" id={`btncheck${index}`} onChange={() => { handleUseCaseSelection(item) }} />

                                            <FontAwesomeIcon icon={faClipboard} className='mx-2' />
                                            <span onClick={() => handleUseCaseMenuShow(item)} style={{ textAlign: 'left', cursor: 'pointer' }}>{item.title}</span>
                                        </td>
                                        <td>{item.description}</td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        <span>No Use Cases added yet</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {usecaseShow && <div className="col-md-4 border border-2 vh-100" id='info'>
                    <div className="container py-2 px-2">
                        <div className="header my-3 d-flex justify-content-between align-items-start">
                            <div>
                                <h6>
                                    {useCaseMenuData.title}
                                </h6>
                                <div className="description my-4 border p-3">
                                    <div className="row">
                                        <h6 className='mb-3'>
                                            Description
                                        </h6>
                                        <hr />
                                    </div>
                                    <div className="container">
                                        <div className="row">
                                            <div className="col">
                                                {editMode.what === "description" ? (
                                                    <input type="text" className="form-control" placeholder="Enter Description" onChange={(e) => setUseCaseMenuData({ ...useCaseMenuData, description: e.target.value })} onBlur={() => { setEditMode({ what: "description", status: false }) }} autoFocus />
                                                ) : (
                                                    <div>
                                                        <span>
                                                            {useCaseMenuData.description}
                                                        </span>
                                                        <FontAwesomeIcon icon={faPencil} className='ms-2' style={{ color: "#000000", cursor: "pointer" }}
                                                            onClick={() => { setEditMode({ what: "description", status: true }) }} />
                                                    </div>
                                                )

                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div onClick={() => { setUsecaseShow(false) }} id='close'>
                                x
                            </div>
                        </div>

                        <div className="details mb-4 border p-3">
                            <div className="row">
                                <h6 className='mb-3'>
                                    Details
                                </h6>
                                <hr />
                            </div>
                            <div className="container w-100">
                                <div className="row mb-3">
                                    <div className="col">
                                        <span>
                                            Preconditions
                                        </span>
                                    </div>
                                    <div className="col">
                                        {editMode.what === "preconditions" ? (
                                            <input type="text" className="form-control" placeholder="Enter Preconditions" onChange={(e) => setUseCaseMenuData({ ...useCaseMenuData, preconditions: e.target.value })} onBlur={() => { setEditMode({ what: "preconditions", status: false }) }} autoFocus />
                                        ) : (
                                            <div>
                                                <span>
                                                    {useCaseMenuData.preconditions}
                                                </span>
                                                <FontAwesomeIcon icon={faPencil} className='ms-2' style={{ color: "#000000", cursor: "pointer" }} onClick={() => { setEditMode({ what: "preconditions", status: true }) }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <span>
                                            Postconditions
                                        </span>
                                    </div>
                                    <div className="col">
                                        {editMode.what === "postconditions" ? (
                                            <input type="text" className="form-control" placeholder="Enter Postconditions" onChange={(e) => setUseCaseMenuData({ ...useCaseMenuData, postconditions: e.target.value })} onBlur={() => { setEditMode({ what: "postconditions", status: false }) }} autoFocus />
                                        ) : (
                                            <div>
                                                <span>
                                                    {useCaseMenuData.postconditions}
                                                </span>
                                                <FontAwesomeIcon icon={faPencil} className='ms-2' style={{ color: "#000000", cursor: "pointer" }} onClick={() => { setEditMode({ what: "postconditions", status: true }) }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <span>
                                            Steps
                                        </span>
                                    </div>
                                    <div className="col">
                                        {
                                            editMode.what === "steps" ? (
                                                <input type="text" className="form-control" placeholder="Enter Steps" onChange={(e) => setUseCaseMenuData({ ...useCaseMenuData, steps: e.target.value })} onBlur={() => { setEditMode({ what: "steps", status: false }) ;handleUseCaseUpdate()}} autoFocus />
                                            ) : (
                                                <div>
                                                    <span>
                                                        {useCaseMenuData.steps}
                                                    </span>
                                                    <FontAwesomeIcon icon={faPencil} className='ms-2' style={{ color: "#000000", cursor: "pointer" }} onClick={() => { setEditMode({ what: "steps", status: true });handleUseCaseUpdate() }} />
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <span>
                                            Actors
                                        </span>
                                    </div>
                                    <div className="col d-flex">
                                        {/* */}
                                        {
                                            editMode.what === "actors" ? (
                                                <input type="text" className="form-control" placeholder="Enter Actors" onChange={(e) => setUseCaseMenuData({ ...useCaseMenuData, actors: e.target.value })} onBlur={() => { setEditMode({ what: "actors", status: false }) }} autoFocus />
                                            ) : (
                                                <div>
                                                    <span>
                                                        {useCaseMenuData.actors.map((actor, index) => (
                                                            <div key={index}>
                                                                <span key={index} className="badge bg-secondary me-2">{actor.name}</span>
                                                            </div>
                                                        ))}
                                                        <FontAwesomeIcon icon={faPencil} className='mx-2' style={{ color: "#1ec840", cursor: "pointer" }} />

                                                    </span>
                                                    <FontAwesomeIcon icon={faPencil} className='ms-2' style={{ color: "#000000", cursor: "pointer" }} onClick={() => { setEditMode({ what: "actors", status: true }) }} />
                                                </div>
                                            )

                                        }
                                    </div>
                                </div>
                                {
                                    editMode.status && <div className="row d-flex justify-content-center align-items-center" style={{ width: "fit-content" }}>
                                        <div className="col">
                                            <button className="btn btn-sm btn-primary" onClick={() => {handleUseCaseUpdate();
                                                editMode.what === "description" ? setEditMode({ what: "description", status: false }) :
                                                    editMode.what === "preconditions" ? setEditMode({ what: "preconditions", status: false }) :
                                                        editMode.what === "postconditions" ? setEditMode({ what: "postconditions", status: false }) :
                                                            editMode.what === "steps" ? setEditMode({ what: "steps", status: false }) :
                                                                editMode.what === "actors" ? setEditMode({ what: "actors", status: false }) : null
                                            }}>
                                                Update
                                            </button>
                                        </div>
                                        <div className="col">
                                            <button className="btn btn-sm btn-danger" onClick={() => {
                                                editMode.what === "description" ? setEditMode({ what: "description", status: false }) :
                                                    editMode.what === "preconditions" ? setEditMode({ what: "preconditions", status: false }) :
                                                        editMode.what === "postconditions" ? setEditMode({ what: "postconditions", status: false }) :
                                                            editMode.what === "steps" ? setEditMode({ what: "steps", status: false }) :
                                                                editMode.what === "actors" ? setEditMode({ what: "actors", status: false }) : null
                                            }}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                }
            </div>

        </div>
    )
}
