import React, { useState,useEffect } from 'react'
import baseUrl from "../config/baseUrl"

function UseCaseModal({ show, handleModalClose,projId,fetchUsecases }) {
    const[token, setToken] = useState(localStorage.getItem('token'));
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const authToken = localStorage.getItem('token');
            setToken(authToken);
        }
    }, []);
    const [usecase, setUseCase] = useState({
        name: '',
        description: '',
        preconditions: '',
        postconditions: '',
        actors: '',
        steps: '',
        
    });

    const handleChange = (key, value) => {
        setUseCase((prev) => ({
            ...prev,
            [key]: value
        }));
    }

    const handleSubmit =async (e) => {
        e.preventDefault();
        console.log(usecase);
        console.log(usecase.actors.split(',').map(actor => ({name: actor})), "actors");
        try{
            const response = await fetch(`${baseUrl}/api/usecase/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify({
                    "title": usecase.name,
                    "description": usecase.description,
                    "preconditions": usecase.preconditions,
                    "postconditions": usecase.postconditions,
                    "actors": usecase.actors.split(',').map(actor => ({name: actor})),
                    "steps": usecase.steps,
                    "projectId": projId

                })
            });
            const data = await response.json();
            fetchUsecases();
            console.log(data);
            
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <div className={`modal ${show ? 'd-block' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Use Case</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleModalClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="useCaseName" className="form-label">Name</label>
                                <input type="text" className="form-control" id="useCaseName" onChange={(e) => handleChange("name", e.target.value)} value={usecase.name} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="actors" className="form-label">Actors</label>
                                <input type="text" className="form-control" id="actors" onChange={(e) => handleChange("actors", e.target.value)} value={usecase.actors} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="useCaseDescription" className="form-label">Description</label>
                                <textarea className="form-control" id="useCaseDescription" rows="3" onChange={(e) => handleChange("description", e.target.value)} value={usecase.description}></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="useCasePreconditions" className="form-label">Preconditions</label>
                                <textarea className="form-control" id="useCasePreconditions" rows="3" onChange={(e) => handleChange("preconditions", e.target.value)} value={usecase.preconditions}></textarea> 
                            </div>
                            <div className="mb-3">
                                <label htmlFor="useCasePostconditions" className="form-label">Postconditions</label>
                                <textarea className="form-control" id="useCasePostconditions" rows="3" onChange={(e) => handleChange("postconditions", e.target.value)} value={usecase.postconditions}></textarea> 
                            </div>
                            <div className="mb-3">
                                <label htmlFor="useCaseSteps" className="form-label">Steps</label>
                                <textarea className="form-control" id="useCaseSteps" rows="3" onChange={(e) => handleChange("steps", e.target.value)} value={usecase.steps}></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleModalClose}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={(e) => {
                            handleSubmit(e);
                            handleModalClose(e);

                        }}
                        >Save changes</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default UseCaseModal
