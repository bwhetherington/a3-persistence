import React, { Component } from "react";
import { Link } from "react-router-dom";
import Page from "../Page";

const UserLine = ({ user }) => (
  <div className="padded">
    <h2>
      <Link to={`/user/${user.username}`}>{user.name}</Link>
    </h2>
    <p>{user.postIDs.length} posts</p>
  </div>
);

class UsersPage extends Component {
  state = {
    users: []
  };

  async componentDidMount() {
    // Try to load user posts
    const usersRes = await fetch(`/api/v1/users/list`);
    const users = await usersRes.json();

    console.log("users", users);

    this.setState({
      users
    });
  }

  render() {
    const { users } = this.state;
    const sortedUsers = [...users];
    sortedUsers.sort((a, b) => b.postIDs.length - a.postIDs.length);
    const renderedUsers =
      sortedUsers.length > 0 ? (
        <React.Fragment>
          {sortedUsers.map(user => (
            <UserLine key={user.username} user={user} />
          ))}
        </React.Fragment>
      ) : (
        <p>No users have registered yet.</p>
      );
    return renderedUsers;
  }
}

const Users = props => {
  return <Page title="Users" component={UsersPage} {...props} />;
};

export default Users;
