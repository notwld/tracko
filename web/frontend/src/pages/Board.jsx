import React from 'react'
import "../stylesheets/board.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import baseUrl from "../config/baseUrl"

export default function Board() {
    const [user, setUser] = React.useState(null)
    React.useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(JSON.parse(user));
        }
        else {
            window.location.href = `/login`;
        }
    }, []);
    return (
        <>
            {user && (<div className='container my-5' style={{ paddingLeft: "180px",}}>
                <div className="row mt-4">
                    <div className="container">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Scrum Board</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="row">
                    <div className="col">

                        <div className="d-flex justify-content-between align-items-center w-100 mb-3" style={{ width: "100%!important" }}>
                            <div>
                                <h1 className="display-6">
                                    Milestone-1
                                </h1>
                            </div>
                            <div>

                                <div className="btns">
                                    <span className='me-4' style={{ color: "grey", fontSize: "12px" }}>
                                        <FontAwesomeIcon icon={faClock} color='black' className='me-1' />
                                        0 days remaining
                                    </span>
                                    <button className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        Complete Sprint
                                    </button>
                                    <button className="ms-2 btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        Edit
                                    </button>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="row">
                    <div className='common-scroll-container'>
                        <div className="col board-col me-2  mb-3">
                            <div className="container  m-0">
                                <div className="header d-flex justify-content-start align-items-center py-4 px-0 m-0">
                                    <h6 className='header-headings m-0'>
                                        To-do
                                    </h6>
                                </div>
                                <div className="board m-0">
                                    {
                                        Array(10).fill(1).map((number) => (
                                            <div key={number}>
                                                <div className="card py-5 mb-3 my- px-1">
                                                    <h6>
                                                        Here
                                                    </h6>
                                                </div>
                                            </div>

                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col board-col me-2  mb-3">
                            <div className="container  m-0">
                                <div className="header d-flex justify-content-start align-items-center py-4 px-0 m-0">
                                    <h6 className='header-headings m-0'>
                                        In Progress
                                    </h6>
                                </div>
                                <div className="board m-0">
                                    {
                                        Array(10).fill(1).map((number) => (
                                            <div key={number}>
                                                <div className="card  mb-3 py-5 my- px-1">
                                                    <h6>
                                                        Here
                                                    </h6>
                                                </div>
                                            </div>

                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col board-col me-2  mb-3">
                            <div className="container  m-0">
                                <div className="header d-flex justify-content-start align-items-center py-4 px-0 m-0">
                                    <h6 className='header-headings m-0'>
                                        Completed
                                    </h6>
                                </div>
                                <div className="board m-0">
                                    {
                                        Array(10).fill(1).map((number) => (
                                            <div key={number}>
                                                <div className="card  mb-3 py-5 my- px-1">
                                                    <h6>
                                                        Here
                                                    </h6>
                                                </div>
                                            </div>

                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
        </>
    )
}
