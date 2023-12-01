import React from 'react'
import { useState } from 'react'
import "../stylesheets/product_backlog.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from "@fortawesome/free-regular-svg-icons"
const fakeData = [{
    title: "To the space",
    progress: "In Progress",
    assignedTo: "Muhammad Waleed"
}]

export default function ProductBaclogs() {


    const [show, setShow] = useState(false)
    const [showInputBox, setShowInputBox] = useState(false)
    const [backlogData, setBacklogData] = useState({
        title: "None",
        progress: "None",
        assignedTo: "None"
    })

    const [selectBacklog,setSelectBacklog] = useState([])
    const [menuData, setMenuData] = useState({
        title: "None",
        progress: "None",
        assignedTo: "None"
    })

    const handleOnBlur = () => {
        if (backlogData.title != "") {
            fakeData.push({ ...backlogData })
        }
        console.table(fakeData)
        setBacklogData({
            title: "None",
            progress: "None",
            assignedTo: "None"
        })
        setShowInputBox(false)

    }

    const handleMenuShow = (item)=>{
        setShow(!show)


    }

    const handleSelection = (item) => {
        if(item.title)
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
                                    <form className="d-flex mt-3" role="search">
                                        <input className="form-control me-2" type="search" placeholder="Search &#128270;" aria-label="Search" />
                                    </form>
                                </div>
                                <button className="btn btn-sm btn-primary">
                                    Create Sprint
                                </button>
                            </div>
                        </div>
                    </div>
                    <table className="table">

                        <tbody>
                            {fakeData.length > 0 ? (
                                fakeData.map((item, index) => (
                                    <tr key={index}>
                                        <td  id='backlogTitle'>
                                            <input type="checkbox" className="mx-2" id={`btncheck${index}`} onChange={()=>{handleSelection(item)}} />
                                            <FontAwesomeIcon icon={faClipboard} className='mx-2' style={{color: "#1ec840",}} />
                                            <span  onClick={() => handleMenuShow(item)} style={{textAlign:'left'}}>{item.title}</span>
                                        </td>
                                        
                                        <td>
                                            <span className="badge text-bg-secondary">{item.progress ? item.progress : "To-Do"}</span>
                                        </td>
                                        <td >{item.assignedTo ? item.assignedTo : "None"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>
                                        <span>No Backlogs</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>


                    </table>
                    {
                        showInputBox ? (
                            <div className="dflex justify-content-center input-group mt-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Create a Backlog"
                                    onBlur={handleOnBlur}
                                    onChange={(e) => setBacklogData({ title: e.target.value })}
                                    aria-label="Issue details"
                                />

                            </div>
                        ) : <span className='py-4 px-3' id='create_issue' onClick={() => { setShowInputBox(!false) }}>
                            + Create Issue
                        </span>}

                </div>
                {show && <div className="col-md-4 border border-2 vh-100" id='info'>
                    <div className="container py-2 px-2">
                        <div className="header my-3 d-flex justify-content-between align-items-start">
                            <div>
                                <h6>
                                    Team in Space/BREW-1
                                </h6>
                                <div>
                                    <span>
                                        Do the assignment
                                    </span>
                                    <span className="ms-3 badge text-bg-secondary">In Progress</span>
                                </div>

                            </div>
                            <div onClick={() => { setShow(false) }} id='close'>
                                x
                            </div>
                        </div>
                        <div className="description mb-4 border p-3">
                            <div className="row">
                                <h6 className='mb-3'>
                                    Description
                                </h6>
                                <hr />
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        Description
                                    </div>

                                </div>


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
                                            None
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
