import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import { setAuthenticated, request } from "../util";

const logOut = setUser => async () => {
  setUser(null);
  await request("POST", "/logout");
};

const TopBar = ({ isAuthenticated, setUser }) =>
  isAuthenticated ? (
    <Navbar bg="light">
      <Navbar.Brand href="/">Posts</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Nav className="mr-auto">
        <Nav.Link href="/new">Write Post</Nav.Link>
        <Nav.Link href="/users">Users</Nav.Link>
      </Nav>
      <Nav>
        <Nav.Link onClick={logOut(setUser)}>Logout</Nav.Link>
      </Nav>
    </Navbar>
  ) : (
    <Navbar bg="light">
      <Navbar.Brand href="/">Posts</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Nav className="mr-auto">
        <Nav.Link href="/new">Write Post</Nav.Link>
        <Nav.Link href="/users">Users</Nav.Link>
      </Nav>
      <Nav>
        <Nav.Link href="/login">Login</Nav.Link>
      </Nav>
    </Navbar>
  );

export default TopBar;
