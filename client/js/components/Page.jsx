import React, { Component } from "react";
import TopBar from "./TopBar";
import "./Page.css";
import { checkAuthenticated } from "../util";

class ErrorBoundary extends Component {
  state = {
    hasError: false
  };

  static getDerivedStateFromError(err) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <React.Fragment>
          <h1>Error</h1>
          <p>An error has occurred.</p>
        </React.Fragment>
      );
    } else {
      return this.props.children;
    }
  }
}

class Page extends Component {
  state = {
    previousTitle: document.title,
    isAuthenticated: false,
    user: null
  };

  setUser = user => {
    this.setState({
      ...this.state,
      isAuthenticated: !!user,
      user
    });
  };

  async updateAuthenticated() {
    const { isAuthenticated, user } = await checkAuthenticated();
    this.setState({
      ...this.state,
      isAuthenticated,
      user
    });
  }

  async componentDidMount() {
    const { title } = this.props;
    if (title) {
      document.title = title;
    }
    await this.updateAuthenticated();
  }

  componentWillUnmount() {
    if (this.props.title) {
      document.title = this.state.previousTitle;
    }
  }

  render() {
    const { component, ...props } = this.props;
    const pageProps = {
      ...props,
      isAuthenticated: this.state.isAuthenticated,
      user: this.state.user,
      setUser: this.setUser
    };
    return (
      <div className="page" {...props}>
        <TopBar {...pageProps} />
        <div className="page-container">
          <ErrorBoundary>
            {React.createElement(component, pageProps)}
          </ErrorBoundary>
        </div>
      </div>
    );
  }
}

export default Page;
