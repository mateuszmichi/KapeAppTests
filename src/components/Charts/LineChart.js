import React, { Component } from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
  Label,
  Legend,
  ResponsiveContainer
} from "recharts";
import PropTypes from "prop-types";
import { find } from "lodash";
import { Tooltip } from "antd";
// css
import "../../css/Charts/LineChart.css";

const settingsType = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  showTitle: PropTypes.bool.isRequired
};

const withDescriptionType = {
  description: PropTypes.string.isRequired,
  showDescription: PropTypes.bool.isRequired
};
const withIdType = {
  id: PropTypes.string.isRequired
};

const xAxisType = {
  ...withDescriptionType,
  withTime: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  datesNumber: PropTypes.number.isRequired
};

const yAxisType = {
  ...withDescriptionType,
  ...withIdType,
  color: PropTypes.string.isRequired,
  showAxis: PropTypes.bool.isRequired,
  side: PropTypes.oneOf(["left", "right"]),
  unit: PropTypes.string.isRequired,
  rangeFrom: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  rangeTo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  rangeSpan: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired
};

const usedDataType = {
  ...withDescriptionType,
  ...withIdType,
  axis: PropTypes.string.isRequired,
  dashed: PropTypes.bool.isRequired,
  dashSpacing: PropTypes.number,
  dashLength: PropTypes.number,
  dataSource: PropTypes.string.isRequired,
  lineColor: PropTypes.string.isRequired,
  lineWidth: PropTypes.number.isRequired
};

const dataType = {
  ...withIdType,
  data: PropTypes.array.isRequired
};

const chartConfigType = {
  settings: PropTypes.shape(settingsType).isRequired,
  xAxis: PropTypes.shape(xAxisType).isRequired,
  yAxises: PropTypes.arrayOf(PropTypes.shape(yAxisType).isRequired).isRequired
};

const CustomYAxis = ({
  description,
  showDescription,
  id,
  color,
  showAxis,
  side,
  unit,
  rangeFrom,
  rangeTo,
  rangeSpan,
  ...props
}) => (
  <YAxis
    yAxisId={id}
    hide={!showAxis}
    orientation={side}
    stroke={color}
    type="number"
    // domain TODO
    label={
      showDescription
        ? props => (
            <CustomYLabel
              description={description}
              color={color}
              unit={unit}
              side={side}
              {...props}
            />
          )
        : undefined
    }
    {...props}
  />
);

const CustomYLabel = ({ description, side, unit, color, ...props }) => {
  const { x, y, height, width } = props.viewBox;
  const customWidth = 20;
  const nx = side === "right" ? x + width - customWidth : x;
  return (
    <g transform={`translate(${nx}, ${y})`}>
      <foreignObject width={customWidth} height={height}>
        <div className="CustomLabel" style={{ color }}>
          <div className="CustomLabelInner">
            <div className="CustomLabelRotate">
              {description}
              {unit && ` [${unit}]`}
            </div>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};
const CustomXLabel = ({ description, color, ...props }) => {
  const { x, y, height, width } = props.viewBox;
  const customHeight = 20;
  const ny = y + height - customHeight;
  return (
    <g transform={`translate(${x}, ${ny})`}>
      <foreignObject height={customHeight} width={width}>
        <div className="CustomLabel" style={{ color }}>
          <div className="CustomLabelInner">
            <div className="CustomLabelTransform">{description}</div>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

const CustomXAxis = ({
  description,
  showDescription,
  color,
  withTime,
  datesNumber,
  ...props
}) => (
  <XAxis
    dataKey="time"
    type="number"
    stroke={color}
    height={showDescription ? 45 : 30}
    label={
      showDescription
        ? props => (
            <CustomXLabel description={description} color={color} {...props} />
          )
        : undefined
    }
    {...props}
  />
);

const extractDataFromPath = (data, path) => {
  const tab = path.split("-");
  const sourceId = tab[0];
  const result = find(data, e => e.id === sourceId).data;
  return console.log(result) || result;
};

const extractDataKey = path => {
  const tab = path.split("-");
  return tab.pop();
};

const CustomLine = ({
  dataSet,
  description,
  showDescription,
  axis,
  dashed,
  dashSpacing,
  dashLength,
  dataSource,
  lineColor,
  lineWidth,
  ...props
}) => (
  <Line
    isAnimationActive={false}
    strokeDasharray={dashed ? `${dashLength} ${dashSpacing}` : undefined}
    strokeWidth={lineWidth}
    type="monotone"
    stroke={lineColor}
    dot={false}
    data={extractDataFromPath(dataSet, dataSource)}
    dataKey={extractDataKey(dataSource)}
    yAxisId={axis}
    {...props}
  />
);

class ResponsiveLineChart extends Component {
  static propTypes = {
    stopInteractive: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    // Ustawienia
    chartConfig: PropTypes.shape(chartConfigType).isRequired,
    usedData: PropTypes.arrayOf(PropTypes.shape(usedDataType)).isRequired,
    data: PropTypes.arrayOf(PropTypes.shape(dataType)).isRequired
  };

  render() {
    console.log("passed to chart", this.props);
    const { stopInteractive, usedData, data, chartConfig } = this.props;
    const { xAxis, settings, yAxises } = chartConfig;
    return (
      <div className="LineChart">
        {settings.showTitle && (
          <div className="ChartTitle">{settings.title}</div>
        )}
        <ResponsiveContainer
          width={this.props.width}
          height={this.props.height}
        >
          <LineChart data={data}>
            <Legend />
            <CartesianGrid />
            {CustomXAxis(xAxis)}
            {// WONTFIX recharts ma problem z przeciazaniem komponentow
            yAxises.map(yAxis =>
              CustomYAxis({
                ...yAxis,
                key: `yAxis-${yAxis.id}`
              })
            )}
            {usedData.map(({ id, ...used }) =>
              CustomLine({
                ...used,
                dataSet: data,
                key: `usedData-${id}`
              })
            )}
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default ResponsiveLineChart;
