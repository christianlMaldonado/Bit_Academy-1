import React, { Component } from "react";
import "./style-create.css";
import { Form, Input, Text, Btn, DropDown, Choices } from "../../components/Form";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "../../components/Alert";
import API from "../../utilities/API";
import getJwt from "../../helpers/jwt";
import Loading from "../../components/loading/loading";

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      assignment: "",
      kind: "",
      description: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      open: false,
      message: "",
      severity: "",
    };
  }
  componentDidMount() {
    const jwt = getJwt();
    if (!jwt) {
      this.props.history.push("/");
    }
    API.userPortal(jwt)
      .then((res) => {
        this.setState({
          user: res.data,
        });
      })
      .catch((err) => {
        this.props.history.push("/");
      });
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    const schoolwork = {
      _id: this.state.user.id,
      assignment: this.state.assignment,
      kind: this.state.kind,
      description: this.state.description,
      isStudent: true,
    };
    console.log(schoolwork);
    API.addHomework(schoolwork).then((err, res) => {
      if (err) {
        this.setState({
          message: "Assignment Not Added",
          severity: "error",
          open: true,
        });
      }
      this.setState({
        assignment: "",
        kind: "",
        description: "",
        message: "Assignment Added Successfully",
        severity: "success",
        open: true,
      });
    });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    this.setState({
      open: false,
    });
  };

  addStudent = (e) => {
    e.preventDefault();
    const student = {
      name: this.state.firstName,
      email: this.state.email,
      username: `${this.state.firstName} ${this.state.lastName}`,
      password: this.state.password,
      teacherId: this.state.user.id,
    };
    API.addStudent(student).then((err, res) => {
      if (err) {
        this.setState({
          open: true,
          severity: "error",
          message: "Student not added",
        });
      }
      this.setState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        open: true,
        severity: "success",
        message: "Student Added",
      });
    });
  };
  render() {
    if (this.state.user !== undefined) {
      return !this.state.user.student ? (
        <>
          <div className="title"></div>
          <div className="container">
            <div className="create">
              <Snackbar open={this.state.open} autoHideDuration={5000} onClose={this.handleClose}>
                <Alert onClose={this.handleClose} severity={this.state.severity}>
                  {this.state.message}
                </Alert>
              </Snackbar>
              <div className="create-title">Create a New Assignment</div>
              <Form className="form-container">
                <Input
                  className="create-input"
                  value={this.state.assignment}
                  onChange={this.handleInputChange}
                  name="assignment"
                  placeholder="Assignment name"
                />
                <DropDown name="kind" onChange={this.handleInputChange}>
                  <Choices value={this.state.kind}>--Please Choose an Option--</Choices>
                  <Choices value="exam">exam</Choices>
                  <Choices value="homework">homework</Choices>
                  <Choices value="quiz">quiz</Choices>
                </DropDown>
                <Text
                  value={this.state.description}
                  onChange={this.handleInputChange}
                  name="description"
                  placeholder="Description"
                />
                <Btn
                  disabled={!this.state.assignment || !this.state.description}
                  onClick={this.handleFormSubmit}
                  className="create-button"
                >
                  Create Assignment
                </Btn>
              </Form>
            </div>

            <div className="create">
              <div className="create-title">Create a Student Account</div>

              <Form className="form-container">
                <Input
                  className="create-input"
                  value={this.state.firstName}
                  onChange={this.handleInputChange}
                  name="firstName"
                  placeholder="First Name"
                />
                <Input
                  className="create-input"
                  value={this.state.lastName}
                  onChange={this.handleInputChange}
                  name="lastName"
                  placeholder="Last Name"
                />
                <Input
                  className="create-input"
                  value={this.state.email}
                  onChange={this.handleInputChange}
                  name="email"
                  placeholder="Student-Email"
                  type="email"
                  autoComplete="off"
                />
                <Input
                  className="create-input"
                  value={this.state.password}
                  onChange={this.handleInputChange}
                  name="password"
                  placeholder="Password"
                  type="password"
                  autoComplete="off"
                />
                <Btn
                  disabled={!this.state.firstName || !this.state.lastName || !this.state.password}
                  onClick={this.addStudent}
                  className="create-button"
                >
                  Add Student
                </Btn>
              </Form>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="title">Create</div>
          <div className="container">
            <div className="create">
              <h3>Sorry {this.state.user.username}, you don't have access to this page</h3>
            </div>
          </div>
        </>
      );
    } else {
      return <Loading />;
    }
  }
}

export default Create;
