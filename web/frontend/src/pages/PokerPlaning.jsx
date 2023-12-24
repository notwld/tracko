import React, { useState } from 'react'

export default function PokerPlaning() {
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
                            <button className="btn btn-sm btn-primary" onClick={()=>{
                                alert('Session Started')
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
                        <option value="2">T-Shirt</option>
                        <option value="3">T-Shirt</option>
                    </select>
                </div>
                <div className="col">
                    <select className="form-select" aria-label="Default select example">
                        <option selected>Select Sizing Technique</option>
                        <option value="1">Fibonacci</option>
                        
                    </select>
                </div>

            </div>
            <div className="row mt-4 ms-1">
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
            </div>
        </div>
    )
}
