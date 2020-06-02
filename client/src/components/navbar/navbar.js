import React, { Component } from "react";
import "./style.css";
import logout from "../../helpers/logout";

class Navbar extends Component {
  handleScroll = (e) => {
    let element = e.target;
    if (element.scrollHeight === element.clientHeight) {
      // do something at end of scroll
    }
  };
  render() {
    return (
      <>
        <div className="bitAcademy">
          <img
            alt="title"
            className="title-logo"
            src={process.env.PUBLIC_URL + "/images/Title.png"}
          />
        </div>
        <div className="web-nav z-depth-2">
          <ul>
            {" "}
            <a href="/home">
              <li>
                <i className="fa fa-home"></i> &nbsp; Home
              </li>{" "}
            </a>
            <a href="/grades">
              <li>
                <i className="fa fa-check-square"></i> &nbsp; Grades
              </li>
            </a>
            <a href="/attendance">
              <li>
                <i className="fa fa-calendar"></i> &nbsp; Attendance
              </li>
            </a>
            <a href="/assignments">
              <li>
                <i className="fa fa-pencil"></i> &nbsp; Assignments
              </li>
            </a>
            <a href="/virtual">
              <li>
                <i className="fa fa-comments"></i>&nbsp; Virtual Classroom
              </li>
            </a>
            <a href="/fieldtrip">
              <li>
                <i className="fa fa-suitcase"></i>&nbsp; Virtual Field Trip
              </li>
            </a>
            <a href="/" onClick={logout}>
              <li>
                <i className="fa fa-sign-out"></i> &nbsp; Sign Out
              </li>
            </a>
          </ul>
        </div>
      </>
    );
  }
}

export default Navbar;
