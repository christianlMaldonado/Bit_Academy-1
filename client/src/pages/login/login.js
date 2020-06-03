import React, { Component } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Checkbox,
  FormControlLabel,
  Snackbar,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Copyright from "../../components/copyright/copyright";
import Alert from "../../components/Alert";
import "./styleLogin.css";
import API from "../../utilities/API";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isStudent: false,
      open: false,
      message: "",
      severity: "",
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleChange = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.checked,
    });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    this.setState({
      open: false,
    });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    if (this.state.isStudent) {
      API.loginStudent({ email: this.state.email, password: this.state.password }).then(
        (response) => {
          if (response.data.token) {
            let tokenArr = response.data.token.split(" ");
            const token = tokenArr.pop().toString();
            localStorage.setItem("id_token", token);
            this.props.history.push("/home");
          } else {
            this.setState({
              ...this.state,
              message: "Student doesn't exist contact your teacher.",
              severity: "error",
              open: true,
            });
          }
        }
      );
    } else {
      API.loginTeacher({ email: this.state.email, password: this.state.password }).then(
        (response) => {
          if (response.data.token) {
            let tokenArr = response.data.token.split(" ");
            const token = tokenArr.pop().toString();
            localStorage.setItem("id_token", token);
            this.props.history.push("/home");
          } else {
            this.setState({
              ...this.state,
              message: "Teacher doesn't exist try registering.",
              severity: "error",
              open: true,
            });
          }
        }
      );
    }
  };

  // tour = () => {
  //   API.login({ email: "guest@email.com", password: "test1234" }).then((response) => {
  //     let tokenArr = response.data.token.split(" ");
  //     const token = tokenArr.pop().toString();
  //     localStorage.setItem("id_token", token);
  //     this.props.history.push("/home");
  //   });
  // };

  render() {
    return (
      <>
        <div className="image-container">
          <img
            className="login-image"
            alt="login"
            src={process.env.PUBLIC_URL + "/images/login.jpg"}
          ></img>
        </div>
        <Snackbar open={this.state.open} autoHideDuration={5000} onClose={this.handleClose}>
          <Alert onClose={this.handleClose} severity={this.state.severity}>
            {this.state.message}
          </Alert>
        </Snackbar>
        <Container component="main" className="loginContainer">
          <CssBaseline />
          <div className="center">
            <Avatar className="color">
              <AccountCircleIcon />
            </Avatar>
            <Typography className="formHead" component="h1" variant="h5">
              Sign In
            </Typography>
            <form noValidate>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.isStudent}
                    onChange={this.handleChange}
                    name="isStudent"
                  />
                }
                label="Student"
              />
              <TextField
                onChange={this.handleInputChange}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                onChange={this.handleInputChange}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                onClick={this.handleFormSubmit}
                type="submit"
                fullWidth
                variant="contained"
                className="submitLogin"
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <div className="signUp">
                    <Link href="/register" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </div>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      </>
    );
  }
}

export default SignIn;
