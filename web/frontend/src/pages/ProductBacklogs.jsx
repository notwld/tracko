import { useEffect, useState } from 'react'
import "../stylesheets/product_backlog.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from "@fortawesome/free-regular-svg-icons"
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { useLocation } from 'react-router-dom'


export default function ProductBaclogs() {
    const location = useLocation();
    const [user, setUser] = useState(localStorage.getItem('user'))
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [projectId, setProjectId] = useState(location.pathname.split('/')[2])
    const [backlog, setBacklog] = useState([])
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const authToken = localStorage.getItem('token');
            setToken(authToken)
            setUser(JSON.parse(user));
            setProjectId(location.pathname.split('/')[2])
            console.log(projectId)
        }
    }, [])
    useEffect(() => {
        fetchBacklogs()
    }, [])
    const fetchBacklogs = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/backlog/${projectId}`, {
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

    const [selectBacklog, setSelectBacklog] = useState([])
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

    const handleDelete = async()=>{
        const response = await fetch('http://localhost:3000/api/backlog/delete',{
            method:"DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            },
            body:JSON.stringify({'backlogs':selectBacklog})
            
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            setBacklog([])
            fetchBacklogs();
        }).catch(err=>console.log(err))
    }

    const handleOnBlur = async (mode) => {
        console.log("handleOnBlur")
        if (mode == "backlog") {
            if (backlogData.title != "None" && backlogData.priority != "None" && backlogData.progress != "None") {
                const projectId = location.pathname.split('/')[2]
                try {
                    console.log(backlogData)
                    const response = await fetch('http://localhost:3000/api/backlog/create', {
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
                    const backlogs= await response.json();
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

    const handleMenuShow = (item) => {
        setShow(true)
        setMenuData({
            title: item.title,
            progress: item.progress,
            assignedTo: item.assignedTo
        })

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
    return (
        <div className='container my-0 px-0 ps-4' >

            <div className="row  mb-0 pb-0">
                <div className="col" >
                    <div className="row mt-4">
                        <div className="container">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
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
                                <div>
                                    {selectBacklog?.length>0&&<button className='btn btn-sm btn-primary me-2' onClick={()=>{handleDelete()}}>
                                        Delete 
                                    </button>}
                                <button className="btn btn-sm btn-primary">
                                    Start Sprint
                                </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="table">
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
                                    {/* <div className="col">
                                       
                                        <select className="form-select" aria-label="Default select example">
                                            <option selected>Select Assignee</option>
                                            <option value="1">Farhan</option>
                                            <option value="2">Bajwa</option>
                                            <option value="3">Ameen</option>
                                        </select>
                                    </div> */}

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
                                    {/* <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Description"
                                            // onBlur={() => { handleOnBlur("backlog") }}
                                            onChange={(e) => setBacklogData({ description: e.target.value })}
                                            aria-label="Issue details"
                                        // autoFocus
                                        /> */}

                                    <textarea
                                        className="form-control"
                                        id="exampleFormControlTextarea1"
                                        rows="3"
                                        cols={129}
                                        placeholder="Enter Description"
                                        onChange={(e) => setBacklogData((prevBacklogData) => ({ ...prevBacklogData, description: e.target.value }))}
                                    ></textarea>
                                </div>
                                <div className="row d-flex justify-content-center align-items-center w-50">

                                    <button className="btn btn-sm btn-primary" onClick={() => { handleOnBlur("backlog") }}>
                                        Create
                                    </button>
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
                                            None
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
                                        <span>
                                            None
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>}
            </div>
        </div>
    )
}
