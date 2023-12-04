import { Link } from 'react-router-dom';
import '../stylesheets/nav.css'
export default function Sidebar() {


    return (
        <div className='container sidebar'>
            <div className="d-flex justify-content-start align-items-center my-2 mx-0">
                <div className="container-fluid inner-siderbar">
                    <div className="items">
                        <div className="item mb-3">
                            <Link to={"/project"} className="btn btn-sm btn-dark py-5 px-5">Project</Link>
                        </div>
                        <div className="container item my-4 d-flex flex-column justify-content-center">
                            <div className="mb-4">
                                <Link to={"/backlogs"} className="btn btn-sm btn-primary btn-font">Product Backlogs</Link>
                            </div>
                            <div className="mb-4">
                                <Link to={"/poker-planning"} className="btn btn-sm btn-primary btn-font">Poker Planning</Link>
                            </div>
                            <div className="mb-4">
                                <Link to={"/board"} className="btn btn-sm btn-primary btn-font">Scrum Board</Link>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

