import '../stylesheets/nav.css'
export default function Sidebar() {


    return (
        <div className='container sidebar'>
            <div className="d-flex justify-content-start align-items-center my-2 mx-0">
                <div className="container-fluid inner-siderbar">
                    <div className="items">
                        <div className="item mb-3">
                            <span className="btn btn-sm btn-dark py-5 px-5">Project</span>
                        </div>
                        <div className="container item my-4 d-flex flex-column justify-content-center">
                            <div className="mb-4">
                                <span className="btn btn-sm btn-primary btn-font">Product Backlogs</span>
                            </div>
                            <div className="mb-4">
                                <span className="btn btn-sm btn-primary btn-font">Poker Planning</span>
                            </div>
                            <div className="mb-4">
                                <span className="btn btn-sm btn-primary btn-font">Sprints</span>
                            </div>
                            <div className="mb-4">
                                <span className="btn btn-sm btn-primary btn-font">Scrum Board</span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

