import { Link } from "react-router-dom";
import "../stylesheets/nav.css";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Nav() {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(JSON.parse(user));
            const userType = localStorage.getItem('userType');
            setUserType(JSON.parse(userType));
            const authToken = localStorage.getItem('token');
            setToken(authToken);
        }
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        window.location.href = '/login';
        try {
            await fetch('http://localhost:3000/api/auth/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(res => res.json())
            .then(data => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
                window.location.href = '/login';
            })
            .catch(err => {
                console.log(err);
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {user && (
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to={"/home"}>
                            <img src={logo} alt="Logo" height="32" className="navbar-logo" />
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Your Work
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="#">Assigned To Me</a></li>
                                        <li><a className="dropdown-item" href="#">Board</a></li>
                                    </ul>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {user.username}
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><Link to={"/profile"} className="dropdown-item">Profile</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><a className="dropdown-item" style={{ cursor: "pointer" }} onClick={handleLogout}>Logout</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            )}
        </>
    );
}
