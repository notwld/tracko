
export default function PokerPlaning() {
    return (
        <div className='container my-0 px-0 ps-4' >


            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Modal body text goes here.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
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
                            <button className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Start Session
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            <div className="row ms-1">
                <table className="table">
                    <tbody>
                        <tr>
                            <td>
                                Muhammad Waleed
                            </td>
                            <td>
                                Team Lead
                            </td>
                            <td>
                                Joined
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
