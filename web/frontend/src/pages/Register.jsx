import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { Link, Navigate } from 'react-router-dom';

const ROLES_ENUM = {
    PRODUCT_OWNER: 'Product Owner',
    SCRUM_MASTER: 'Scrum Master',
    DEVELOPER: 'Developer',
};

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null)
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(JSON.parse(user));
            window.location.href = '/home';
        }
    }, []);
    const handleRegister = async () => {
        try {
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }

            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    username,
                    role,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error);
                return;
            }

            window.location.href = '/login';
        } catch (error) {
            console.error(error);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
     <>
       {!user && ( <div className="container d-flex justify-content-center align-items-center vh-100">
       <div className="row">
           <div className="col d-flex flex-column justify-content-center align-items-center">
               <img src={logo} height={100} />
               <span className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
                   Be the change you seek.
               </span>
           </div>
           <div className="col d-flex flex-column justify-content-center align-items-center">
               <hr style={{ rotate: '90deg', width: '300px' }} />
           </div>
           <div className="col">
               <div className="row mb-3">
                   <h1 className="display-6" style={{ textAlign: 'center', fontSize: '1.38rem' }}>
                       Create an account to get started
                   </h1>
               </div>
               {error && (
                   <div className="alert alert-danger" role="alert">
                       {error}
                   </div>
               )}
               <div className="row">
                   <input
                       type="email"
                       className="form-control"
                       id="email"
                       placeholder="Enter your email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                   />
               </div>
               <div className="row my-3">
                   <input
                       type="text"
                       className="form-control"
                       id="username"
                       placeholder="Enter your username"
                       value={username}
                       onChange={(e) => setUsername(e.target.value)}
                       required
                   />
               </div>
               <div className="row my-3">
                   <input
                       type="password"
                       className="form-control"
                       id="password"
                       placeholder="Enter your password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required
                   />
               </div>
               <div className="row my-3">
                   <input
                       type="password"
                       className="form-control"
                       id="confirmPassword"
                       placeholder="Confirm your password"
                       value={confirmPassword}
                       onChange={(e) => setConfirmPassword(e.target.value)}
                       required
                   />
               </div>
               <div className="row my-3">
                   <select
                       className="form-select"
                       aria-label="Default select example"
                       onChange={(e) => setRole(e.target.value)}
                   >
                       <option selected>{role ? role : 'Registering as...'}</option>
                       <option value={ROLES_ENUM.PRODUCT_OWNER}>Product Owner</option>
                       <option value={ROLES_ENUM.SCRUM_MASTER}>Scrum Master</option>
                       <option value={ROLES_ENUM.DEVELOPER}>Developer</option>
                   </select>
               </div>
               <div className="row">
                   <button className="btn btn-primary w-100" onClick={handleRegister}>
                       Register
                   </button>
               </div>
               <div className="row">
                   <hr className="my-3" />
               </div>
               <div className="row">
                   <span style={{ textAlign: 'center' }}>
                       Already have an account? <Link to={'/login'}>Login</Link>
                   </span>
               </div>
           </div>
       </div>
   </div>)}</>
    );
}
