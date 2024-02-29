import React, { useEffect, useState } from "react";
import HeaderBar from "../Components/HeaderBar";
import SideNavBar from "../Components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState(0);
    const [menus, setMenus] = useState([]);
    const [permission, setPermission] = useState([]);

    const navigate = useNavigate();

    axios.defaults.withCredentials = true

    useEffect(() => {
        axios.get("http://localhost:8081/")
            .then(res => {
                console.log(res);
                if (res.data.isLogin) {
                    console.log(res.data.username);
                    setUsername(res.data.username)
                    setUserRole(res.data.user_role)
                    fetchMenus()
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

                    if (res.data.permission === "") {
                        setPermission([])
                    } else {

                        const permissionJSON = JSON.parse(res.data.permission);
                        console.log("permissionJSON", permissionJSON);
                        const permissions = JSON.parse(permissionJSON[0].permission);
                        console.log("permissions", permissions);
                        const newJsonObject = {};
                        for (const key in permissions) {
                            if (Object.hasOwnProperty.call(permissions, key)) {
                                newJsonObject[parseInt(key)] = permissions[key];
                            }
                        }
                        console.log("newJsonObject", newJsonObject);
                        setPermission(newJsonObject)

                    }
                }
            })
            .catch(err => {
                console.log(err)
            })

    }

    return (
        <div>
            <HeaderBar />

            <SideNavBar role={userRole} navitems={menus} permission={permission} />
            <div className="d-flex justify-content-center align-items-center bg-default vh-100">
                <div className="bg-white p-3 rounded bg-success w-25">
                    <h1>Welcom {username} to dashboard.</h1>
                </div>
            </div>

            
        </div>
    );
}