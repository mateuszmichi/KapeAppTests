import React, { Component, PureComponent } from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
  Label,
  Legend,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import PropTypes from "prop-types";
import { find, filter } from "lodash";
import moment from "moment";
// imports
import { chartRangesFromConfig, dateTicks, regresion } from "./calculate";
// ant.design
import { Row, Col } from "antd";
// css
import "../../css/Charts/LineChart.css";

const settingsType = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  showTitle: PropTypes.bool.isRequired,
  showLegend: PropTypes.bool.isRequired
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
  description: PropTypes.string.isRequired,
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
  dataSpread,
  id,
  color,
  showAxis,
  side,
  unit,
  rangeFrom,
  rangeTo,
  rangeSpan,
  ...props
}) => {
  const { domainMin, domainMax, ticks } = chartRangesFromConfig(dataSpread, {
    rangeFrom,
    rangeTo,
    rangeSpan
  });
  return (
    <YAxis
      allowDataOverflow={true}
      yAxisId={id}
      hide={!showAxis}
      orientation={side}
      stroke={color}
      type="number"
      width={showDescription ? 60 : 45}
      domain={[domainMin, domainMax]}
      ticks={ticks}
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
};

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

const formatDate = timestamp =>
  moment.unix(timestamp / 1000).format("YYYY-MM-DD");
const formatHour = timestamp => moment.unix(timestamp / 1000).format("HH:mm");

class CustomizedXAxisTick extends PureComponent {
  render() {
    const { x, y, payload, withTime } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
          {formatDate(payload.value)}
        </text>
        {withTime && (
          <text x={0} y={16} dy={16} textAnchor="middle" fill="#666">
            {formatHour(payload.value)}
          </text>
        )}
      </g>
    );
  }
}

const xAxisHeight = (showDescription, withTime) =>
  30 + (showDescription ? 20 : 0) + (withTime ? 16 : 0);

const CustomXAxis = ({
  description,
  showDescription,
  color,
  withTime,
  datesNumber,
  timeSpread,
  ...props
}) => (
  <XAxis
    allowDataOverflow={true}
    padding={{
      left: 10,
      right: 30
    }}
    tick={<CustomizedXAxisTick withTime={withTime} />}
    interval={0}
    dataKey="time"
    type="number"
    stroke={color}
    height={xAxisHeight(showDescription, withTime)}
    domain={["dataMin", "dataMax"]}
    ticks={dateTicks(
      {
        dateFrom: Math.min(...timeSpread),
        dateTo: Math.max(...timeSpread)
      },
      datesNumber,
      withTime
    )}
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

const extractDataSource = path => {
  const tab = path.split("-");
  return tab[0];
};

const generateRegresionKey = (path, id) => `REG_${id}_${extractDataKey(path)}`;

const generateRegresionPath = (path, id) =>
  `${extractDataSource(path)}-${generateRegresionKey(path, id)}`;

const extractDataFromPath = (data, path) => {
  const sourceId = extractDataSource(path);
  return find(data, e => e.id === sourceId).data;
};

const extractDataKey = path => {
  const tab = path.split("-");
  return tab.pop();
};

const regresionSettings = {
  activeDot: false,
  lineWidth: 1,
  dashed: true,
  dashSpacing: 5,
  dashLength: 5
};

const CustomLine = ({
  yAxises,
  dataSet,
  description,
  showDescription,
  lineId,
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
    unit={(e => e && e.unit)(find(yAxises, e => e.id === axis))}
    name={description}
    lineId={lineId}
    isAnimationActive={false}
    strokeDasharray={dashed ? `${dashLength} ${dashSpacing}` : undefined}
    strokeWidth={lineWidth}
    type="monotone"
    stroke={lineColor}
    dot={false}
    activeDot={true}
    data={extractDataFromPath(dataSet, dataSource)}
    dataKey={extractDataKey(dataSource)}
    yAxisId={axis}
    {...props}
  />
);

const CustomTooltip = ({ active, payload, label, withTime, ...props }) => {
  if (active) {
    return (
      <div className="CustomTooltip">
        <div className="CTTime">
          {`${formatDate(label)} ${withTime ? `${formatHour(label)}` : ""}`}
        </div>
        {filter(payload, e => !e.dataKey.startsWith("REG_")).map((e, i) => (
          <div className="CTProperty" key={i}>
            <div className="CTFeature">{e.name}</div>
            <div className="CTValue">{`${e.payload[e.dataKey]} ${e.unit}`}</div>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const dataFromAxis = (data, usedData, axis) =>
  filter(usedData, e => e.axis === axis).reduce(
    (prev, used) => [
      ...prev,
      ...extractDataFromPath(data, used.dataSource).map(item =>
        Number.parseFloat(item[extractDataKey(used.dataSource)])
      )
    ],
    []
  );

const timeFromData = (data, usedData) =>
  usedData.reduce(
    (prev, used) => [
      ...prev,
      ...extractDataFromPath(data, used.dataSource).map(item =>
        Number.parseFloat(item.time)
      )
    ],
    []
  );

const generateRegresionValue = (dataSet, path) => {
  const xData = dataSet.map(e => parseFloat(e.time));
  const yData = dataSet.map(e => parseFloat(e[extractDataKey(path)]));
  return regresion(xData, yData);
};

const genRegresionValue = (dataSet, path, id) => {
  const { a, b } = generateRegresionValue(dataSet, path);
  return dataSet.map(item => ({
    ...item,
    [generateRegresionKey(path, id)]: a * item.time + b
  }));
};

const addRegresionValues = (data, usedData) => {
  usedData
    .filter(e => e.showRegresion)
    .forEach(({ dataSource, id }) => {
      const sourceId = extractDataSource(dataSource);
      const i = data.findIndex(e => e.id === sourceId);
      console.log("reg", i, data, usedData);
      data[i] = {
        ...data[i],
        data: genRegresionValue(data[i].data, dataSource, id)
      };
    });
};

const RegresionSummary = ({ data, usedData, withTime }) => {
  const calculate = filter(usedData, e => e.showRegresion).map(
    ({ dataSource, id, description }) => {
      const sourceId = extractDataSource(dataSource);
      const i = data.findIndex(e => e.id === sourceId);
      const { a, b } = generateRegresionValue(data[i].data, dataSource);
      return {
        description,
        a,
        begin: data[i].data[0].time,
        b: b + a * data[i].data[0].time
      };
    }
  );
  const msInHour = 1000 * 60 * 60;
  return calculate.length > 0 ? (
    <div className="RegresionSummary">
      <div className="Title">Regresja liniowa</div>
      <Row gutter={16}>
        {calculate.map((e, i) => (
          <Col span={12} key={i}>
            <div className="RegresionValue">
              <div className="CTProperty">
                <div className="CTFeature">Źródło danych</div>
                <div className="CTValue">{e.description}</div>
              </div>
              <div className="CTProperty">
                <div className="CTFeature">Wzór</div>
                <div className="CTValue">
                  {`( ${(
                    e.a * (withTime ? msInHour : msInHour * 24)
                  ).toExponential(4)} ) x czas + ${e.b.toFixed(2)}`}
                </div>
              </div>
              <div className="CTProperty">
                <div className="CTFeature">Jednostka</div>
                <div className="CTValue">
                  {`Czas liczony w ${withTime ? "godzinach" : "dobach"}`}
                </div>
              </div>
              <div className="CTProperty">
                <div className="CTFeature">Początek (czas = 0)</div>
                <div className="CTValue">
                  {moment
                    .unix(e.begin / 1000)
                    .format(withTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD")}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  ) : null;
};

class ResponsiveLineChart extends Component {
  static propTypes = {
    stopInteractive: PropTypes.bool,
    // Ustawienia
    chartConfig: PropTypes.shape(chartConfigType).isRequired,
    usedData: PropTypes.arrayOf(PropTypes.shape(usedDataType)).isRequired,
    data: PropTypes.arrayOf(PropTypes.shape(dataType)).isRequired
  };

  render() {
    console.log("passed to chart", this.props);
    const { stopInteractive, usedData, data, chartConfig } = this.props;
    const { xAxis, settings, yAxises } = chartConfig;
    const { height, width } = chartConfig.settings;

    addRegresionValues(data, usedData);
    console.log("after regresion", data);
    // console.log(
    //   "Wyliczenia dla wykresu",
    //   chartRangesFromConfing()
    // )
    // TODO!!!
    // Wyciagniecie danych z axis po data i dopiero przekazac
    return (
      <div className="LineChart">
        <div
          className="InnerChart"
          style={{
            width: `${width}%`
          }}
        >
          {settings.showTitle && (
            <div className="ChartTitle">{settings.title}</div>
          )}
          <ResponsiveContainer width={"100%"} aspect={width / height}>
            <LineChart data={data}>
              {!stopInteractive && (
                <Tooltip
                  content={<CustomTooltip withTime={xAxis.withTime} />}
                />
              )}
              {settings.showLegend && (
                <Legend
                  height={36}
                  verticalAlign="top"
                  paylodUniqBy={({ payload }) => payload.lineId}
                />
              )}
              <CartesianGrid vertical={false} strokeDasharray="5 5" />
              {CustomXAxis({
                ...xAxis,
                timeSpread: timeFromData(data, usedData)
              })}
              {// WONTFIX recharts ma problem z przeciazaniem komponentow
              yAxises.map(yAxis =>
                CustomYAxis({
                  ...yAxis,
                  key: `yAxis-${yAxis.id}`,
                  dataSpread: dataFromAxis(data, usedData, yAxis.id)
                })
              )}
              {filter(usedData, e => e.showRegresion).map(
                ({ id, dataSource, ...used }) =>
                  CustomLine({
                    yAxises,
                    ...used,
                    dataSource: generateRegresionPath(dataSource, id),
                    lineId: id,
                    regresion: true,
                    dataSet: data,
                    key: `regresionLine-${id}`,
                    ...regresionSettings
                  })
              )}
              {usedData.map(({ id, ...used }) =>
                CustomLine({
                  yAxises,
                  ...used,
                  lineId: id,
                  dataSet: data,
                  key: `usedData-${id}`
                })
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <RegresionSummary
          data={data}
          usedData={usedData}
          withTime={xAxis.withTime}
        />
      </div>
    );
  }
}

export default ResponsiveLineChart;
