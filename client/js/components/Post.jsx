import React, { Component } from "react";
import { request, renderDate } from "../util";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

class PostContent extends Component {
  state = {
    author: "Anonymous"
  };

  async componentDidMount() {
    const { author } = this.props.post;
    console.log("post", this.props.post);

    const res = await fetch(`/api/v1/users/${author}`);
    const { name } = await res.json();

    this.setState({
      author: name
    });
  }

  handleEdit = () => {
    const { id } = this.props.post;
    console.log(id);
  };

  handleDelete = async () => {
    const { id } = this.props.post;
    await request("POST", "/api/v1/posts/delete", { id });
  };

  render() {
    const { author } = this.state;
    const { post } = this.props;
    const { title, content, time, isOwnPost, id } = post;
    if (isOwnPost) {
      return (
        <React.Fragment>
          <h3>{title}</h3>
          <p>
            <i>
              <Link to={`/user/${this.props.post.author}`}>{author}</Link>,{" "}
              {renderDate(time)}
            </i>
          </p>
          <p>{content}</p>
          <Button
            className="mr-2"
            variant="outline-primary"
            href={`/edit/${id}`}
          >
            Edit
          </Button>
          <Button
            className="mr-2"
            variant="outline-primary"
            onClick={this.handleDelete}
          >
            Delete
          </Button>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <h3>{title}</h3>
          <p>
            <i>
              <Link to={`/user/${this.props.post.author}`}>{author}</Link>,{" "}
              {renderDate(time)}
            </i>
          </p>
          <p>{content}</p>
        </React.Fragment>
      );
    }
  }
}

const Post = props => (
  <div className="padded">
    <PostContent {...props} />
  </div>
);

export default Post;
