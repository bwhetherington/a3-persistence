import React, { Component } from "react";
import Post from "../Post";
import { renderDate } from "../../util";
import Page from "../Page";

class Posts extends Component {
  state = {
    posts: []
  };

  async componentDidMount() {
    // Try to load user posts
    const postsRes = await fetch(`/api/v1/posts/list`);
    const posts = await postsRes.json();

    this.setState({
      posts
    });
  }

  render() {
    const { posts } = this.state;
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
        <p>No posts have been made yet.</p>
      );
    return renderedPosts;
  }
}

const List = props => {
  return <Page title="Posts" component={Posts} {...props} />;
};

export default List;
