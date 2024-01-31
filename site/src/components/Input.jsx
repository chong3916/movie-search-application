import React from "react";
import {Col, Form, Row} from "react-bootstrap";

const Input = ({ value, onChange, type, id, displayLabel }) => {
  return (
      <Row className="justify-content-md-center" md={2}>
          <Form.Group as={Col} controlId={id}>
              <Form.Label>{displayLabel}</Form.Label>
              <Form.Control
                  required
                  type={type}
                  value={value}
                  onChange={onChange}
                  aria-label={id}
              />
          </Form.Group>
      </Row>
  );
};

export default Input;
