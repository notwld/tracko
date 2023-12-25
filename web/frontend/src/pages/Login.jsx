import React, { useState } from 'react'
import logo from '../assets/logo.png'
import { Link, Navigate } from 'react-router-dom'
export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('userType', JSON.stringify(data.userType));
                window.location.href = '/home';
            } else {
                const errorData = await response.json();
                console.error(errorData); // Log the error data

            }
        } catch (error) {
            console.error(error); // Log any unexpected errors
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="row">
                <div className="col d-flex flex-column justify-content-center align-items-center">
                    <img src={logo} height={100} />
                    <span className="text-muted mt-2" style={{
                        fontSize: '0.8rem'
                    }}>
                        Be the change you seek.
                    </span>
                </div>
                <div className="col d-flex flex-column justify-content-center align-items-center">
                    <hr style={{
                        rotate: '90deg',
                        width: '300px',
                    }} />
                </div>
                <div className="col">
                    <div className="row mb-3">
                        <h1 className="display-6">
                            Welcome Back
                        </h1>
                    </div>
                    <div className="row">
                        <input type="email" className="form-control" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} formNoValidate={false} />
                    </div>
                    <div className="row my-3">
                        <input type="password" className="form-control" id="email" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} formNoValidate={false} />
                    </div>
                    <div className="row">
                        <button className="btn btn-primary w-100" onClick={() => {
                            handleLogin()
                        }}>Login</button>
                    </div>
                    <div className="row">
                        <hr className="my-3" />
                    </div>
                    <div className="row">
                        <span>
                            Don't have an account? <Link to={'/register'}>Register</Link>
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
}