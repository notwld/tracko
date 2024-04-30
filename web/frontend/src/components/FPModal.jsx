import React, { useState } from 'react';

export default function FPModal({ backlogs }) {
    const [fps, setFps] = useState(backlogs.map(backlog => ({ ...backlog, input: '', output: '', files: '', inquiries: '', externalInterfaces: '' })));
    const [currentBacklogIndex, setCurrentBacklogIndex] = useState(0);

    const handleChange = (field, value) => {
        setFps(prevFps => {
            const updatedFps = [...prevFps];
            updatedFps[currentBacklogIndex][field] = value;
            return updatedFps;
        });
    };

    const nextBacklog = () => {
        if (currentBacklogIndex < fps.length - 1) {
            setCurrentBacklogIndex(prevIndex => prevIndex + 1);
        }
    };

    const saveChanges = () => {
        // Implement your logic to save changes
        console.log(fps);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <button type="button" className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                FP
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">FP Calculations</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <h6>{fps[currentBacklogIndex].title}</h6>
                                <div className="mb-3">
                                    <label className="form-label">Input</label>
                                    <input type="text" className="form-control" value={fps[currentBacklogIndex].input} onChange={e => handleChange('input', e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Output</label>
                                    <input type="text" className="form-control" value={fps[currentBacklogIndex].output} onChange={e => handleChange('output', e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Files</label>
                                    <input type="text" className="form-control" value={fps[currentBacklogIndex].files} onChange={e => handleChange('files', e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Inquiries</label>
                                    <input type="text" className="form-control" value={fps[currentBacklogIndex].inquiries} onChange={e => handleChange('inquiries', e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">External Interfaces</label>
                                    <input type="text" className="form-control" value={fps[currentBacklogIndex].externalInterfaces} onChange={e => handleChange('externalInterfaces', e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {currentBacklogIndex < fps.length - 1 ? (
                                <button type="button" className="btn btn-primary" onClick={nextBacklog}>Next</button>
                            ) : (
                                <button type="button" className="btn btn-primary" onClick={saveChanges}>Save changes</button>
                            )}
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
