import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import baseUrl from "../config/baseUrl";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isAccepted, setIsAccepted] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/project/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          user_id: user.user_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const projectData = await response.json();
      setProjects(projectData.projects);
    } catch (error) {
      console.error(error);
    }
  }, [token, user]);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/notifications/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          user_id: user.user_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error(error);
    }
  }, [token, user]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const authToken = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');

    if (storedUser && authToken && storedUserType) {
      setUser(JSON.parse(storedUser));
      setToken(authToken);
      setUserType(JSON.parse(storedUserType));
      fetchProjects();
      fetchNotifications();
    } else {
      navigate("/login");
    }
  }, [fetchProjects, fetchNotifications, navigate]);

  const handleInvitationAccept = async (invitation) => {
    try {
      const response = await fetch(`${baseUrl}/api/team/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          project_id: invitation.project_id,
          product_owner_id: invitation.product_owner_id,
          developer_id: invitation.developer_id,
          invitation_id: invitation.invitation_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to accept invitation');
      }

      setIsAccepted(true);
      await fetchNotifications();
      await fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateProject = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/project/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          title: projectTitle,
          description: projectDescription,
          product_owner_id: userType.product_owner_id,
        }),
      });

      if (!response.ok) {
        setFlashMessage('Failed to create project');
        throw new Error('Failed to create project');
      }

      setFlashMessage('Project created successfully');
      setShowModal(false);
      setProjectTitle('');
      setProjectDescription('');
      await fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleNavigateToProject = (project) => {
    localStorage.setItem('project', JSON.stringify(project));
    navigate(`/project/${project.project_id}`, { state: { project } });
  };

  return (
    <>
      {user && (
        <div className="container my-5">
          {flashMessage && (
            <div className="alert alert-success" role="alert">
              {flashMessage}
            </div>
          )}

          {showModal && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Create a new project</h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="projectTitle"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="Enter project title"
                      />
                    </div>
                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        id="projectDescription"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Enter project description"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary" onClick={handleCreateProject}>
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="row mt-3">
            <div className="col">
              <h1 className="display-6">Projects</h1>
            </div>
          </div>
          <div className="row my-3">
            {user.role === "Product Owner" && (
              <div className="col">
                <button className="btn btn-outline-primary" onClick={() => setShowModal(true)}>
                  + Create Project
                </button>
              </div>
            )}
            
          </div>
          <div className="row">
          {projects.length > 0 ? (
              projects.map((project, index) => (
                <div className="col-md-4 mb-3" key={index}>
                  <div className="card h-100" onClick={() => handleNavigateToProject(project)}>
                    <div className="card-body">
                      <h5 className="card-title">{project.title}</h5>
                      <p className="card-text text-muted">{project.description}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col text-center">
                <p className="lead">
                  {user.role === "Product Owner" ? "Create a new project" : "You have not been assigned to any project"}
                </p>
              </div>
            )}
          </div>
          <div className="row mt-4">
            <div className="col">
              <h1 className="display-6">Notifications</h1>
            </div>
           
          </div>
          <div className="row">
          {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div className="col-12 mb-3" key={index}>
                  <div className="card">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <p className="card-text mb-0">{notification.message}</p>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleInvitationAccept(notification.invitation)}
                        disabled={notification.invitation.status === "accepted"}
                      >
                        {notification.invitation.status === "accepted" ? "Accepted" : "Accept"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col text-center">
                <p className="lead">You have no notifications (yet)</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
