import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);
  const [token, setToken] = useState(null)
  const navigation = useNavigate();
  const [notfications, setNotfications] = useState([])
  const [isAccepted, setIsAccepted] = useState(false)

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/project/list', {
        method: 'POST',
        headers: {
          'Content-Type': "application/json",
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          "user_id": user.user_id,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const projectData = await response.json();
      console.log(projectData);
      setProjects(projectData.projects);
    } catch (error) {
      console.error(error);
    }
  }, [token]);
  const fetchNotifications = async () => {
    fetch('http://localhost:3000/api/notifications/list', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        'Authorization': `${token}`,
      },
      body: JSON.stringify({
        'user_id': user.user_id,
      }),
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        setNotfications(data.notifications)
      })
      .catch(err => {
        console.log(err)
      })
  }
  useEffect(() => {
    localStorage.removeItem('project');
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
      const authToken = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      setToken(authToken);
      setUserType(JSON.parse(userType));
      fetchProjects();
      fetchNotifications();

    }
  }, [fetchProjects]);

  const handleInvitationAccept = async (invitation) => {
    console.log(invitation[0])
    try {
      const response = await fetch('http://localhost:3000/api/team/add', {
        method: 'POST',
        headers: {
          'Content-Type': "application/json",
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          'project_id': invitation[0].project_id, 
          'product_owner_id': invitation[0].product_owner_id, 
          'developer_id': invitation[0].developer_id, 
          'invitation_id': invitation[0].invitation_id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to accept invitation');
      }
      setIsAccepted(true)
      const projectData = await response.json();
      console.log(projectData);
      fetchNotifications();
      fetchProjects();
      setProjects(projectData.projects);
    } catch (error) {
      console.error(error);
    }
  }

  const handleCreateProject = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/project/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          "title": projectTitle,
          "description": projectDescription,
          "product_owner_id": userType.product_owner_id,
        }),
      });

      if (!response.ok) {
        setShowModal(false);
        setFlashMessage('Failed to create project');
        // setProjectTitle('');
        // setProjectDescription('');
        console.log(response);

        throw new Error('Failed to create project');
      }

      // Continue with successful response handling
      console.log('Project created successfully');
      setShowModal(false);
      setFlashMessage('Project created successfully');
      setProjectTitle('');
      setProjectDescription('');
      fetchProjects();
    } catch (error) {
      console.error(error);
      console.log('An error occurred while creating the project');
    }
  };


  const handleNavigateToProject = (project) => {
    localStorage.setItem('project', JSON.stringify(project));
    navigation(`/project/${project.project_id}`, { state: { project } });
  };

  return (
    <>
      {user && (
        <div className="container my-0 px-0 ps-4">
          {flashMessage && (
            <div className="alert alert-success" role="alert">
              {flashMessage}
            </div>
          )}

          {showModal && (
            <div className="modal pt-5" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Create a new project</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body d-flex justify-content-center align-items-center">
                    <div className="row">
                      <div className="col">
                        <div className="row mb-3">
                          <div className="col">
                            <input
                              type="text"
                              className="form-control"
                              id="projectTitle"
                              value={projectTitle}
                              onChange={(e) => setProjectTitle(e.target.value)}
                              placeholder="Enter project title"
                              formNoValidate={false}
                            />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col">
                            <textarea
                              className="form-control"
                              id="projectDescription"
                              value={projectDescription}
                              onChange={(e) => setProjectDescription(e.target.value)}
                              placeholder="Enter project description"
                            />
                          </div>
                        </div>
                      </div>
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
          <>
            <div className="row my-3 m-0 " style={{width:"fit-content"}}>
              {user.role === "Product Owner" && <div className="col">
                <div className="d-flex justify-content-between align-items-center w-100 mb-3" style={{ width: '100%!important' }}>
                  <div>
                    <button
                      className="btn py-5 px-4"
                      style={{
                        border: '1.5px solid grey',
                        fontSize: '0.96rem',
                        cursor: 'pointer',
                      }}
                      onClick={() => setShowModal(true)}
                    >
                      + Create Project
                    </button>
                  </div>
                </div>
              </div>}
              {projects?.length > 0 ? projects.map((item, index) => (
                <div className="col" key={index}>
                  <div className="col d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div
                        className="py-5 px-5"
                        style={{
                          border: '1.5px solid grey',
                          borderRadius: '5px',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleNavigateToProject(item)}
                      >
                        <span>{item.title}</span>
                        <br />
                        <span className="text-muted">{item.description}</span>
                        {/* <br /> */}
                      </div>
                    </div>
                  </div>
                </div>
              )) : <div className="col text-center">
                <div className="d-flex justify-content-center align-items-center w-100 mb-3" style={{ width: '100%!important', textAlign: "center" }}>

                  <h1 className="lead text-center" style={{ textAlign: "center" }}>{
                    user.role === "Product Owner" ? "Create a new project" : "You have not been assigned to any project"
                  }
                  </h1>
                </div>
              </div>
              }
            </div>
          </>
          <div className="row">
            <div className="col my-3">
              <h1 className="display-6">Notifications</h1>
            </div>
            {
              notfications?.length > 0 ? notfications.map((item, index) => (
                <div className="row mb-3" key={index}>
                  <div className="card">
                    <div className="card-content p-2 d-flex justify-content-between align-items-center">
                      <span>
                        {item.message}
                      </span>
                      <button className="btn btn-sm btn-primary" onClick={() => { handleInvitationAccept(item.invitation) }} disabled={item.invitation[0].status==="accepted"}>
                        {item.invitation[0].status==="accepted" ? "Accepted" : "Accept"}
                      </button>
                    </div>
                  </div>
                </div>
              )) :
                <div className="row text-center">
                  <div className="d-flex justify-content-center align-items-center w-100 mb-3" style={{ width: '100%!important', textAlign: "center" }}>

                    <h1 className="lead text-center" style={{ textAlign: "center" }}>
                      You have no notifications (yet)
                    </h1>
                  </div>
                </div>

            }
          </div>
        </div>
      )}
    </>
  );
}
