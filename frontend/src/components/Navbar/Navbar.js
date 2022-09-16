import React from "react";
import {
  Bars,
  Nav,
  NavBtn,
  NavBtnLink,
  NavLink,
  NavMenu,
} from "./NavbarComponents";

const NavBar = ({ logout, auth }) => {
  let button;

  if (!auth) {
    button = (
      <NavBtn>
        <NavBtnLink to="/login">Login</NavBtnLink>
        <NavBtnLink to="/register">Sign Up</NavBtnLink>
      </NavBtn>
    );
  } else {
    button = (
      <NavBtn onClick={logout}>
        <NavBtnLink to="/">Logout</NavBtnLink>
      </NavBtn>
    );
  }

  return (
    <>
      <Nav>
        <NavLink to="/">
          <h1>AnimeList</h1>
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to="/" activestyle="true">
            Home
          </NavLink>
          <NavLink to="/rental" activestyle="true">
            Rental
          </NavLink>
          <NavLink to="/store" activestyle="true">
            Store
          </NavLink>
          <NavLink to="/streaming" activestyle="true">
            Streaming
          </NavLink>
          {/*<NavBtnLink to = "/signin">Sign Up</NavBtnLink>*/}
        </NavMenu>
        {button}
      </Nav>
    </>
  );
};

export default NavBar;
