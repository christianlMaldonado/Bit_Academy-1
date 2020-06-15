import React, { Component } from "react";
import { Container, Tbl, TBody, Row, Header, Cell } from "../../components/tables/index";
import Paper from "@material-ui/core/Paper";
import Loading from "../../components/loading/loading";
import API from "../../utilities/API";
import getJwt from "../../helpers/jwt";
import averageGrades from "../../helpers/gpa";
import "./style.css";

class Grades extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      students: undefined,
    };
    this.seeGrades = this.seeGrades.bind(this);
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
        this.seeGrades(this.state.user.id);
      })
      .catch((err) => {
        localStorage.removeItem("id_token");
        this.props.history.push("/");
      });
  }

  // get assignments of students
  seeGrades = (id) => {
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
            <div className="grades">
              <div className="table-container">
                {this.state.user.student ? (
                  <Container component={Paper}>
                    <Tbl>
                      <Header>
                        <Row>
                          <Cell>
                            <b>Assignment</b>
                          </Cell>
                          <Cell>
                            <b>Assignment Type</b>
                          </Cell>
                          <Cell>
                            <b>Link</b>
                          </Cell>
                          <Cell align="right">
                            <b>Grade</b>
                          </Cell>
                        </Row>
                      </Header>
                      <TBody>
                        {this.state.user.classwork.map((homework) => (
                          <Row key={homework.assignment._id}>
                            <Cell>
                              <b key={homework.assignment.name}>{homework.assignment.name}</b>
                            </Cell>
                            <Cell>
                              <b key={homework.assignment.kind}>{homework.assignment.kind}</b>
                            </Cell>
                            <Cell>
                              <b key={homework.assignment.link}>{homework.assignment.link}</b>
                            </Cell>
                            <Cell align="right">
                              <b key={homework.assignment.grade}>{homework.assignment.grade}%</b>
                            </Cell>
                          </Row>
                        ))}
                        <Row>
                          <Cell></Cell>
                          <Cell></Cell>
                          <Cell>
                            <b>Average</b>
                          </Cell>
                          <Cell align="right">
                            <b>{averageGrades(this.state.user.classwork)}%</b>
                          </Cell>
                        </Row>
                      </TBody>
                    </Tbl>
                  </Container>
                ) : (
                  <>
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
                              <b>Assignment Type</b>
                            </Cell>
                            <Cell>
                              <b>Link</b>
                            </Cell>
                            <Cell align="right">
                              <b>Grade</b>
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
                                    <b>{assignment.assignment.kind}</b>
                                  </Cell>
                                  <Cell>
                                    <b>{assignment.assignment.link}</b>
                                  </Cell>
                                  <Cell align="right">
                                    <b>{assignment.assignment.grade}%</b>
                                  </Cell>
                                </Row>
                              ));
                            })
                          ) : (
                            <Row />
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

export default Grades;
