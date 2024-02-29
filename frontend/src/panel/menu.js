import React, { useEffect, useState } from "react";
import HeaderBar from "../Components/HeaderBar";
import SideNavBar from "../Components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Menu() {

    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState(0);
    const [menus, setMenus] = useState([]);
    const [permission, setPermission] = useState([]);

    const [values, setValues] = useState({
        title: '',
        slug: ''
    })

    const navigate = useNavigate();

    axios.defaults.withCredentials = true

    useEffect(() => {
        axios.get("http://localhost:8081/menu")
            .then(res => {
                if (res.data.isLogin) {
                    setUsername(res.data.username)
                    setUserRole(res.data.user_role)
                    fetchMenus();
                } else {
                    navigate("/login")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const fetchMenus = async () => {
        await axios.get("http://localhost:8081/get-menus")
            .then(res => {
                if (res.data.isLogin) {
                    setMenus(JSON.parse(res.data.menus))
                }
            })
            .catch(err => {
                console.log(err)
            })

    }

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: [event.target.value] }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://localhost:8081/create', values)
            .then(response => {
                console.log(response);
                if (response.data.Status === "success") {
                    setValues(prev => ({
                        title: '',
                        slug: ''
                    }));
                    fetchMenus();
                    navigate('/menu')
                } else {
                    // setError(true);
                    // setErrorMsg(response.Message)
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    }

    return (
        <div>
            <HeaderBar />

            <SideNavBar role={userRole} navitems={menus}  permission={permission} />

            <div className="d-flex justify-content-center align-items-center bg-default vh-100">
                <div className="bg-white p-3 rounded bg-success w-25">
                    <h2>Create a menu</h2>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="title">Menu Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control form-control-lg"
                                    placeholder="Enter menu title"
                                    onChange={handleInput}
                                />
                            </div>

                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="slug">Menu slug</label>
                                <input
                                    type="text"
                                    name="slug"
                                    className="form-control form-control-lg"
                                    placeholder="Enter slug for menu"
                                    onChange={handleInput}
                                />
                            </div>

                            <div className="text-center text-lg-end mt-4 pt-2">
                                <button type="submit" className="btn btn-primary btn-lg">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}