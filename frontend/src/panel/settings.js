import React, { useEffect, useState } from "react";
import HeaderBar from "../Components/HeaderBar";
import SideNavBar from "../Components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Settings() {

    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [userRole, setUserRole] = useState(0);
    const [menus, setMenus] = useState([]);
    const [users, setUsers] = useState([]);
    const [isTableShow, setIsTableShow] = useState(false);
    const [permission, setPermission] = useState([]);
    const [radioBtnState, setRadioBtnState] = useState({});

    const navigate = useNavigate();
    axios.defaults.withCredentials = true

    useEffect(() => {
        axios.get("http://localhost:8081/settings")
            .then(res => {
                if (res.data.isLogin) {
                    console.log(res.data.username);
                    setUsername(res.data.username)
                    setUserRole(res.data.user_role)
                    fetchMenus();
                    fetchUsers();
                } else {
                    navigate("/login")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const fetchUsers = async () => {
        await axios.get("http://localhost:8081/get-users")
            .then(res => {
                if (res.data.isLogin) {
                    setUsers(JSON.parse(res.data.users))
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

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

    const handleChange = (e) => {
        e.preventDefault();

        if(e.target.value === "") {
            setRadioBtnState({});
            setIsTableShow(false);
            return;
        }

        axios.post("http://localhost:8081/get-permission-by-userid", { user_id: e.target.value })
            .then(res => {
                if (res.data.isLogin) {
                    console.log("data", res.data);
                    if(res.data.permission){
                        
                        if(res.data.permission === ""){
                            setPermission([]);
                        }else{
                        
                            setPermission((res.data.permission));
                            const radioBtnStateUpdates = JSON.parse(res.data.permission);
                            const newJsonObject = {};
                            for (const key in radioBtnStateUpdates) {
                                if (Object.hasOwnProperty.call(radioBtnStateUpdates, key)) {
                                    newJsonObject[parseInt(key)] = radioBtnStateUpdates[key];
                                }
                            }
                            setRadioBtnState(prevState => ({
                                ...prevState,
                                ...newJsonObject
                            }));

                        }

                    }else{
                        setRadioBtnState({});
                    }

                    setUserId(e.target.value);
                    setIsTableShow(true)
                }
            })
            .catch(err => console.log(err))

    }

    // Function to handle checkbox change
    const handleRadioChange = (menuId, columnNumber, isChecked) => {
        setRadioBtnState(prevState => ({
            ...prevState,
            [menuId]: {
                [columnNumber]: isChecked
            }
        }));
    };

    // Function to handle form submit
    const handleSubmit = (event) => {
        event.preventDefault();
        // Do whatever you want with the checkboxState object
        console.log(userId);
        console.log(radioBtnState);

        if(userId == ""){
            setIsTableShow(false)
            return;
        }

        const values = {
            user_id: userId,
            permission: radioBtnState
        }

        axios.post('http://localhost:8081/set-permission', values)
            .then(response => {
                console.log(response);
                if (response.data.Status === "success") {
                    navigate('/settings')
                } 
                // else {
                //     // setError(true);
                //     // setErrorMsg(response.Message)
                // }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    return (
        <div>
            <HeaderBar />
            <SideNavBar role={userRole} navitems={menus} permission={permission} />
            <main className="col overflow-auto h-100" style={{ float: "left", width: "calc(100% - 280px)", marginLeft: "280px", marginTop: "50px" }}>
                <div className="bg-light border rounded-3 p-3">
                    <form onSubmit={handleSubmit}>

                        <h4>User List</h4>
                        <p>
                            <div className="form-group mx-sm-3 mb-2">
                                <label for="exampleFormControlSelect1">User select</label>
                                <select className="form-control" name="selected_user" onChange={handleChange}>
                                    <option value="">-- select a user --</option>
                                    {users.map((user, index) => { return <option value={user.id}>{user.username}</option> })}
                                </select>
                            </div>
                        </p>
                        <hr />
                        {isTableShow && permission.length === 0 && (<>

                            <h4>Menu's Permission</h4>
                            <p>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Title</th>
                                            <th scope="col">Read</th>
                                            <th scope="col">Write</th>
                                            <th scope="col">Do Not Show</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {menus.map((menu, index) => (
                                            <tr key={index}>
                                                <th scope="row">{menu.title}</th>
                                                <td>
                                                    <input
                                                        type="radio"
                                                        className="custom-control-input"
                                                        name={`permission${menu.id}`}
                                                        id={`customCheck${menu.id}1`}
                                                        checked={radioBtnState[menu.id]?.read || false}
                                                        onChange={(e) => handleRadioChange(menu.id, "read", e.target.checked)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="radio"
                                                        className="custom-control-input"
                                                        name={`permission${menu.id}`}
                                                        id={`customCheck${menu.id}2`}
                                                        checked={radioBtnState[menu.id]?.write || false}
                                                        onChange={(e) => handleRadioChange(menu.id, "write", e.target.checked)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="radio"
                                                        className="custom-control-input"
                                                        name={`permission${menu.id}`}
                                                        id={`customCheck${menu.id}3`}
                                                        checked={radioBtnState[menu.id]?.not_show || false}
                                                        onChange={(e) => handleRadioChange(menu.id, "not_show", e.target.checked)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </p>
                        </>
                        )}
                        {isTableShow && permission.length > 0 && (<>

                            <h4>Menu's Permission</h4>
                            <p>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Title</th>
                                            <th scope="col">Read</th>
                                            <th scope="col">Write</th>
                                            <th scope="col">Do Not Show</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            menus.map((menu, index) => console.log("menu-id", radioBtnState[menu.id]))
                                        }
                                        {menus.map((menu, index) => (
                                            <tr key={index}>
                                                <th scope="row">{menu.title}</th>
                                                <td>
                                                    <input
                                                        type="radio"
                                                        className="custom-control-input"
                                                        name={`permission${menu.id}`}
                                                        id={`customCheck${menu.id}1`}
                                                        checked={radioBtnState[menu.id]?.read || false}
                                                        onChange={(e) => handleRadioChange(menu.id, "read", e.target.checked)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="radio"
                                                        className="custom-control-input"
                                                        name={`permission${menu.id}`}
                                                        id={`customCheck${menu.id}2`}
                                                        checked={radioBtnState[menu.id]?.write || false}
                                                        onChange={(e) => handleRadioChange(menu.id, "write", e.target.checked)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="radio"
                                                        className="custom-control-input"
                                                        name={`permission${menu.id}`}
                                                        id={`customCheck${menu.id}3`}
                                                        checked={radioBtnState[menu.id]?.not_show || false}
                                                        onChange={(e) => handleRadioChange(menu.id, "not_show", e.target.checked)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </p>
                        </>
                        )}
                        <button type="submit" className="btn btn-primary">Save change</button>
                    </form>
                </div>
            </main>
        </div>
    )
}