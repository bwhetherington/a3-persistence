import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import { request, setAuthenticated } from "../../util";
import Page from "../Page";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";

const onLogin = async data => {
  await request("POST", "/auth", data);
};

const schema = yup.object().shape({
  username: yup.string().required("Username required."),
  password: yup.string().required("Password required.")
});

const LoginForm = props => (
  <React.Fragment>
    <h1>Login</h1>
    <Container>
      <Formik
        validationSchema={schema}
        onSubmit={onLogin}
        initialValues={{ username: "", password: "" }}
      >
        {({ handleSubmit, handleChange, handleReset, values, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={values.username}
                onChange={handleChange}
                isInvalid={"username" in errors}
                placeholder="Username"
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isInvalid={"password" in errors}
                placeholder="Password"
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Row>
              <ButtonToolbar>
                <Button className="mr-2" type="submit">
                  Login
                </Button>
                <Button
                  className="mr-2"
                  variant="outline-primary"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button variant="outline-primary" href="/register">
                  Register
                </Button>
              </ButtonToolbar>
            </Form.Row>
          </Form>
        )}
      </Formik>
    </Container>
  </React.Fragment>
);

const Login = _ => <Page title="login" component={LoginForm} />;

export default Login;
