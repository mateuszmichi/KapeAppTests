import React, { Component } from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
// imported elements
import DeleteConfirm from "../../Common/DeleteConfirm";
import LoadDataDialog from "./Dialogs/LoadDataDialog";
import { extractDataSource } from "./common";
// ant.design
import { Button, Col, Drawer, Row, Tooltip } from "antd";

const MiddleWrapper = ({ ...props }) => (
  <div className="MiddleWrapper" {...props} />
);

class LoadData extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    usedData: PropTypes.object.isRequired,
    update: PropTypes.func.isRequired
  };

  state = {
    openedDialogLoad: false,
    openedDialogEdit: false,
    editedData: null
  };

  onCloseDialogLoad = () => {
    this.setState({ openedDialogLoad: false });
  };
  onCloseDialogEdit = () => {
    this.setState({
      openedDialogEdit: false,
      editedData: null
    });
  };
  openDialogLoad = () => {
    this.setState({ openedDialogLoad: true });
  };
  openDialogEdit = key => {
    this.setState({
      openedDialogEdit: true,
      editedData: key
    });
  };

  newIndex = () =>
    Object.keys(this.props.data).reduce(
      (prev, curr) => Math.max(prev, curr),
      -1
    ) + 1;

  loadData = newData => {
    const { data, update } = this.props;
    update({ ...data, [this.newIndex()]: newData });
  };

  canRemove = key =>
    !find(
      Object.keys(this.props.usedData),
      i =>
        extractDataSource(this.props.usedData[i].fields.dataSource.value) ===
        key
    );

  removeData = key => {
    const { data, update } = this.props;
    const newValue = { ...data };
    delete newValue[key];
    update(newValue);
  };

  updateData = (key, value) => {
    const { data, update } = this.props;
    update({ ...data, [key]: value });
  };

  render() {
    const { data } = this.props;
    return (
      <div className="LoadData">
        {Object.keys(data).map(key => (
          <Row type="flex" align="middle" key={key}>
            <Col span={16}>{data[key].fields.description.value}</Col>
            <Col span={4}>
              <MiddleWrapper>
                <Tooltip placement="top" title="Ustawienia">
                  <Button
                    shape="circle"
                    icon="setting"
                    onClick={() => this.openDialogEdit(key)}
                  />
                </Tooltip>
              </MiddleWrapper>
            </Col>
            <Col span={4}>
              <MiddleWrapper>
                <DeleteConfirm
                  title="Czy chcesz usunąć załadowane dane?"
                  remove="Usuń załadowane dane"
                  canRemove={this.canRemove(key)}
                  reason="Nie można usunąć, dane są w użyciu."
                  onConfirm={() => this.removeData(key)}
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
          <Col span={16}>Nowy zestaw danych</Col>
          <Col span={4} />
          <Col span={4}>
            <MiddleWrapper>
              <Tooltip placement="bottom" title="Dodaj zestaw danych">
                <Button
                  type="primary"
                  shape="circle"
                  icon="plus"
                  onClick={this.openDialogLoad}
                />
              </Tooltip>
            </MiddleWrapper>
          </Col>
        </Row>
        <Drawer
          title="Dodaj nowy zestaw danych"
          placement="left"
          onClose={this.onCloseDialogLoad}
          visible={this.state.openedDialogLoad}
          width={480}
          bodyStyle={{
            flex: 1
          }}
        >
          <LoadDataDialog
            mode="load"
            onClose={this.onCloseDialogLoad}
            loadData={this.loadData}
          />
        </Drawer>
        {this.state.editedData !== null && (
          <Drawer
            title="Edycja zestawu danych"
            placement="left"
            onClose={this.onCloseDialogEdit}
            visible={this.state.openedDialogEdit}
            width={480}
            bodyStyle={{
              flex: 1
            }}
          >
            <LoadDataDialog
              mode="edit"
              onClose={this.onCloseDialogEdit}
              editedData={data[this.state.editedData]}
              updateData={value =>
                this.updateData(this.state.editedData, value)
              }
            />
          </Drawer>
        )}
      </div>
    );
  }
}

export default LoadData;
