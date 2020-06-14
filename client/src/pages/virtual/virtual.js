import React from "react";
import "./style.css";
// import Chat from "../../components/chat/index";
import Room from "../../components/Video";
import { v1 as uuid } from "uuid";
// import Active from "../../components/ActiveStudents/active";

function Virtual() {
  function roomId() {
    const id = uuid();
    return id;
  }
  return (
    <>
      <div className="virtual">
        {/* <Active /> */}
        <Room roomId={roomId} />
        {/* <Chat /> */}
      </div>
    </>
  );
}

export default Virtual;
