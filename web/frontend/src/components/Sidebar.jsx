import { useState } from 'react';

export default function Sidebar () {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className='container-fluid' style={{backgroundColor:"grey"}}>
        <div className="d-flex justify-content-start align-items-center my-2 mx-0">
            <div className="container-fluid">
                <div className="items">
                    <div className="item mb-3">
                        <span className="btn btn-sm btn-dark">Tracko</span>
                    </div>
                    <div className="item mb-3">
                        <span className="btn btn-sm btn-dark">Tracko</span>
                    </div>
                    <div className="item mb-3">
                        <span className="btn btn-sm btn-dark">Tracko</span>
                    </div>
                    <div className="item mb-3">
                        <span className="btn btn-sm btn-dark">Tracko</span>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
}

