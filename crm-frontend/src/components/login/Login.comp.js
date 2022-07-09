import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import { loginPending, loginSuccess, loginFail } from "./loginSlice";
import { userLogin } from "../../api/userApi";
import { getUserProfile } from "../../pages/dashboard/userAction";

export const LoginForm = ({ formSwitcher }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  let location = useLocation();

  const { isLoading, isAuth, error } = useSelector((state) => state.login);
  let { from } = location.state || { from: { pathname: "/" } };

  useEffect(() => {
    sessionStorage.getItem("accessJWT") && history.replace(from);

    // if (history.goBack()) {
    //   window.location.reload(true);
    // }
  }, [history, isAuth]);

  window.addEventListener("popstate", () => {
    history.go(1);
  });

  const [email, setEmail] = useState("dkp7365@gmail.com");
  const [password, setPassword] = useState("Pasindu123@");

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "email":
        setEmail(value);
        break;

      case "password":
        setPassword(value);
        break;

      default:
        break;
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return alert("Form has empty fields!");
    }

    dispatch(loginPending());

    try {
      const isAuth = await userLogin({ email, password });
      if (isAuth.status === "error") {
        return dispatch(loginFail(isAuth.message));
      }

      dispatch(loginSuccess());
      dispatch(getUserProfile());
      history.push("/dashboard");
    } catch (error) {
      dispatch(loginFail(error.message));
    }
  };

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h1 className="text-dark text-center">Power-Zone CRM Suite</h1>

            <hr />
            {error && <Alert variant="danger">{error}</Alert>}
            <Form autoComplete="off" onSubmit={handleOnSubmit}>
              <Form.Group>
                <Form.Label>Email Address</Form.Label>

                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleOnChange}
                  placeholder="Enter Email"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>

                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleOnChange}
                  value={password}
                  placeholder="Enter Password"
                  required
                />
              </Form.Group>

              <Button variant="dark" type="submit">
                Login
              </Button>
              {isLoading && <Spinner variant="dark" animation="border" />}
            </Form>
            <hr />
          </Col>
        </Row>

        <Row>
          <Col>
            <a href="/password-reset">Forget Password?</a>
          </Col>
        </Row>
        <Row className="py-4">
          <Col>
            Are you new here? <a href="/registration">Register Now</a>
          </Col>
        </Row>
      </Container>
    </>
  );
};

LoginForm.propTypes = {
  formSwitcher: PropTypes.func.isRequired,
};