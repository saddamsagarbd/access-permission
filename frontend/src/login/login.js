import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
    // const [ error, setError ] = useState(false);
    // const [ errorMsg, setErrorMsg ] = useState('');

    const [values, setValues] = useState({
        username: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name] : [event.target.value]}))
    }

    const handleClick = (event) => {
        event.preventDefault();
        navigate('/registration');
    }

    axios.defaults.withCredentials = true

    useEffect(() => {
        axios.get("http://localhost:8081/")
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

        axios.post('http://localhost:8081/login', values)
            .then(response => {
                console.log(response.data.Login);
                if(response.data.Login === true) {
                    navigate('/')
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
                <h2>Login</h2>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="form3Example3">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="form-control form-control-lg"
                                placeholder="Enter a valid username"
                                onChange={handleInput}
                            />
                        </div>

                        <div className="form-outline mb-3">
                            <label className="form-label" htmlFor="form3Example4">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control form-control-lg"
                                placeholder="Enter password"
                                onChange={handleInput}
                            />
                        </div>
                        <div className="text-center text-lg-start mt-4 pt-2">
                            <button type="submit" className="btn btn-primary btn-lg">Login</button>
                            <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <span
                                onClick={handleClick} className="link-danger">Register</span></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}