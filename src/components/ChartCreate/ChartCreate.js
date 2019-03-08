import React, { Component } from "react";
// css
import "../../css/ChartCreate.css";
// imported elements
import ChartSetup from "./ChartSetup/ChartSetup";
// ant.design
import { Row, Col } from "antd";

const defaultChartConfig = {
  title: "",
  xAxis: {
    description: "Czas",
    dateTime: {
      number: 4,
      showOdd: false,
      treatAsDate: true
    }
  },
  yAxises: [
    {
      side: "left",
      description: "",
      axisName: "1",
      unit: "",
      styling: {},
      range: {
        from: "auto",
        to: "auto",
        span: 0,
        showOdd: false
      }
    }
  ]
};

class ChartCreate extends Component {
  state = {
    loadedData: {},
    usedData: {},
    chartConfig: Object.assign(defaultChartConfig)
  };

  update = (key, newValue) => {
    console.log(`UPDATING: ${key}`, newValue);
    this.setState({
      [key]: newValue
    });
  };

  render() {
    const { loadedData, usedData, chartConfig } = this.state;
    return (
      <div className="ChartCreate">
        <Row>
          <Col span={8}>
            <ChartSetup
              update={this.update}
              loadedData={loadedData}
              usedData={usedData}
              chartConfig={chartConfig}
            />
          </Col>
          <Col span={16}>
            <div>TODO</div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ChartCreate;
