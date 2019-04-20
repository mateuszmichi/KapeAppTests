import React, { Component, PureComponent, Fragment } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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
import { mathTextConverter } from "./converter";
// ant.design
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
  xAxis: PropTypes.oneOfType([
    PropTypes.shape(xAxisType),
    PropTypes.shape(yAxisType)
  ]).isRequired,
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
              {unit && (
                <Fragment>
                  {" [ "}
                  {mathTextConverter(unit)}
                  {" ]"}
                </Fragment>
              )}
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
  xKey,
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
    dataKey={xKey}
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

const CustomXAxisOther = ({
  description,
  xKey,
  dataSpread,
  showDescription,
  color,
  rangeFrom,
  rangeTo,
  rangeSpan,
  unit,
  ...props
}) => {
  const { domainMin, domainMax, ticks } = chartRangesFromConfig(dataSpread, {
    rangeFrom,
    rangeTo,
    rangeSpan
  });
  return (
    <XAxis
      allowDataOverflow={true}
      padding={{
        left: 10,
        right: 30
      }}
      interval={0}
      dataKey={xKey}
      type="number"
      stroke={color}
      height={xAxisHeight(showDescription, false)}
      domain={[domainMin, domainMax]}
      ticks={ticks}
      tickFormatter={tick => parseFloat(tick.toFixed(2))}
      label={
        showDescription
          ? props => (
              <CustomXLabel
                description={description}
                color={color}
                {...props}
              />
            )
          : undefined
      }
      {...props}
    />
  );
};

const extractDataSource = path => {
  const tab = path.split("-");
  return tab[0];
};

const generateRegresionKey = path => `REG_${path}`;

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
    strokeWidth={lineWidth}
    stroke={dotted ? "transparent" : lineColor}
    dot={dotted ? { stroke: lineColor } : false}
    dataKey={dataSource}
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
    .forEach(({ dataSource }) => {
      const dataSet = filterDataByKeys(data, [dataSource, xKey]);
      const { a, b } = regresion(dataSet, xKey, dataSource);
      const regKey = generateRegresionKey(dataSource);
      dataSet.forEach(set => {
        set[regKey] = a * set[xKey] + b;
      });
    });
};

// const RegresionSummary = ({ data, usedData, withTime, xKey }) => {
//   const calculate = filter(usedData, e => e.showRegresion).map(
//     ({ dataSource, id, description }) => {
//       const sourceId = extractDataSource(dataSource);
//       const i = data.findIndex(e => e.id === sourceId);
//       const { a, b } = generateRegresionValue(data[i].data, dataSource, xKey);
//       return {
//         description,
//         a,
//         begin: data[i].data[0][xKey],
//         b: b + a * data[i].data[0][xKey]
//       };
//     }
//   );
//   const msInHour = 1000 * 60 * 60;
//   return calculate.length > 0 ? (
//     <div className="RegresionSummary">
//       <div className="Title">Regresja liniowa</div>
//       <Row gutter={16}>
//         {calculate.map((e, i) => (
//           <Col span={12} key={i}>
//             <div className="RegresionValue">
//               <div className="CTProperty">
//                 <div className="CTFeature">Źródło danych</div>
//                 <div className="CTValue">{e.description}</div>
//               </div>
//               <div className="CTProperty">
//                 <div className="CTFeature">Wzór</div>
//                 <div className="CTValue">
//                   {`( ${(
//                     e.a * (withTime ? msInHour : msInHour * 24)
//                   ).toExponential(4)} ) x czas + ${e.b.toFixed(2)}`}
//                 </div>
//               </div>
//               <div className="CTProperty">
//                 <div className="CTFeature">Jednostka</div>
//                 <div className="CTValue">
//                   {`Czas liczony w ${withTime ? "godzinach" : "dobach"}`}
//                 </div>
//               </div>
//               <div className="CTProperty">
//                 <div className="CTFeature">Początek (czas = 0)</div>
//                 <div className="CTValue">
//                   {moment
//                     .unix(e.begin / 1000)
//                     .format(withTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD")}
//                 </div>
//               </div>
//             </div>
//           </Col>
//         ))}
//       </Row>
//     </div>
//   ) : null;
// };

class ResponsiveLineChart extends Component {
  static propTypes = {
    chartConfig: PropTypes.shape(chartConfigType).isRequired,
    usedData: PropTypes.arrayOf(PropTypes.shape(usedDataType)).isRequired,
    data: PropTypes.arrayOf(PropTypes.shape(dataType)).isRequired
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
      showLegend
    } = settings;
    // TODO ref
    addRegresionValues(data, usedData, xAxis.xKey);
    return (
      <div className="LineChart">
        <div
          className="InnerChart"
          style={{
            width: `${width}%`
          }}
        >
          {showTitle && <div className="ChartTitle">{title}</div>}
          <ResponsiveContainer width={"100%"} aspect={width / height}>
            <LineChart data={data}>
              {!stopInteractive && (
                <Tooltip
                  content={
                    <CustomTooltip
                      withTime={xAxis.withTime}
                      xKey={xAxis.xKey}
                    />
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
              <CartesianGrid vertical={false} strokeDasharray="5 5" />
              {console.log("renderujemy opcję dla", xAxis.xKey)}
              {
                // TODO ref
                // Może przejscie na tryb i obiekt z configuracja
              }
              {xAxis.xKey === "time"
                ? CustomXAxis({
                    ...xAxis,
                    timeSpread: dataFromXAxis(data, xAxis.xKey)
                  })
                : CustomXAxisOther({
                    ...xAxis,
                    dataSpread: dataFromXAxis(data, xAxis.xKey)
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
                    dataSource: generateRegresionKey(dataSource),
                    lineId: id,
                    dataSet: data,
                    key: `regresionLine-${id}`,
                    dotted: false,
                    legendType: "none",
                    ...regresionSettings
                  })
              )}
              {usedData.map(({ id, dotted, ...used }) =>
                CustomLine({
                  yAxises,
                  ...used,
                  dotted: xAxis.xKey === "time" ? dotted : true,
                  lineId: id,
                  dataSet: data,
                  key: `usedData-${id}`
                })
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* <RegresionSummary
          data={data}
          usedData={usedData}
          xKey={xAxis.xKey}
          withTime={xAxis.withTime}
        /> */}
      </div>
    );
  }
}

export default ResponsiveLineChart;
