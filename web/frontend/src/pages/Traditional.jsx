import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Traditional() {
    const [project, setProject] = useState(JSON.parse(localStorage.getItem('project')) || '');
    return (
        <div className='container' style={{
            paddingLeft: '180px',
            marginTop: '80px'
        }}>
            <h1 className="h-1">
                Techniques
            </h1>
            <div className="row">
                <div className="col-4 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Basic Cocomo</h5>
                            <p className="card-text">Calculate the effort and duration of a project using Basic Cocomo.</p>
                            <Link to={`/project/${project.project_id}/BasicCocomo`} className="btn btn-primary">Go</Link>
                        </div>
                    </div>
                </div>
                <div className="col-4 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Intermediate Cocomo</h5>
                            <p className="card-text">Calculate the effort and duration of a project using Intermediate Cocomo.</p>
                            <Link to={`/project/${project.project_id}/IntermediateCocomo`} className="btn btn-primary">Go</Link>
                        </div>
                    </div>
                </div>
                <div className="col-4 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Cocomo II</h5>
                            <p className="card-text">Calculate the effort and duration of a project using Cocomo II.</p>
                            <Link to={`/project/${project.project_id}/conversion`} className="btn btn-primary">Go</Link>
                        </div>
                    </div>
                </div>
                <div className="col-4 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Use Case Points</h5>
                            <p className="card-text">Calculate the effort and duration of a project using Use Case Points.</p>
                            <Link to={`/project/${project.project_id}/UseCase`} className="btn btn-primary">Go</Link>
                        </div>
                    </div>
                </div>
                <div className="col-4 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Function Points</h5>
                            <p className="card-text">Calculate the effort and duration of a project using Function Points.</p>
                            <Link to={`/project/${project.project_id}/SimpleFP`} className="btn btn-primary">Go</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
