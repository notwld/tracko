import React, { useEffect, useState } from 'react';
import baseUrl from '../config/baseUrl';

export default function HR() {
    const [interruptHours, setInterruptHours] = useState({});
    const [salaries, setSalaries] = useState({});
    const [perDaySalaries, setPerDaySalaries] = useState({});
    const projectId = JSON.parse(localStorage.getItem('project')).project_id;

    useEffect(() => {
        const fetchInterrupts = async () => {
            await fetch(baseUrl + '/api/sprint/team/stats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ project_id: projectId }),
            })
                .then(response => response.json())
                .then(data => setInterruptHours(data))
                .catch(error => console.error('Error fetching team stats:', error));
        };
        fetchInterrupts();
    }, [projectId]);

    const handleSalaryChange = (username, value) => {
        setSalaries({ ...salaries, [username]: value });
    };

    const handlePerDaySalaryChange = (username, value) => {
        setPerDaySalaries({ ...perDaySalaries, [username]: value });
    };

    const handleUpdate = () => {
        localStorage.setItem('salaries', JSON.stringify(salaries));
        localStorage.setItem('perDaySalaries', JSON.stringify(perDaySalaries));
        alert('Salaries updated!');
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="row">
                <div className="col d-flex flex-column justify-content-center align-items-center">
                    <h1>Salaries</h1>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Username</th>
                                <th>Salary</th>
                                <th>Per Day Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(interruptHours).map(member => {
                                return (
                                    <tr key={member}>
                                        <td>{member}</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={salaries[member] || ''}
                                                onChange={(e) => handleSalaryChange(member, e.target.value)}
                                                className="form-control"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={perDaySalaries[member] || ''}
                                                onChange={(e) => handlePerDaySalaryChange(member, e.target.value)}
                                                className="form-control"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <button onClick={handleUpdate} className="btn btn-primary">Update</button>
                </div>
            </div>
        </div>
    );
}
