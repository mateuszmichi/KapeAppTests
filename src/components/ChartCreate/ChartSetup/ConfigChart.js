import React, { Component } from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
// imported elements
import AxisDialog from "./Dialogs/AxisDialog";
import XAxisDialog from "./Dialogs/XAxisDialog";
import DeleteConfirm from "../../Common/DeleteConfirm";
// ant.design
import { Button, Col, Drawer, Row, Tooltip } from "antd";
import EditSettingsDialog from "./Dialogs/EditSettingsDialog";

const MiddleWrapper = ({ ...props }) => (
  <div className="MiddleWrapper" {...props} />
);

class ConfigChart extends Component {
  static propTypes = {
    config: PropTypes.shape({
      settings: PropTypes.object,
      xAxis: PropTypes.object,
      yAxises: PropTypes.object
    }).isRequired,
    usedData: PropTypes.object.isRequired,
    loadedData: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired
  };

  state = {
    openedDialogSettings: false,
    openedDialogXAxis: false,
    openedDialogAddAxis: false,
    openedDialogEditAxis: false,
    editedAxis: null
  };

  onCloseDialogSettings = () => {
    this.setState({ openedDialogSettings: false });
  };
  onCloseDialogXAxis = () => {
    this.setState({ openedDialogXAxis: false });
  };
  onCloseDialogAddAxis = () => {
    this.setState({ openedDialogAddAxis: false });
  };
  onCloseDialogEditAxis = () => {
    this.setState({
      openedDialogEditAxis: false,
      editedAxis: null
    });
  };
  openDialogSettings = () => {
    this.setState({ openedDialogSettings: true });
  };
  openDialogXAxis = () => {
    this.setState({ openedDialogXAxis: true });
  };
  openDialogAddAxis = () => {
    this.setState({ openedDialogAddAxis: true });
  };
  openDialogEditAxis = axis => {
    this.setState({
      openedDialogEditAxis: true,
      editedAxis: axis
    });
  };
  newIndex = () =>
    Object.keys(this.props.config.yAxises).reduce(
      (prev, curr) => Math.max(prev, curr),
      -1
    ) + 1;

  addAxis = newAxis => {
    const { config, update } = this.props;
    const ncofig = { ...config };
    ncofig.yAxises = { ...ncofig.yAxises, [this.newIndex()]: newAxis };
    update(ncofig);
  };

  updateAxis = (newAxis, key) => {
    const { config, update } = this.props;
    const ncofig = { ...config };
    ncofig.yAxises[key] = { ...ncofig.yAxises[key], ...newAxis };
    update(ncofig);
  };

  canRemove = key =>
    !find(
      Object.keys(this.props.usedData),
      i => this.props.usedData[i].fields.axis.value === key
    );

  removeAxis = axisId => {
    const { config, update } = this.props;
    const ncofig = { ...config };
    delete ncofig.yAxises[axisId];
    update(ncofig);
  };

  updateSettings = newSettings => {
    const { config, update } = this.props;
    const ncofig = { ...config };
    ncofig.settings = { ...ncofig.settings, ...newSettings };
    update(ncofig);
  };

  updateXAxis = newAxis => {
    const { config, update } = this.props;
    const ncofig = { ...config };
    ncofig.xAxis = { ...ncofig.xAxis, ...newAxis };
    update(ncofig);
  };

  render() {
    const { config, loadedData, usedData } = this.props;
    const { editedAxis } = this.state;
    return (
      <div className="LoadData">
        <Row type="flex" align="middle">
          <Col span={16}>Konfiguracja ogólna wykresu</Col>
          <Col span={4}>
            <MiddleWrapper>
              <Tooltip placement="top" title="Edytuj wygląd wykresu">
                <Button
                  type="primary"
                  shape="circle"
                  icon="setting"
                  onClick={this.openDialogSettings}
                />
              </Tooltip>
            </MiddleWrapper>
          </Col>
        </Row>
        <Row>
          <div className="ConfigChartSection">Oś pozioma</div>
        </Row>
        <Row type="flex" align="middle">
          <Col span={16}>Oś pozioma (czasu)</Col>
          <Col span={4}>
            <MiddleWrapper>
              <Tooltip placement="top" title="Edytuj oś czasu">
                <Button
                  shape="circle"
                  icon="setting"
                  onClick={this.openDialogXAxis}
                />
              </Tooltip>
            </MiddleWrapper>
          </Col>
        </Row>
        <Row>
          <div className="ConfigChartSection">Osie pionowe</div>
        </Row>
        {Object.keys(config.yAxises).map((key, i, axes) => (
          <Row key={key} type="flex" align="middle">
            <Col span={16}>{config.yAxises[key].description.value}</Col>
            <Col span={4}>
              <MiddleWrapper>
                <Tooltip placement="top" title="Ustawienia">
                  <Button
                    shape="circle"
                    icon="setting"
                    onClick={() => this.openDialogEditAxis(key)}
                  />
                </Tooltip>
              </MiddleWrapper>
            </Col>
            <Col span={4}>
              <MiddleWrapper>
                <DeleteConfirm
                  title="Czy chcesz usunąć oś odniesienia?"
                  remove="Usuń oś"
                  reason="Nie można usunąć, oś jest używana."
                  canRemove={this.canRemove(key)}
                  onConfirm={() => this.removeAxis(key)}
                >
                  <Button
                    disabled={!this.canRemove(key)}
                    shape="circle"
                    icon="delete"
                  />
                </DeleteConfirm>
              </MiddleWrapper>
            </Col>
          </Row>
        ))}
        <Row type="flex" align="middle">
          <Col span={16}>Dodaj oś odniesienia</Col>
          <Col span={4} />
          <Col span={4}>
            <MiddleWrapper>
              <Tooltip placement="bottom" title="Dodaj oś odniesienia">
                <Button
                  type="primary"
                  shape="circle"
                  icon="plus"
                  onClick={this.openDialogAddAxis}
                />
              </Tooltip>
            </MiddleWrapper>
          </Col>
        </Row>
        <Drawer
          title="Edytuj sposób prezentacji wykresu"
          placement="left"
          onClose={this.onCloseDialogSettings}
          visible={this.state.openedDialogSettings}
          width={480}
          bodyStyle={{
            flex: 1
          }}
        >
          <EditSettingsDialog
            onClose={this.onCloseDialogSettings}
            settings={config.settings}
            updateData={this.updateSettings}
          />
        </Drawer>
        <Drawer
          title="Edytuj oś czasu"
          placement="left"
          onClose={this.onCloseDialogXAxis}
          visible={this.state.openedDialogXAxis}
          width={480}
          bodyStyle={{
            flex: 1
          }}
        >
          <XAxisDialog
            onClose={this.onCloseDialogXAxis}
            editedAxis={config.xAxis}
            loadedData={loadedData}
            usedData={usedData}
            updateData={this.updateXAxis}
          />
        </Drawer>
        <Drawer
          title="Dodaj nową oś"
          placement="left"
          onClose={this.onCloseDialogAddAxis}
          visible={this.state.openedDialogAddAxis}
          width={480}
          bodyStyle={{
            flex: 1
          }}
        >
          <AxisDialog
            mode="load"
            onClose={this.onCloseDialogAddAxis}
            settings={config.settings}
            loadData={this.addAxis}
          />
        </Drawer>
        {this.state.editedAxis !== null && (
          <Drawer
            title="Edytuj ustawienia osi"
            placement="left"
            onClose={this.onCloseDialogEditAxis}
            visible={this.state.openedDialogEditAxis}
            width={480}
            bodyStyle={{
              flex: 1
            }}
          >
            <AxisDialog
              mode="edit"
              onClose={this.onCloseDialogEditAxis}
              updateData={newAxis => this.updateAxis(newAxis, editedAxis)}
              editedAxis={config.yAxises[editedAxis]}
            />
          </Drawer>
        )}
      </div>
    );
  }
}

export default ConfigChart;
