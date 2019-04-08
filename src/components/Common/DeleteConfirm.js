import React from "react";
// imported elements
// css
import "../../css/Common/DeleteConfirm.css";
// ant.design
import { Popconfirm, Tooltip } from "antd";

const DeleteConfirm = ({
  title,
  canRemove,
  remove,
  reason,
  children,
  ...props
}) => (
  <Tooltip
    placement="top"
    arrowPointAtCenter
    title={canRemove ? remove : reason}
  >
    {canRemove ? (
      <Popconfirm
        placement="top"
        title={<div className="PopConfirm">{title}</div>}
        okText="Tak"
        cancelText="Nie"
        {...props}
      >
        {children}
      </Popconfirm>
    ) : (
      children
    )}
  </Tooltip>
);

export default DeleteConfirm;
