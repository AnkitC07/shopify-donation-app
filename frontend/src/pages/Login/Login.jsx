// src/components/Login.js
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  InlineError,
  Text,
  TextField,
  VerticalStack,
} from "@shopify/polaris";
import "./index.css";
import { UserContext } from "../../../context/User.jsx";
import { setcookies } from "../../hooks/setGetToken";
import { LoginAction } from "../../api";

function Login() {
  const { setLoggedIn, user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notify, notifyState] = useState({
    display: false,
    msg: "",
    type: "error",
  });

  const handleLogin = async () => {
    setLoading(true);
    try {
      const loginResponse = await LoginAction(email, password);
      console.log("Login successful!", loginResponse);
      setUser({
        ...user,
        token: loginResponse.token,
        loading: false,
      });

      notifyState({
        display: false,
        msg: "Login successfuly",
        type: "success",
      });
      setcookies("user", loginResponse.token);
      setLoggedIn(true);
      setLoading(false);
      navigate("/");
      // Perform actions after successful login, like updating state, navigating, etc.
    } catch (error) {
      notifyState({
        display: true,
        msg: "Invalid email id and password",
        type: "error",
      });
      console.error("Login error:", error.message);
      setLoading(false);
      // Handle the error, maybe display an error message to the user
    }
  };

  return (
    <div
      id="super-admin-login"
      style={{ maxWidth: "500px", margin: "auto", textAlign: "center" }}
    >
      <VerticalStack gap="10">
        <Text variant="heading3xl" as="h2">
          Shopify Dashboard
        </Text>
        {notify.display == true ? (
          <InlineError message={notify.msg} fieldID="myFieldID" />
        ) : null}
        <VerticalStack gap="5">
          <TextField
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e)}
            autoComplete="off"
          />
          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e)}
            autoComplete="off"
          />
          <div style={{ textAlign: "right" }}>
            <Button
              loading={loading}
              size="large"
              primary
              onClick={handleLogin}
            >
              Login
            </Button>
          </div>
        </VerticalStack>
      </VerticalStack>
    </div>
  );
}

export default Login;
