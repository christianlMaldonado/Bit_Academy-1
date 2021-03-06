import React, { Component } from "react";
import API from "../../utilities/API";
import { db } from "../../services/firebase";
import getJwt from "../../helpers/jwt";
import "./style.css";
import { withRouter } from "react-router-dom";
import { Text, Form, Btn } from "../Form";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      chats: [],
      content: "",
      readError: null,
      writeError: null,
      loadingChats: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.myRef = React.createRef();
  }

  async componentDidMount() {
    const jwt = getJwt();
    if (!jwt) {
      this.props.history.push("/");
    }
    await API.userPortal(jwt)
      .then((res) => {
        console.log(res.data);
        this.setState({
          user: res.data,
          readError: null,
          loadingChats: true,
        });
      })
      .catch((err) => {
        this.props.history.push("/");
      });

    const chatArea = this.myRef.current;
    try {
      db.ref("chats").on("value", (snapshot) => {
        let chats = [];
        snapshot.forEach((snap) => {
          chats.push(snap.val());
        });
        chats.sort(function(a, b) {
          return a.timestamp - b.timestamp;
        });
        this.setState({ ...this.state, chats });
        chatArea.scrollBy(0, chatArea.scrollHeight);
        this.setState({ ...this.state, loadingChats: false });
      });
    } catch (error) {
      this.setState({ readError: error.message, loadingChats: false });
    }
  }

  handleChange(event) {
    this.setState({
      ...this.state,
      content: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    console.log("This button is pressed!");
    this.setState({ ...this.state, writeError: null });
    const chatArea = this.myRef.current;
    try {
      await db.ref("chats").push({
        content: this.state.content,
        timestamp: Date.now(),
        uid: this.state.user,
      });
      this.setState({ ...this.state, content: "" });
      chatArea.scrollBy(0, chatArea.scrollHeight);
    } catch (error) {
      this.setState({ writeError: error.message });
    }
  }

  formatTime(timestamp) {
    const d = new Date(timestamp);
    const time = `${d.getDate()}/${d.getMonth() +
      1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return time;
  }

  render() {
    // if (this.state.user !== undefined) {
    return (
      <>
        <div className="chat-container">
          <div className="chat-area" ref={this.myRef}>
            {/* loading indicator */}
            {this.state.loadingChats ? (
              <div className="spinner-border text-success" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              ""
            )}
            {/* chat area */}
            {this.state.chats.map((chat) => {
              return (
                <p
                  key={chat.timestamp}
                  className={"chat-bubble " + (this.state.user === chat.uid ? "current-user" : "")}
                >
                  {chat.uid} {" : "}
                  {chat.content}
                  <br />
                  <span className="chat-time float-right">{this.formatTime(chat.timestamp)}</span>
                </p>
              );
            })}
          </div>
          <Form onSubmit={this.handleSubmit} className="mx-3">
            <Text
              className="form-control"
              name="content"
              onChange={this.handleChange}
              value={this.state.content}
            ></Text>
            {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
            <Btn type="submit" className="btn btn-submit px-5 mt-4 chat-submit">
              Send
            </Btn>
          </Form>
          <div className="py-5 mx-3">
            Logged in as: <strong className="text-info">{this.state.user.username}</strong>
          </div>
        </div>
      </>
    );
  }
  // }
}
export default withRouter(Chat);
