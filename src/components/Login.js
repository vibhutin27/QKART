import React, { useState } from "react";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Link, useHistory } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [allformData, setAllformData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAllformData({ ...allformData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(allformData);
  };

  const validateInput = (data) => {
    if (!data.username) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }
    if (!data.password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    return true;
  };

  const login = async (formData) => {
    if (!validateInput(formData)) return;

    try {
      setLoading(true);
      const response = await axios.post(`${config.endpoint}/auth/login`, {
        username: formData.username,
        password: formData.password,
      });

      persistLogin(response.data.token,
      response.data.username,
      response.data.balance,
      
      )

      setAllformData({
        username: '',
        password: '',
      });

      setLoading(false);

      if (response.data.success) {
        persistLogin(response.data.token, response.data.username, response.data.balance);
        enqueueSnackbar("Logged in successfully", { variant: "success" });
        history.push("/");  // Navigate to the dashboard or another route on successful login
      }

    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", {
          variant: "error",
        });
      }
    }
  };

  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  


  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between" minHeight="100vh">
     
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={5} className="form">
          <form onSubmit={handleSubmit}>
            <h2 className="title">Login</h2>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              name="username"
              value={allformData.username}
              onChange={handleChange}
              placeholder="Enter Username"
              fullWidth
            />
            <TextField
              id="password"
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              value={allformData.password}
              onChange={handleChange}
              placeholder="Enter a password with minimum 6 characters"
              fullWidth
            />
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress size={25} color="secondary" />
              </Box>
            ) : (
              <Button type="submit" className="button" variant="contained">
                Login to qkart
              </Button>
            )}
            <p className="secondary-action">
              Don't have an account?{" "}
              <Link className="link" to="/register">
                Register Now
              </Link>
            </p>
          </form>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
