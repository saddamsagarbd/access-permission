import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export default function Registration() {
    const [ isDisabled, setIsDisabled ] = useState(false);
    // const [ error, setError ] = useState(false);
    // const [ errorMsg, setErrorMsg ] = useState('');
    const navigate = useNavigate();

    const [values, setValues] = useState({
        username: '',
        password: ''
    })

    const handlePassword = (event) => {
        if(event.target.value !== values.password[0]){ setIsDisabled(true);}else{setIsDisabled(false);}
    }

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: [event.target.value] }))
    }

    const handleClick = (event) => {
        event.preventDefault();
        navigate('/login');
    }

    axios.defaults.withCredentials = true

    useEffect(() => {
        axios.get("http://localhost:8081/dashboard")
        .then(res => {
            console.log(res);
            if (res.data.isLogin){
                navigate("/")
            } else {
                navigate("/login")
            }
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();

        // http://localhost:8081/

        axios.post('http://localhost:8081/register', values)
            .then(response => {
                if(response.data.Status === "success") {
                    console.log(response);
                    navigate('/login')
                }else{
                    // setError(true);
                    // setErrorMsg(response.Message)
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    return (
        <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Registration</h2>
                <div>
                    {/* {(error, errorMsg) => {
                        if(error){
                            return (<div className="alert alert-danger" role="alert">{errorMsg}</div>)
                        }
                    }} */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="username">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="form-control form-control-lg"
                                placeholder="Enter a valid username"
                                onChange={handleInput}
                            />
                        </div>

                        <div className="form-outline mb-3">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control form-control-lg"
                                placeholder="Enter password"
                                onChange={handleInput}
                            />
                        </div>

                        <div className="form-outline mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm-password"
                                className="form-control form-control-lg"
                                placeholder="Enter password"
                                onChange={handlePassword}
                            />
                        </div>
                        <div className="text-center text-lg-start mt-4 pt-2">
                            <button type="submit" disabled={isDisabled} className="btn btn-primary btn-lg">Register</button>
                            <p className="small fw-bold mt-2 pt-1 mb-0">Already have an account? <span onClick={handleClick}
                                className="link-danger">Login</span></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}