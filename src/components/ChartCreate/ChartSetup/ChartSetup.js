import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
// imported elements
import LoadData from "./LoadData";
import UseData from "./UseData";
import ConfigChart from "./ConfigChart";
// ant.design
import { Collapse } from "antd";
const Panel = Collapse.Panel;

const getActiveStatus = ({ loadedData, usedData }) => {
  const isActiveUsedData = Object.getOwnPropertyNames(loadedData).length !== 0;
  const isActiveChartConfig =
    isActiveUsedData && Object.getOwnPropertyNames(usedData).length !== 0;
  return {
    isActiveUsedData,
    isActiveChartConfig
  };
};

class ChartSetup extends Component {
  constructor(props) {
    super(props);
    const { isActiveUsedData, isActiveChartConfig } = getActiveStatus(props);
    const activeKey = ["loadedData"];
    if (isActiveUsedData) {
      activeKey.push("usedData");
    }
    if (isActiveChartConfig) {
      activeKey.push("chartConfig");
    }
    this.state = {
      activeKey: activeKey
    };
  }
  static propTypes = {
    update: PropTypes.func.isRequired,
    loadedData: PropTypes.object.isRequired,
    usedData: PropTypes.object.isRequired,
    chartConfig: PropTypes.object.isRequired
  };

  componentDidUpdate(prevProps) {
    const updateActiveKeys = [];
    const removeActiveKeys = [];
    const activeStatus = getActiveStatus(this.props);
    const prevActiveStatus = getActiveStatus(prevProps);
    if (!prevActiveStatus.isActiveUsedData && activeStatus.isActiveUsedData) {
      updateActiveKeys.push("usedData");
    }
    if (prevActiveStatus.isActiveUsedData && !activeStatus.isActiveUsedData) {
      removeActiveKeys.push("usedData");
    }
    if (
      !prevActiveStatus.isActiveChartConfig &&
      activeStatus.isActiveChartConfig
    ) {
      updateActiveKeys.push("chartConfig");
    }
    if (
      prevActiveStatus.isActiveChartConfig &&
      !activeStatus.isActiveChartConfig
    ) {
      removeActiveKeys.push("chartConfig");
    }
    if (updateActiveKeys.length + removeActiveKeys.length > 0) {
      const result = _.union([...this.state.activeKey], updateActiveKeys);
      this.setState({
        activeKey: _.filter(result, e => !removeActiveKeys.includes(e))
      });
    }
  }

  changeActiveKey = newActiveKey => {
    this.setState({
      activeKey: newActiveKey
    });
  };

  update = (key, newValue) => {
    this.setState({
      [key]: newValue
    });
  };

  updateLoadedData = newValue => this.props.update("loadedData", newValue);
  updateUsedData = newValue => this.props.update("usedData", newValue);
  updateChartConfig = newValue => this.props.update("chartConfig", newValue);

  render() {
    const { loadedData, usedData, chartConfig } = this.props;
    const { isActiveUsedData, isActiveChartConfig } = getActiveStatus(
      this.props
    );
    return (
      <div className="ChartSetup">
        <Collapse
          activeKey={this.state.activeKey}
          onChange={this.changeActiveKey}
          bordered={false}
        >
          <Panel header="Pobranie danych" key="loadedData">
            <LoadData update={this.updateLoadedData} data={loadedData} />
          </Panel>
          <Panel
            disabled={!isActiveUsedData}
            header="Wybór wyświetlanych danych"
            key="usedData"
          >
            <UseData
              update={this.updateUsedData}
              data={usedData}
              loadedData={loadedData}
              config={chartConfig}
            />
          </Panel>
          <Panel
            // disabled={!isActiveChartConfig}
            header="Konfiguracja wykresu"
            key="chartConfig"
          >
            <ConfigChart update={this.updateChartConfig} config={chartConfig} />
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export default ChartSetup;
