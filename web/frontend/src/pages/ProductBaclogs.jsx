import React from 'react'


export default function ProductBaclogs() {
    return (
        <div className='container my-0 px-0 ps-4'>

            <div className="row  mb-0 pb-0">
                <div className="col">
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
                            <tr onClick={() => { console.log("clicked") }}>
                                <td>
                                    <input type="checkbox" className='mx-2' id="btncheck1" />
                                </td>
                                <td colSpan={3}>BREW-1 - Do Assignment</td>
                                <td ><span className="badge text-bg-secondary">In Progress</span></td>
                                {/* <td >3 - Complexity</td> */}
                                <td >Muhammad Wakeed</td>

                            </tr>

                            {/* <tr>
        <td colSpan={3}><input type="checkbox" className='mx-2' id="btncheck1" />BREW-1 - Do Assignment</td>
        <td ><span className="badge text-bg-success">Completed</span></td>
        <td >3 - Complexity</td>
        <td >Muhammad Wakeed</td>

    </tr>
    <tr>
        <td colSpan={3}><input type="checkbox" className='mx-2' id="btncheck1" />BREW-1 - Do Assignment</td>
        <td ><span className="badge text-bg-success">Completed</span></td>
        <td >3 - Complexity</td>
        <td >Muhammad Wakeed</td>

    </tr> */}

                        </tbody>
                    </table>
                    <span className='py-4 px-3'>
                        + Create Issue
                    </span>
                </div>
                <div className="col-md-4 border border-2 vh-100" >
                    <div className="container py-2 px-2">
                        <div className="header my-3 d-flex justify-content-between align-items-start">
                            <div>
                                <h6>
                                    Team in Space/BREW-1
                                </h6>
                                <span>
                                    Do the assignment
                                </span>
                            </div>
                            <div>
                                x
                            </div>
                        </div>
                        <hr />
                        <div className="details mb-4">
                            <div className="row">
                                <h6>
                                    Details
                                </h6>
                            </div>
                            <div className="container">
                                <div className="row mb-1">
                                    <div className="col">
                                        Status
                                    </div>
                                    <div className="col">
                                        Status
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div className="col">
                                        Priority
                                    </div>
                                    <div className="col">
                                        Status
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div className="col">
                                        Component/s
                                    </div>
                                    <div className="col">
                                        Status
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div className="col">
                                        Labels
                                    </div>
                                    <div className="col">
                                        Status
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div className="col">
                                        Version
                                    </div>
                                    <div className="col">
                                        Status
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div className="col">
                                        Epic Link
                                    </div>
                                    <div className="col">
                                        Status
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="peoples mb-4">
                            <div className="row">
                                <h6>
                                    Peoples
                                </h6>
                            </div>
                            <div className="container">
                                <div className="row mb-1">
                                    <div className="col">
                                        Assigned To
                                    </div>
                                    <div className="col">
                                        Status
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div className="col">
                                        Assignee
                                    </div>
                                    <div className="col">
                                        Status
                                    </div>
                                </div>

                            </div>
                        </div>
                        <hr />
                        <div className="dates mb-4">
                            <div className="row">
                                <h6>
                                    Dates
                                </h6>
                            </div>
                            <div className="container">
                                <div className="row mb-1">
                                    <div className="col">
                                        Created At
                                    </div>
                                    <div className="col">
                                        Status
                                    </div>
                                </div>
                                <div className="row mb-1">
                                    <div className="col">
                                        Updated At
                                    </div>
                                    <div className="col">
                                        Status
                                    </div>
                                </div>

                            </div>
                        </div>
                        <hr />
                        <div className="description mb-4">
                            <div className="row">
                                <h6>
                                    Description
                                </h6>
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        Description
                                    </div>
                                    <div className="col">
                                        Status
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
