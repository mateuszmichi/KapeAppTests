import React, { Component } from "react";
import { LineChart, XAxis, YAxis, Line, CartesianGrid, Label } from "recharts";
import PropTypes from "prop-types";
import TestDataGenerator from "../../generators/TestDataGenerator";

const data = TestDataGenerator();

const styling = {
  color: PropTypes.string,
  strokeWidth: PropTypes.number,
  isDashed: PropTypes.bool
};

class LineCharts extends Component {
  static propTypes = {
    stopInteractive: PropTypes.bool,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    title: PropTypes.string,
    data: PropTypes.array,
    chartConfig: PropTypes.shape({
      usedData: PropTypes.arrayOf(
        PropTypes.shape({
          path: PropTypes.string.isRequired,
          axisName: PropTypes.string.isRequired,
          styling: PropTypes.shape(styling),
          label: PropTypes.shape({
            description: PropTypes.string.isRequired
          }),
          // Zarezerwowane dla przyszłości
          regresion: PropTypes.object
        })
      ),
      xAxis: PropTypes.shape({
        description: PropTypes.string,
        dateTime: PropTypes.shape({
          number: PropTypes.number,
          showOdd: PropTypes.bool,
          treatAsDate: PropTypes.bool
        })
      }),
      yAxises: PropTypes.arrayOf(
        PropTypes.shape({
          side: PropTypes.oneOf(["right", "left"]),
          description: PropTypes.string,
          axisName: PropTypes.string,
          unit: PropTypes.string,
          styling: PropTypes.shape(styling),
          range: PropTypes.shape({
            from: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            to: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            span: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            showOdd: PropTypes.bool
          })
        })
      )
    })
  };

  extract_data_from_path = path => {
    const tab = path.split(".");
    let data = this.props.data[tab[0]];
    for (let i = 1; i < tab.lenght - 1; i++) {
      data = data[tab[i]];
    }
    return data;
  };

  extract_data_key = path => {
    const tab = path.split(".");
    return tab.pop();
  };

  render() {
    const { usedData, xAxis } = this.props.chartConfig;
    return (
      <LineChart
        width={this.props.width}
        height={this.props.height}
        data={data}
      >
        {usedData.map((e, i) => (
          <Line
            type="monotone"
            dot={false}
            data={this.extract_data_from_path(e.path)}
            dataKey={this.extract_data_key(e.path)}
            yAxisId={e.axisName || 0}
          />
        ))}
        <XAxis dataKey="time">
          {xAxis && <Label value={xAxis.description} />}
        </XAxis>
        <YAxis stroke="#347812">
          <Label
            value="Temperatura [oC]"
            offset={0}
            position="insideLeft"
            style={{}}
          />
        </YAxis>
        <CartesianGrid />
      </LineChart>
    );
  }
}

export default LineCharts;
