import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../stylesheets/nav.css';
import baseUrl from "../config/baseUrl"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faCubesStacked, faList, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
  const location = useLocation();
  const [user, setUser] = useState( null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [project , setProject] = useState(null)


  useEffect(() => {
    setShowSidebar(location.pathname !== '/home');
    
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
      const project = localStorage.getItem('project')
      setProject(JSON.parse(project))
    }
  }, [location]);

  return (
    <>
      {user && showSidebar && (
        <div className='container sidebar'>
          <div className="d-flex justify-content-start align-items-center my-2 mx-0">
            <div className="container-fluid inner-siderbar">
              <div className="items">
                
                <div className="container item my-1 d-flex flex-column justify-content-center align-items-center w-100">
                  <div className="mb-4">
                    <Link to={`project/${project.project_id}/backlogs`}><FontAwesomeIcon icon={faClipboardList} size="2x" style={{
                      backgroundColor: '#dcd9d9',
                      padding: '10px',
                      borderRadius: '17%',
                    }}
                    /></Link>
                  </div>
                  <div className="mb-4">
                    <Link to={`project/${project.project_id}/poker-planning`}><FontAwesomeIcon icon={faCubesStacked} size="2x" style={{
                      backgroundColor: '#dcd9d9',
                      padding: '10px',
                      borderRadius: '17%',
                    }}/></Link>
                  </div>
                  <div className="mb-4">
                    <Link to={`project/${project.project_id}/board`}><FontAwesomeIcon icon={faList} size="2x" style={{
                      backgroundColor: '#dcd9d9',
                      padding: '10px',
                      borderRadius: '17%',
                    }}/></Link>
                  </div>
                  <div className="mb-4">
                    <Link to={`project/${project.project_id}/board`}><FontAwesomeIcon icon={faLayerGroup} size="2x" style={{
                      backgroundColor: '#dcd9d9',
                      padding: '10px',
                      borderRadius: '17%',
                    }}/></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
