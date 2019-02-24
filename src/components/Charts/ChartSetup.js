import React, { Component, Fragment } from "react";

import "../../css/Charts/ChartSetup.css";

import Divider from "@material-ui/core/Divider";

import DataSetSetup from "./ChartSetup/DataSetSetup";
import SetsSetup from "./ChartSetup/SetsSetup";

class ChartSetup extends Component {
  render() {
    return (
      <div>
        <SetsSetup />
        <DataSetSetup />
      </div>
    );
  }
}

export default ChartSetup;
