import React, { Component } from "react";
import "./style.css";
// import { Form, Btn } from "../../components/Form";
import { Container, Tbl, TBody, Row, Header, Cell } from "../../components/tables/index";
import Paper from "@material-ui/core/Paper";
import API from "../../utilities/API";
import getJwt from "../../helpers/jwt";
import Loading from "../../components/loading/loading";

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      students: undefined,
      checkedIn: undefined,
    };
    this.studentCheckIn = this.studentCheckIn.bind(this);
    this.takeAttendance = this.takeAttendance.bind(this);
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
        this.takeAttendance(this.state.user.id);
      })
      .catch((err) => {
        this.props.history.push("/");
      });
  }

  studentCheckIn = () => {
    const studentCheckIn = {
      name: this.state.user.username,
    };
    API.checkIn(studentCheckIn).then((res) => {
      this.setState({
        checkedIn: true,
      });
    });
  };

  takeAttendance = (id) => {
    API.getStudents(id).then((res) => {
      this.setState({
        students: res.data,
      });
    });
  };

  render() {
    if (this.state.user !== undefined) {
      return (
        <>
          <div className="title"></div>
          <div className="container">
            <div className="attendance">
              <div className="table-container">
                {this.state.user.student ? (
                  !this.state.checkedIn ? (
                    <button
                      className="check-in btn-floating pulse btn-large"
                      onClick={this.studentCheckIn}
                    >
                      Check In
                    </button>
                  ) : (
                    <h3>You are checked in already!</h3>
                  )
                ) : (
                  <>
                    <Container component={Paper}>
                      <Tbl>
                        <Header>
                          <Row>
                            <Cell>
                              <b>Student</b>
                            </Cell>
                            <Cell align="right">
                              <b>Present</b>
                            </Cell>
                          </Row>
                        </Header>
                        <TBody>
                          {this.state.students ? (
                            this.state.students.map((student) => (
                              <Row key={student._id}>
                                <Cell>
                                  <b>{student.username}</b>
                                </Cell>
                                <Cell align="right">
                                  <b>
                                    {student.attendance.map((present) => (
                                      <p key={present._id}>{present.attendance.date}</p>
                                    ))}
                                  </b>
                                </Cell>
                              </Row>
                            ))
                          ) : (
                            <Row>
                              <Cell>
                                <b>No Students To Check</b>
                              </Cell>
                            </Row>
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

export default Attendance;
