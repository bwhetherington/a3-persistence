import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Button from "react-bootstrap/Button";

import Page from "./Page";

import CreatePost from "./CreatePost";

import { post } from "../util";
import UserProfile from "./pages/UserProfile";
import List from "./pages/List";
import EditPost from "./pages/EditPost";
import Users from "./pages/Users";

const NewPostPage = ({ isAuthenticated, user }) => {
  if (isAuthenticated) {
    return (
      <div>
        <h1>Hello, {user.name}</h1>
        <p>Write a post!</p>
        <CreatePost />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Error</h1>
        <p>You must be logged in to create a post.</p>
      </div>
    );
  }
};

const NewPost = _ => <Page title="Home" component={NewPostPage} />;

const NotFoundPage = _ => (
  <div>
    <h1>404 Error</h1>
    <p>The content you were looking for was not found.</p>
  </div>
);

const NotFound = _ => (
  <Page title="Content Not Found" component={NotFoundPage} />
);

const UnauthorizedPage = _ => (
  <div>
    <h1>Unauthorized</h1>
    <p>You are not authorized to access this resource.</p>
  </div>
);

const Unauthorized = _ => (
  <Page title="Unauthorized" component={UnauthorizedPage} />
);

const renderUserAbbreviation = props => (
  <Redirect to={`/user/${props.match.params.user}`} />
);

const App = _ => (
  <Router>
    <Switch>
      <Route exact path="/" component={List} />
      <Route exact path="/users" component={Users} />
      <Route exact path="/new" component={NewPost} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/unauthorized" component={Unauthorized} />
      <Route path="/user/:user" component={UserProfile} />
      <Route path="/u/:user" render={renderUserAbbreviation} />
      <Route path="/edit/:id" component={EditPost} />
      <Route path="*" component={NotFound} />
    </Switch>
  </Router>
);

export default App;
