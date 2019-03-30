import React from "react";
// imported elements
// css
import "../../css/Common/VisibilitySwitch.css";
// ant.design

const VisibilitySwitch = ({ visible, ...props }) => (
  <div className={visible ? "Visible" : "Hidden"} {...props} />
);

export default VisibilitySwitch;
