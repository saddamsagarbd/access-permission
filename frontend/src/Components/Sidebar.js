import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link, useNavigate } from 'react-router-dom';
import NavComponent from "./navComponent"
import "@trendmicro/react-sidenav/dist/react-sidenav.css";

import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText
} from "@trendmicro/react-sidenav";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faSignOut, faCogs, faBars } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

export default function SideNavBar ({ navitems, role, permission }) {
  // console.log(permission)

  const [isVisible, setIsVisible] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState('Home');

  const navigate = useNavigate();

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  axios.defaults.withCredentials = true

  const handleLogout = () => {
    
    axios.get("http://localhost:8081/logout")
        .then(res => {
          console.log(res);
          if(res.data.isLogin === false){
            localStorage.removeItem('token');
            navigate('/login')
          }else{
            alert("error")
          }
        })
        .catch(err => {
            console.log(err)
        })

  }

  return (

    <SideNav expanded={isVisible}>
      <Toggle
        onClick={() => {
          setIsVisible(false)
        }}
      />
      <Nav defaultSelected="home">
        <NavItem eventKey="home">
          <NavIcon>
            <i className="fa fa-fw fa-home" style={{ fontSize: "1.75em" }} />
          </NavIcon>
          <NavText>Dashboard</NavText>
        </NavItem>
        {role === 1 && <NavItem eventKey="menu" onClick={() => handleMenuItemClick('menu')}>
          <NavIcon>
            {/* <i
              className="fa fa-fw fa-line-chart"
              style={{ fontSize: "1.75em" }}
            /> */}
            <FontAwesomeIcon icon={faChartLine} />
          </NavIcon>
          <NavText><Link to="/menu">Menu</Link></NavText>
        </NavItem>}
        {
          navitems.map((item, index) => {
            return (
              ((permission.length === 0) ||
              ((permission[item.id] && permission[item.id].write) || 
              (permission[item.id] && permission[item.id].read))) && <NavComponent item={item} index={index} icon={<FontAwesomeIcon icon={faBars} />} handleClick = {() => handleMenuItemClick('item.title.toLowerCase()')} havePermission={ (permission[item.id] && permission[item.id].write) ? true : false } />)
          })
        }
        
        {role === 1 && <NavItem eventKey="settings" onClick={() => handleMenuItemClick('settings')}>
          <NavIcon>
            <FontAwesomeIcon icon={faCogs} />
          </NavIcon>
          <NavText><Link to="/settings">Settings</Link></NavText>
        </NavItem>}
        <NavItem eventKey="menu" onClick={() => handleMenuItemClick('menu')}>
          <NavIcon>
            {/* <i
              className="fa fa-fw fa-line-chart"
              style={{ fontSize: "1.75em" }}
            /> */}
            <FontAwesomeIcon icon={faSignOut} />
          </NavIcon>
          <NavText><Link onClick={handleLogout}>Logout</Link></NavText>
        </NavItem>
      </Nav>
    </SideNav>
  );
}
