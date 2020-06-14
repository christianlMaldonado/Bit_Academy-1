import React from "react";
import { motion } from "framer-motion";

const FieldTrips = (props) => {
  return <motion.div {...props}>{props.children}</motion.div>;
};

export default FieldTrips;
