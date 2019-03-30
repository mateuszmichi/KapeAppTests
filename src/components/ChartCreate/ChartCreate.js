import React, { Component } from "react";
// css
import "../../css/ChartCreate.css";
// imported elements
import ChartSetup from "./ChartSetup/ChartSetup";
import ResponsiveLineChart from "../Charts/LineChart";
// ant.design
import { Row, Col, Empty } from "antd";

const defaultChartConfig = {
  settings: {
    title: {
      value: ""
    },
    showTitle: {
      value: false
    },
    height: {
      value: 60
    },
    width: {
      value: 100
    }
  },
  xAxis: {
    description: {
      value: "Czas"
    },
    showDescription: {
      value: true
    },
    color: {
      value: "black"
    },
    datesNumber: {
      value: 5
    },
    withTime: {
      value: false
    }
  },
  yAxises: {
    0: {
      color: {
        value: "black"
      },
      showAxis: {
        value: true
      },
      side: {
        value: "left"
      },
      description: {
        value: "Oś Y"
      },
      showDescription: {
        value: false
      },
      unit: {
        value: ""
      },
      rangeFrom: {
        value: "auto"
      },
      rangeTo: {
        value: "auto"
      },
      rangeSpan: {
        value: "auto"
      }
    }
  }
};

class ChartCreate extends Component {
  state = {
    loadedData: {},
    usedData: {},
    chartConfig: Object.assign({}, defaultChartConfig)
  };

  update = (key, newValue) => {
    console.log(`UPDATING: ${key}`, newValue);
    this.setState({
      [key]: newValue
    });
  };

  mapSetupToChart = ({ loadedData, usedData, chartConfig }) => {
    console.log("loadedData", loadedData);
    console.log("usedData", usedData);
    console.log("chartConfig", chartConfig);
    return {
      usedData: Object.keys(usedData).reduce(
        (result, key) => [
          ...result,
          Object.keys(usedData[key].fields).reduce(
            (prev, fieldKey) => ({
              ...prev,
              [fieldKey]: usedData[key].fields[fieldKey].value
            }),
            { id: key }
          )
        ],
        []
      ),
      chartConfig: {
        settings: Object.keys(chartConfig.settings).reduce(
          (prev, fieldKey) => ({
            ...prev,
            [fieldKey]: chartConfig.settings[fieldKey].value
          }),
          {}
        ),
        xAxis: Object.keys(chartConfig.xAxis).reduce(
          (prev, fieldKey) => ({
            ...prev,
            [fieldKey]: chartConfig.xAxis[fieldKey].value
          }),
          {}
        ),
        yAxises: Object.keys(chartConfig.yAxises).reduce(
          (result, key) => [
            ...result,
            Object.keys(chartConfig.yAxises[key]).reduce(
              (prev, fieldKey) => ({
                ...prev,
                [fieldKey]: chartConfig.yAxises[key][fieldKey].value
              }),
              { id: key }
            )
          ],
          []
        )
      },
      data: Object.keys(loadedData).reduce(
        (prev, key) => [...prev, { id: key, data: loadedData[key].data }],
        []
      )
    };
  };

  render() {
    const mapSetupResult = this.mapSetupToChart(this.state);
    return (
      <div className="ChartCreate">
        <Row>
          <Col span={8}>
            <ChartSetup update={this.update} {...this.state} />
          </Col>
          <Col span={16}>
            <div className="ChartPresentation">
              {Object.keys(mapSetupResult.usedData).length > 0 ? (
                <ResponsiveLineChart
                  stopInteractive={true}
                  width="100%"
                  height={300}
                  {...mapSetupResult}
                />
              ) : (
                <Empty
                  image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                  description={
                    <span>
                      Tutaj powstanie wykres
                      <br />
                      Pobierz dane i wybierz ich formę prezentacji
                    </span>
                  }
                />
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ChartCreate;
