import React, { Component } from "react";
import { filter, sortBy, isNil } from "lodash";
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
    showLegend: {
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
      value: false
    },
    color: {
      value: "black"
    },
    datesNumber: {
      value: 5
    },
    withTime: {
      value: false
    },
    keyType: {
      value: "time"
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

const updateKeys = (obj, key, xKey) => {
  const nKeys = Object.keys(obj).reduce(
    (prev, k) => ({
      ...prev,
      [k]: `${key}-${k}`
    }),
    {}
  );
  return Object.keys(nKeys).reduce(
    (prev, k) => ({
      ...prev,
      [nKeys[k]]: obj[k]
    }),
    {
      [xKey]: obj[xKey]
    }
  );
};

const filterLoadedData = (loadedData, usedData, xKey) => {
  const usedKeys = usedData.reduce(
    (prev, { dataSource }) => [...prev, dataSource],
    [xKey]
  );
  return filter(
    loadedData.map(value =>
      filter(Object.keys(value), k => usedKeys.includes(k)).reduce(
        (prev, k) => ({
          ...prev,
          [k]: value[k]
        }),
        {}
      )
    ),
    set =>
      !isNil(set[xKey]) &&
      (ks => ks.length > 1 && ks.includes(xKey))(Object.keys(set))
  );
};

const mergeData = (loadedData, xKey) => {
  const merged = Object.keys(loadedData).reduce(
    (array, key) => [
      ...array,
      ...loadedData[key].data.map(d => updateKeys(d, key, xKey))
    ],
    []
  );
  const sorted = sortBy(merged, xKey);
  if (xKey !== "time") {
    return sorted;
  }
  const final = [];
  let value = null;
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i][xKey] === value) {
      const last = final.pop();
      final.push({ ...last, ...sorted[i] });
    } else {
      final.push(sorted[i]);
    }
    value = sorted[i][xKey];
  }
  return final;
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

    const xAxisMapper = {
      common: ["color", "description", "showDescription"],
      time: ["datesNumber", "withTime"],
      other: ["rangeFrom", "rangeTo", "rangeSpan", "unit", "xKey"]
    };
    const _chartConfig = {
      settings: Object.keys(chartConfig.settings).reduce(
        (prev, fieldKey) => ({
          ...prev,
          [fieldKey]: chartConfig.settings[fieldKey].value
        }),
        {
          stopInteractive: false
        }
      ),
      xAxis: filter(Object.keys(chartConfig.xAxis), e =>
        [
          ...xAxisMapper.common,
          ...xAxisMapper[chartConfig.xAxis.keyType.value]
        ].includes(e)
      ).reduce(
        (prev, fieldKey) => ({
          ...prev,
          [fieldKey]: chartConfig.xAxis[fieldKey].value
        }),
        {
          xKey: "time"
        }
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
    };
    const _usedData = Object.keys(usedData).reduce(
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
    );
    const _data = mergeData(loadedData, _chartConfig.xAxis.xKey);
    return {
      chartConfig: _chartConfig,
      usedData: _usedData,
      data: filterLoadedData(_data, _usedData, _chartConfig.xAxis.xKey)
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
                <ResponsiveLineChart {...mapSetupResult} />
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
