import React, { Component } from "react";
import PropTypes from "prop-types";
// imported elements
import UseDataDialog from "./UseDataDialog";
// ant.design
import { Button, Col, Drawer, Row, Tooltip, Popconfirm } from "antd";

const MiddleWrapper = ({ ...props }) => (
  <div className="MiddleWrapper" {...props} />
);

const DeleteConfirm = ({ ...props }) => (
  <Popconfirm
    title={
      <div className="PopConfirm">
        Czy na pewno chcesz usunąć zestaw danych?
      </div>
    }
    okText="Tak"
    cancelText="Nie"
    {...props}
  />
);

class UseData extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    loadedData: PropTypes.object.isRequired,
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

  removeData = key => {
    const { data, update } = this.props;
    const newValue = { ...data };
    delete newValue[key];
    update(update(newValue));
  };

  updateData = (key, value) => {
    const { data, update } = this.props;
    update({ ...data, [key]: value });
  };

  render() {
    const { data, loadedData } = this.props;
    return (
      <div className="LoadData">
        {Object.keys(data).map(key => (
          <Row type="flex" align="middle" key={key}>
            <Col span={16}>{data[key].fields.description.value}</Col>
            <Col span={4}>
              <MiddleWrapper>
                <Tooltip placement="bottom" title="Ustawienia">
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
                <Tooltip placement="bottom" title="Usuń dane z wykresu">
                  <DeleteConfirm
                  // onConfirm={confirm}
                  // onCancel={cancel}
                  >
                    <Button shape="circle" icon="delete" />
                  </DeleteConfirm>
                </Tooltip>
              </MiddleWrapper>
            </Col>
          </Row>
        ))}
        <Row type="flex" align="middle">
          <Col span={16}>Nowe dane na wykresie</Col>
          <Col span={4} />
          <Col span={4}>
            <MiddleWrapper>
              <Tooltip placement="bottom" title="Dodaj dane do wykresu">
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
          title="Dodaj nowe dane do wykresu"
          placement="left"
          onClose={this.onCloseDialogLoad}
          visible={this.state.openedDialogLoad}
          width={480}
          bodyStyle={{
            flex: 1
          }}
        >
          <UseDataDialog
            mode="load"
            onClose={this.onCloseDialogLoad}
            loadData={this.loadData}
            loadedData={loadedData}
          />
        </Drawer>
        {this.state.editedData !== null && (
          <Drawer
            title="Edycja wyświetlanych danych"
            placement="left"
            onClose={this.onCloseDialogEdit}
            visible={this.state.openedDialogEdit}
            width={480}
            bodyStyle={{
              flex: 1
            }}
          >
            <UseDataDialog
              mode="edit"
              onClose={this.onCloseDialogEdit}
              editedData={data[this.state.editedData]}
              loadedData={loadedData}
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

export default UseData;
