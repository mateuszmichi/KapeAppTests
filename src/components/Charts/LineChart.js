import React, { Component, PureComponent } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import PropTypes from "prop-types";
import { filter, find, isNil } from "lodash";
import moment from "moment";
// imports
import { chartRangesFromConfig, dateTicks, regresion } from "./calculate";
import { MathParser } from "./converter";
// ant.design
import { Col, Row } from "antd";
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
const withXKeyType = {
  xKey: PropTypes.string.isRequired
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

const chartConfigType = {
  settings: PropTypes.shape(settingsType).isRequired,
  xAxis: PropTypes.oneOfType([
    PropTypes.shape({
      ...xAxisType,
      ...withXKeyType
    }),
    PropTypes.shape({
      ...yAxisType,
      ...withXKeyType
    })
  ]).isRequired,
  yAxises: PropTypes.arrayOf(PropTypes.shape(yAxisType).isRequired).isRequired
};

const isTimeChart = xKey => xKey === "time";

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
      tickFormatter={tick => parseFloat(tick.toFixed(2))}
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
              {unit && <MathParser>{` [ ${unit} ]`}</MathParser>}
            </div>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};
const CustomXLabel = ({ description, unit, color, ...props }) => {
  const { x, y, height, width } = props.viewBox;
  const customHeight = 20;
  const ny = y + height - customHeight;
  return (
    <g transform={`translate(${x}, ${ny})`}>
      <foreignObject height={customHeight} width={width}>
        <div className="CustomLabel" style={{ color }}>
          <div className="CustomLabelInner">
            <div className="CustomLabelTransform">
              {description}
              {unit && <MathParser>{` [ ${unit} ]`}</MathParser>}
            </div>
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
    const { x, y, payload, withTime, color } = this.props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill={color}>
          {formatDate(payload.value)}
        </text>
        {withTime && (
          <text x={0} y={16} dy={16} textAnchor="middle" fill={color}>
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
  xKey,
  showDescription,
  color,
  withTime,
  datesNumber,
  ranges,
  ...props
}) => (
  <XAxis
    allowDataOverflow={true}
    padding={{
      left: 30,
      right: 30
    }}
    tick={<CustomizedXAxisTick withTime={withTime} color={color} />}
    interval={0}
    dataKey={xKey}
    type="number"
    stroke={color}
    height={xAxisHeight(showDescription, withTime)}
    domain={["dataMin", "dataMax"]}
    ticks={ranges.ticks}
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

const CustomXAxisOther = ({
  description,
  xKey,
  ranges,
  showDescription,
  color,
  unit,
  ...props
}) => (
  <XAxis
    allowDataOverflow={true}
    padding={{
      left: 30,
      right: 30
    }}
    interval={0}
    dataKey={xKey}
    type="number"
    stroke={color}
    height={xAxisHeight(showDescription, false)}
    domain={[ranges.domainMin, ranges.domainMax]}
    ticks={ranges.ticks}
    tickFormatter={tick => parseFloat(tick.toFixed(2))}
    label={
      showDescription
        ? props => (
            <CustomXLabel
              description={description}
              color={color}
              unit={unit}
              {...props}
            />
          )
        : undefined
    }
    {...props}
  />
);

const generateRegresionKey = path => `REG_${path}`;

const filledString = str => str && str.length;

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
  dotted,
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
    activeDot={true}
    type="monotone"
    connectNulls={true}
    unit={(e => e && e.unit)(find(yAxises, e => e.id === axis))}
    name={description}
    lineId={lineId}
    strokeDasharray={dashed ? `${dashLength} ${dashSpacing}` : undefined}
    strokeWidth={dotted ? 0 : lineWidth}
    stroke={lineColor}
    dot={dotted ? { stroke: lineColor, strokeWidth: lineWidth } : false}
    dataKey={dataSource}
    yAxisId={axis}
    {...props}
  />
);

const CustomTooltip = ({
  active,
  payload,
  label,
  xAxis,
  withTime,
  ...props
}) => {
  const { xKey, description, unit } = xAxis;
  if (active) {
    return (
      <div className="CustomTooltip">
        {isTimeChart(xKey) ? (
          <div className="CTTime">
            {`${formatDate(label)} ${withTime ? `${formatHour(label)}` : ""}`}
          </div>
        ) : (
          <div className="CTTime">
            <div className="CTFeature">{description}</div>
            <div className="CTValue">
              <MathParser>{`${label} ${unit}`}</MathParser>
            </div>
          </div>
        )}

        {filter(payload, e => !e.dataKey.startsWith("REG_")).map((e, i) => (
          <div className="CTProperty" key={i}>
            <div className="CTFeature">{e.name}</div>
            <div className="CTValue">
              <MathParser>{`${e.payload[e.dataKey]} ${e.unit}`}</MathParser>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const getAllDataFromKey = (data, key) =>
  filter(data, e => !isNil(e[key])).map(item => item[key]);

const filterDataByKeys = (data, keys = []) =>
  filter(data, e => keys.reduce((prev, k) => prev && !isNil(e[k]), true));

const dataFromAxis = (data, usedData, axis) =>
  filter(usedData, e => e.axis === axis).reduce(
    (prev, used) => [...prev, ...getAllDataFromKey(data, used.dataSource)],
    []
  );

const dataFromXAxis = (data, xKey) => getAllDataFromKey(data, xKey);

const addRegresionValues = (data, usedData, xKey) => {
  usedData
    .filter(e => e.showRegresion)
    .forEach(used => {
      const { dataSource } = used;
      const dataSet = filterDataByKeys(data, [dataSource, xKey]);
      used["regresion"] = regresion(dataSet, xKey, dataSource);
      const { a, b } = used["regresion"];
      const regKey = generateRegresionKey(dataSource);
      dataSet.forEach(set => {
        set[regKey] = a * set[xKey] + b;
      });
    });
};

const isDataFunction = (data, xKey, yKey) => {
  let y = null;
  let x = null;
  for (let i = 0; i < data.length; i++) {
    if (data[i][xKey] && data[i][yKey]) {
      if (data[i][xKey] === x && data[i][yKey] !== y) {
        return false;
      }
      x = data[i][xKey];
      y = data[i][yKey];
    }
  }
  return true;
};

const RegresionSummary = ({ usedData, xAxis, yAxises, ranges }) => {
  const { xKey, withTime, unit } = xAxis;
  const isTime = isTimeChart(xKey);
  const calculate = filter(usedData, e => e.showRegresion).map(
    ({ regresion, ...rest }) => {
      let { a, b } = regresion;
      const { domainMin } = ranges;
      let begin = 0;
      if (isTime) {
        b = b + a * domainMin;
        begin = domainMin;
      }
      return {
        ...rest,
        regresion: {
          ...regresion,
          b,
          begin
        }
      };
    }
  );
  const msInHour = 1000 * 60 * 60;
  return calculate.length > 0 ? (
    <div className="RegresionSummary">
      <div className="Title">Regresja liniowa</div>
      <Row gutter={16}>
        {calculate.map(({ description, axis, regresion }, i) => (
          <Col span={12} key={i}>
            <div className="RegresionValue">
              <div className="CTProperty">
                <div className="CTFeature">Źródło danych</div>
                <div className="CTValue">{description}</div>
              </div>
              <div className="CTProperty">
                <div className="CTFeature">Wzór</div>
                <div className="CTValue">
                  {isTime
                    ? `( ${(
                        regresion.a * (withTime ? msInHour : msInHour * 24)
                      ).toExponential(4)} ) · czas + ${regresion.b.toFixed(2)}`
                    : `${regresion.a.toExponential(
                        4
                      )} · x + ${regresion.b.toFixed(2)}`}
                </div>
              </div>
              <div className="CTProperty">
                <div className="CTFeature">Jednostka przyrostu</div>
                <div className="CTValue">
                  <MathParser>
                    {(yUnit =>
                      filledString(yUnit) || filledString(unit) || isTime
                        ? `[ ${filledString(yUnit) ? yUnit : "1"}/${
                            isTime
                              ? withTime
                                ? "godzinę"
                                : "dzień"
                              : filledString(unit)
                              ? unit
                              : "1"
                          }]`
                        : "bezwymiarowa")(
                      (e => e && e.unit)(find(yAxises, e => e.id === axis))
                    )}
                  </MathParser>
                </div>
              </div>
              <div className="CTProperty">
                <div className="CTFeature">Początek</div>
                <div className="CTValue">
                  {isTime
                    ? moment
                        .unix(regresion.begin / 1000)
                        .format(withTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD")
                    : "x = 0"}
                </div>
              </div>
              <div className="CTProperty">
                <div className="CTFeature">
                  <MathParser>R^2</MathParser>
                </div>
                <div className="CTValue">{regresion.R2.toFixed(4)}</div>
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
    chartConfig: PropTypes.shape(chartConfigType).isRequired,
    usedData: PropTypes.arrayOf(PropTypes.shape(usedDataType)).isRequired,
    data: PropTypes.array.isRequired
  };

  render() {
    console.log("passed to chart", this.props);
    const { usedData, data, chartConfig } = this.props;
    const { xAxis, settings, yAxises } = chartConfig;
    const {
      height,
      width,
      stopInteractive,
      showTitle,
      title,
      horizontalGrid,
      verticalGrid,
      showLegend
    } = settings;
    addRegresionValues(data, usedData, xAxis.xKey);

    const xAxisRanges = (axisFun =>
      axisFun(dataFromXAxis(data, xAxis.xKey), xAxis))(
      isTimeChart(xAxis.xKey) ? dateTicks : chartRangesFromConfig
    );

    return (
      <div className="LineChart">
        <div
          className="InnerChart"
          style={{
            width: `${width}%`
          }}
        >
          {showTitle && title.length && (
            <div className="ChartTitle">{title}</div>
          )}
          <ResponsiveContainer width={"100%"} aspect={width / height}>
            <LineChart data={data}>
              {!stopInteractive && (
                <Tooltip
                  content={
                    <CustomTooltip withTime={xAxis.withTime} xAxis={xAxis} />
                  }
                />
              )}
              {showLegend && (
                <Legend
                  height={36}
                  verticalAlign="top"
                  // paylodUniqBy={({ payload }) => payload.lineId}
                />
              )}
              <CartesianGrid
                strokeDasharray="5 5"
                horizontal={horizontalGrid}
                vertical={false}
              />
              {verticalGrid &&
                xAxisRanges.ticks.map((x, i) => (
                  <ReferenceLine
                    key={`cartesian-x-${i}`}
                    x={x}
                    strokeDasharray="5 5"
                  />
                ))}
              {(axisComp =>
                axisComp({
                  ...xAxis,
                  ranges: xAxisRanges
                }))(isTimeChart(xAxis.xKey) ? CustomXAxis : CustomXAxisOther)}
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
                    dataSource: generateRegresionKey(dataSource),
                    lineId: id,
                    dataSet: data,
                    key: `regresionLine-${id}`,
                    dotted: false,
                    legendType: "none",
                    ...regresionSettings
                  })
              )}
              {usedData.map(({ id, dotted, dataSource, ...used }) =>
                CustomLine({
                  yAxises,
                  ...used,
                  dataSource,
                  dotted:
                    isDataFunction(xAxis.xKey) ||
                    isDataFunction(data, xAxis.xKey, dataSource)
                      ? dotted
                      : true,
                  lineId: id,
                  dataSet: data,
                  key: `usedData-${id}`
                })
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <RegresionSummary
          usedData={usedData}
          xAxis={xAxis}
          ranges={xAxisRanges}
          yAxises={yAxises}
        />
      </div>
    );
  }
}

export default ResponsiveLineChart;
