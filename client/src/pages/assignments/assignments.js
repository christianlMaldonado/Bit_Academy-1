import React, { Component } from "react";
import "./style.css";
import { Container, Tbl, TBody, Row, Header, Cell } from "../../components/tables/index";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  TextField,
  Snackbar,
} from "@material-ui/core";
import Alert from "../../components/Alert";
import API from "../../utilities/API";
import getJwt from "../../helpers/jwt";
import Loading from "../../components/loading/loading";

class Assignments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      link: "",
      students: undefined,
      grade: 0,
      message: "",
      open: false,
      severity: "",
      openDialog: false,
      studentName: "",
      assignmentName: "",
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.seeAssignments = this.seeAssignments.bind(this);
    this.submitGrade = this.submitGrade.bind(this);
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
        this.seeAssignments(this.state.user.id);
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

  handleSubmit = (id) => {
    const homeworkLink = {
      id,
      link: this.state.link,
      user: this.state.user.username,
    };
    API.submitHomework(homeworkLink).then((err, res) => {
      if (err) {
        this.setState({
          message: "Retry submitting link",
          severity: "error",
          open: true,
        });
      }
      this.setState({
        link: "",
        message: "Homework Submitted",
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

  handleOpenDialog = () => {
    this.setState({ openDialog: true });
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  seeAssignments = (id) => {
    API.getStudents(id).then((res) => {
      this.setState({
        students: res.data,
      });
    });
  };

  submitGrade = (student) => {
    const homework = {
      student: student.username,
      assignment: student.assignment,
      grade: student.grade,
    };
    API.gradeAssignment(homework).then((err, res) => {
      if (err) {
        this.setState({
          message: "Grade update failed",
          severity: "error",
          open: true,
        });
      }
      this.setState({
        grade: 0,
        message: "Grade Updated",
        severity: "success",
        open: true,
        openDialog: false,
        studentName: "",
        assignmentName: "",
      });
    });
  };

  render() {
    if (this.state.user !== undefined) {
      return (
        <>
          <div className="title"></div>
          <div className="container">
            <div className="assignments">
              <div className="table-container">
                <Snackbar open={this.state.open} autoHideDuration={5000} onClose={this.handleClose}>
                  <Alert onClose={this.handleClose} severity={this.state.severity}>
                    {this.state.message}
                  </Alert>
                </Snackbar>
                {this.state.user.student ? (
                  <Container component={Paper}>
                    <Tbl>
                      <Header>
                        <Row>
                          <Cell>
                            <b>Assignment</b>
                          </Cell>
                          <Cell align="left">
                            <b>Link</b>
                          </Cell>
                          <Cell align="right">
                            <b>Description</b>
                          </Cell>
                        </Row>
                      </Header>

                      <TBody>
                        {this.state.user.classwork.map((homework) => (
                          <Row key={homework._id}>
                            <Cell key={homework.assignment.name}>
                              <b>{homework.assignment.name}</b>
                            </Cell>
                            <Cell align="left">
                              <TextField
                                onChange={(event) => this.handleInputChange(event)}
                                required
                                fullWidth
                                label="Link"
                                name="link"
                              />
                              <Button
                                onClick={() => this.handleSubmit(homework._id)}
                                fullWidth
                                variant="contained"
                                color="primary"
                                className="submitLogin"
                              >
                                Link
                              </Button>
                            </Cell>
                            <Cell align="right" key={homework.assignment.description}>
                              <b>{homework.assignment.description}</b>
                            </Cell>
                          </Row>
                        ))}
                      </TBody>
                    </Tbl>
                  </Container>
                ) : (
                  <>
                    <Dialog
                      open={this.state.openDialog}
                      onClose={this.handleCloseDialog}
                      maxWidth="lg"
                    >
                      <DialogTitle>Submit Grade</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Enter the student, assignment name, and grade.
                        </DialogContentText>
                        <TextField
                          label="student"
                          type="text"
                          name="studentName"
                          value={this.state.studentName}
                          onChange={(event) => this.handleInputChange(event)}
                          fullWidth
                          required
                        />
                        <br />
                        <TextField
                          label="assignment"
                          type="text"
                          name="assignmentName"
                          value={this.state.assignmentName}
                          onChange={(event) => this.handleInputChange(event)}
                          fullWidth
                          required
                        />
                        <br />
                        <TextField
                          label="grade"
                          type="number"
                          name="grade"
                          value={this.state.grade}
                          onChange={(event) => this.handleInputChange(event)}
                          fullWidth
                          required
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.handleCloseDialog}>Cancel</Button>
                        <Button
                          onClick={() =>
                            this.submitGrade({
                              username: this.state.studentName,
                              assignment: this.state.assignmentName,
                              grade: this.state.grade,
                            })
                          }
                        >
                          Sumbit
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Container component={Paper}>
                      <Tbl>
                        <Header>
                          <Row>
                            <Cell>
                              <b>Student</b>
                            </Cell>
                            <Cell>
                              <b>Assignment</b>
                            </Cell>
                            <Cell>
                              <b>Link</b>
                            </Cell>
                            <Cell align="right">
                              <b>Input Grade</b>
                            </Cell>
                          </Row>
                        </Header>
                        <TBody>
                          {this.state.students ? (
                            this.state.students.map((student) => {
                              return student.classwork.map((assignment) => (
                                <Row key={assignment._id}>
                                  <Cell>
                                    <b>{student.username}</b>
                                  </Cell>
                                  <Cell>
                                    <b>{assignment.assignment.name}</b>
                                  </Cell>
                                  <Cell>
                                    <b>{assignment.assignment.link}</b>
                                  </Cell>
                                  <Cell align="right">
                                    <Button variant="outlined" onClick={this.handleOpenDialog}>
                                      Add Grade
                                    </Button>
                                  </Cell>
                                </Row>
                              ));
                            })
                          ) : (
                            <Row></Row>
                          )}
                        </TBody>
                      </Tbl>
                    </Container>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return <Loading />;
    }
  }
}

export default Assignments;
