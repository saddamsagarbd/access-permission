import React from "react";
import { Link } from 'react-router-dom';

import SideNav, {
    Toggle,
    Nav,
    NavItem,
    NavIcon,
    NavText
} from "@trendmicro/react-sidenav";


export default function Navitem({ item, index, handleClick, icon, havePermission }) {
    const handleLinkClick = () => {
        if(!havePermission) alert("You do not have permission")
    };
    return (<NavItem key={index} eventKey={item.title.toLowerCase()} onClick={handleClick}>
        <NavIcon>
            {icon}
        </NavIcon>
        <NavText>
            <a onClick={handleLinkClick}>{item.title}</a>
            {/* <Link to={item.slug}>{item.title}</Link> */}
        </NavText>
    </NavItem>)
}