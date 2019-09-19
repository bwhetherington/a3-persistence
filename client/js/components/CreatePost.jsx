import React, { Component } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import { post } from "../util";

const submitForm = async data => {
  await post("/api/v1/posts/new", data);
};

const schema = yup.object().shape({
  title: yup.string().required("Post must have a title."),
  content: yup.string().required("Post may not be empty.")
});

const CreatePost = _ => (
  <Formik
    validationSchema={schema}
    onSubmit={submitForm}
    initialValues={{ title: "", content: "" }}
  >
    {({ handleSubmit, handleChange, handleReset, values, isValid, errors }) => (
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={values.title}
            onChange={handleChange}
            isInvalid={"title" in errors}
            placeholder="Title"
          />
          <Form.Control.Feedback type="invalid">
            {errors.title}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            name="content"
            rows={5}
            value={values.content}
            onChange={handleChange}
            isInvalid={"content" in errors}
            placeholder="Write post here..."
          />
          <Form.Control.Feedback type="invalid">
            {errors.content}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Row>
          <ButtonToolbar>
            <Button className="mr-2" type="submit">
              Submit
            </Button>
            <Button
              className="mr-2"
              variant="outline-primary"
              onClick={handleReset}
            >
              Reset
            </Button>
          </ButtonToolbar>
        </Form.Row>
      </Form>
    )}
  </Formik>
);

export default CreatePost;
