import React from "react";
// imported elements
// css
import "../../css/Common/Upload.css";
// ant.design
import { Upload } from "antd";

const dummyRequest = ({ file, onSuccess, onError }, validator) => {
  setTimeout(() => {
    if (!validator || validator(file)) {
      onSuccess("ok");
    } else {
      onError("bad");
    }
  }, 0);
};

const CustomUpload = ({ validator, ...props }) => (
  <Upload customRequest={arg => dummyRequest(arg, validator)} {...props} />
);

const CustomDragger = ({ validator, ...props }) => (
  <Upload.Dragger
    customRequest={arg => dummyRequest(arg, validator)}
    {...props}
  />
);

export default Object.assign(CustomUpload, {
  Dragger: CustomDragger
});
