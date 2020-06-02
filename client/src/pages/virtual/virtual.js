import React from "react";
import "./style.css";
import Chat from "../../components/chat/index";
import Video from "../../components/Video";
import Active from "../../components/ActiveStudents/active";

function Virtual() {
  return (
    <>
      <div className="virtual">
        <Active />
        <Video />
        <Chat />
      </div>
    </>
  );
}

export default Virtual;
