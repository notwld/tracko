import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "../stylesheets/nav.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faCubesStacked, faList, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [project, setProject] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);

   
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
                <div className='sidebar-container'>
                    <div className="sidebar-content">
                        <div className="sidebar-header">
                            <h2 className="sidebar-title">{project.title}</h2>
                        </div>
                        <div className="sidebar-items">
                            {project && [
                                { to: `project/${project.project_id}/backlogs`, icon: faClipboardList, label: 'Backlogs' },
                                { to: `project/${project.project_id}/poker-planning`, icon: faCubesStacked, label: 'Poker Planning' },
                                { to: `project/${project.project_id}/traditional`, icon: faLayerGroup, label: 'Traditional' },
                            ].map((item, index) => (
                                <div className="sidebar-item" key={index}>
                                    <Link to={item.to} className="sidebar-link">
                                        <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
                                        <span className="sidebar-text">{item.label}</span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
