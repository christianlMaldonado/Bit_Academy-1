import React from "react";
import "./style.css";
import FieldTrips from "../../components/FieldTrips";

function Fieldtrip() {
  return (
    <>
      <div className="title">Field Trips</div>
      <div>
        <FieldTrips
          className="fieldtrip"
          animate={{ scale: [1, 1.2, 1, 0.8, 1], rotateY: [0, 90, 180, 270, 360] }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            time: [0, 0.2, 0.5, 0.8, 1],
            loop: Infinity,
            repeatDelay: 0.75,
          }}
        >
          <h4 className="coming-soon">Coming Soon</h4>
        </FieldTrips>
      </div>
    </>
  );
}

export default Fieldtrip;
