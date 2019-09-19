import React, { Component } from "react";
import Page from "../Page";
import Post from "../Post";
import EditPostForm from "./EditPostForm";

class EditPostPage extends Component {
  state = {
    post: null
  };

  async componentDidMount() {
    const { match } = this.props;
    const { id } = match.params;
    const res = await fetch(`/api/v1/posts/${id}`);
    const post = await res.json();

    this.setState({
      post
    });
  }

  render() {
    const { post } = this.state;
    const { isAuthenticated, user } = this.props;
    if (post) {
      if (user) {
        console.log(user.username, post);
      }
      if (isAuthenticated && user.username === post.author) {
        return (
          <React.Fragment>
            <Post post={post} />
            <EditPostForm id={post.id} initialContent={post.content} />
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <h1>Unauthorized</h1>
            <p>You are not authorized to edit a post that is not your own.</p>
          </React.Fragment>
        );
      }
    } else {
      return <p>Loading...</p>;
    }
  }
}

const EditPost = props => (
  <Page {...props} title="Edit Post" component={EditPostPage} />
);

export default EditPost;
