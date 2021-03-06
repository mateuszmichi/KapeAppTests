import React, { Component } from "react";
import PropTypes from "prop-types";
// imported elements
import LoadDataDialog from "./LoadDataDialog";
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

class LoadData extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
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
    const { data } = this.props;
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
                <Tooltip placement="bottom" title="Usuń zestaw danych">
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
