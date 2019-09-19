import React, { Component } from "react";
import Post from "../Post";
import { renderDate } from "../../util";
import Page from "../Page";

class UserProfilePage extends Component {
  state = {
    user: null,
    posts: []
  };

  async componentDidMount() {
    const { user } = this.props.match.params;
    // Try to load user profile
    const profileRes = await fetch(`/api/v1/users/${user}`);
    const profile = await profileRes.json();

    // Try to load user posts
    const postsRes = await fetch(`/api/v1/users/${user}/posts`);
    const posts = await postsRes.json();

    this.setState({
      user: profile,
      posts
    });
  }

  render() {
    const { user, posts } = this.state;
    const sortedPosts = [...posts];
    sortedPosts.sort((a, b) => b.time - a.time);
    const renderedPosts =
      sortedPosts.length > 0 ? (
        <React.Fragment>
          {sortedPosts.map(post => (
            <Post key={post.id} post={post} />
          ))}
        </React.Fragment>
      ) : (
        <p>This user has not made any posts.</p>
      );
    if (user) {
      console.log(user);
      return (
        <React.Fragment>
          <h1>{user.name}</h1>
          <p>
            {user.name} joined on {renderDate(user.joinTime)}.
          </p>
          <h2>Posts</h2>
          {renderedPosts}
        </React.Fragment>
      );
    } else {
      return <p>Loading...</p>;
    }
  }
}

const UserProfile = props => {
  console.log("UserProfile", props);
  return <Page title="Profile" component={UserProfilePage} {...props} />;
};

export default UserProfile;
