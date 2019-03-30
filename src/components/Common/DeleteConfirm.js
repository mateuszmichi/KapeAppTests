import React from "react";
// imported elements
// css
import "../../css/Common/DeleteConfirm.css";
// ant.design
import { Popconfirm } from "antd";

const DeleteConfirm = ({ title, ...props }) => (
  <Popconfirm
    title={<div className="PopConfirm">{title}</div>}
    okText="Tak"
    cancelText="Nie"
    {...props}
  />
);

export default DeleteConfirm;
