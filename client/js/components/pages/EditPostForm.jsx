import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import { request, setAuthenticated } from "../../util";
import Page from "../Page";
import Container from "react-bootstrap/Container";

const onSubmit = id => async data => {
  await request("POST", "/api/v1/posts/edit", { ...data, id });
};

const schema = yup.object().shape({
  content: yup.string().required()
});

const EditPostForm = ({ id, initialContent }) => (
  <React.Fragment>
    <h1>Edit Post</h1>
    <Container>
      <Formik
        validationSchema={schema}
        onSubmit={onSubmit(id)}
        initialValues={{ content: initialContent }}
      >
        {({ handleSubmit, handleChange, values, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
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
                <Button type="submit">Submit Changes</Button>
              </ButtonToolbar>
            </Form.Row>
          </Form>
        )}
      </Formik>
    </Container>
  </React.Fragment>
);

export default EditPostForm;
