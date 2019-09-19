import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import { request, setAuthenticated } from "../../util";
import Page from "../Page";
import Container from "react-bootstrap/Container";

const onRegister = setUser => async data => {
  const { username, password, name } = data;
  const body = { username, password, name };
  const res = await request("POST", "/api/v1/users/new", body);
  if (res.ok) {
    const { user } = await request("GET", "/api/v1/active-user");
    setUser(user);
  }
  console.log(res);
};

const schema = yup.object().shape({
  username: yup.string().required("Username required."),
  name: yup.string().required("Name required."),
  password: yup
    .string()
    .required("Password required.")
    .max(72, "Password may not exceed 72 characters."),
  passwordConfirm: yup
    .string()
    .test("passwordsEqual", "Passwords must be equal.", function(val) {
      const { password } = this.parent;
      return password === val;
    })
});

const RegisterForm = ({ setUser }) => (
  <React.Fragment>
    <h1>Register</h1>
    <Container>
      <Formik
        validationSchema={schema}
        onSubmit={onRegister(setUser)}
        initialValues={{
          username: "",
          name: "",
          password: "",
          passwordConfirm: ""
        }}
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
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                isInvalid={"name" in errors}
                placeholder="Name"
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
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
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="passwordConfirm"
                value={values.passwordConfirm}
                onChange={handleChange}
                isInvalid={"passwordConfirm" in errors}
                placeholder="Password"
              />
              <Form.Control.Feedback type="invalid">
                {errors.passwordConfirm}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Row>
              <ButtonToolbar>
                <Button variant="primary" className="mr-2" type="submit">
                  Register
                </Button>
                <Button variant="outline-primary" onClick={handleReset}>
                  Reset
                </Button>
              </ButtonToolbar>
            </Form.Row>
          </Form>
        )}
      </Formik>
    </Container>
  </React.Fragment>
);

const Register = _ => <Page title="Register" component={RegisterForm} />;

export default Register;
