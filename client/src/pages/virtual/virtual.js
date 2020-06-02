import React from "react";
import "./style.css";
import Chat from "../../components/chat/index";
import Video from "../../components/Video";

function Virtual() {
  return (
    <>
      <div className="title"></div>
      <div className="virtual">
        <Video />
        <Chat />
      </div>
    </>
  );
}

export default Virtual;
