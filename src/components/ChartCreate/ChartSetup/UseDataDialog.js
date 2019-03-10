import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { head } from "lodash";
// imported elements
// ant.design
import {
  Checkbox,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Tabs,
  TreeSelect,
  Icon,
  Button,
  Select
} from "antd";
const { Option } = Select;
const colors = [
  {
    description: "Czarny",
    color: "black"
  },
  {
    description: "Niebieski",
    color: "blue"
  },
  {
    description: "Czerwony",
    color: "red"
  }
];

class ColorSelect extends Component {
  render() {
    return (
      <Select placeholder="Kolor linii" {...this.props}>
        {colors.map((e, i) => (
          <Option key={i} value={e.color}>
            <div>
              <div
                className="ColorSelectColor"
                style={{ background: e.color }}
              />
              <span>{e.description}</span>
            </div>
          </Option>
        ))}
      </Select>
    );
  }
}

class PathSelect extends Component {
  static propTypes = {
    loadedData: PropTypes.object.isRequired
  };

  genTreeData = () => {
    console.log(this.props.loadedData);
    return {};
  };
  render() {
    return (
      <TreeSelect
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        treeData={this.genTreeData()}
        placeholder="Wybierz załadowane dane"
        treeDefaultExpandAll
        {...this.props}
      />
    );
  }
}

class AxisSelect extends Component {
  static propTypes = {
    data: PropTypes.object
  };
  render() {
    const { data } = this.props;
    return (
      <Select {...this.props}>
        {Object.keys(data).map(e => (
          <Option key={e} value={e}>
            {data[e].description}
          </Option>
        ))}
      </Select>
    );
  }
}

class UseDataForm extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(["edit", "load"]).isRequired,
    editedData: PropTypes.object,
    loadedData: PropTypes.object,
    onClose: PropTypes.func,
    loadData: PropTypes.func,
    updateData: PropTypes.func
  };

  getFieldsFromFlow = () => {
    const requiredFields = [];
    const formattedFields = [];
    return { requiredFields, formattedFields };
  };

  handleSubmit = async e => {
    e.preventDefault();

    const { requiredFields, formattedFields } = this.getFieldsFromFlow();

    this.props.form.validateFields(requiredFields, {}, (err, fieldsValue) => {
      if (err) {
        return;
      }
      // TODO
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const isEdit = this.props.mode === "edit";
    const axisData = this.props.chartSettings || {
      0: { description: "Oś nr 1" }
    };
    const defaultAxisData = head(Object.keys(axisData));
    return (
      <Form
        layout="vertical"
        onSubmit={this.handleSubmit}
        hideRequiredMark={true}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div className="LoadDataDialogInner">
          <Form.Item label="Opis danych">
            {getFieldDecorator("description", {
              validateTrigger: ["onChange", "onBlur"],
              rules: [
                {
                  required: true,
                  message: "Proszę podać opis zestawu"
                },
                {
                  message: "Wymagana nazwa o długości od 3 do 30 znaków",
                  whitespace: true,
                  min: 3,
                  max: 30
                }
              ]
            })(<Input placeholder="Nazwa zestawu danych" />)}
          </Form.Item>
          <Form.Item label="Wybór danych">
            {getFieldDecorator("dataSource", {
              rules: [
                {
                  required: true,
                  message: "Proszę wybrać załadowane dane"
                }
              ]
            })(<PathSelect loadedData={this.props.loadedData} />)}
          </Form.Item>
          <Form.Item label="Oś odniesienia">
            {getFieldDecorator("selectPeriod", {
              validateTrigger: ["onChange"],
              rules: [
                {
                  required: true,
                  message: "Wybierz rodzaj zakresu czasu"
                }
              ],
              initialValue: defaultAxisData
            })(<AxisSelect data={axisData} />)}
          </Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item label="Grubość linii">
                {getFieldDecorator("lineWidth", {
                  initialValue: 2,
                  rules: [
                    {
                      required: true,
                      type: "number",
                      min: 1,
                      max: 6,
                      message: "Wybierz liczbę z zakresu od 1 do 6"
                    }
                  ]
                })(<InputNumber min={1} max={6} step={1} precision={0} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Kolor linii">
                {getFieldDecorator("lineColor", {
                  initialValue: "black",
                  rules: [
                    {
                      required: true,
                      message: "Wybierz kolor linii"
                    }
                  ]
                })(<ColorSelect />)}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            {getFieldDecorator("dashed", {
              initialValue: false,
              valuePropName: "checked"
            })(<Checkbox>Użyj przerywanej linii</Checkbox>)}
          </Form.Item>
          {getFieldValue("dashed") && (
            <Row>
              <Col span={12}>
                <Form.Item label="Długość kreski">
                  {getFieldDecorator("dashLength", {
                    initialValue: 5,
                    rules: [
                      {
                        required: true,
                        type: "number",
                        min: 4,
                        max: 15,
                        message: "Wybierz liczbę z zakresu od 4 do 15"
                      }
                    ]
                  })(<InputNumber min={4} max={15} step={1} precision={0} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Długość przerwy">
                  {getFieldDecorator("dashSpacing", {
                    initialValue: 5,
                    rules: [
                      {
                        required: true,
                        type: "number",
                        min: 4,
                        max: 15,
                        message: "Wybierz liczbę z zakresu od 4 do 15"
                      }
                    ]
                  })(<InputNumber min={4} max={15} step={1} precision={0} />)}
                </Form.Item>
              </Col>
            </Row>
          )}
        </div>
        <div className="LoadDataDialogSubmit">
          <Button onClick={this.handleReset} style={{ marginRight: 16 }}>
            Zresetuj
          </Button>
          <Button type="primary" icon="plus" htmlType="submit">
            Dodaj dane
          </Button>
        </div>
      </Form>
    );
  }
}

const WrappedUseDataForm = Form.create({ name: "use_data_form" })(UseDataForm);
const WrappedEditUseDataForm = Form.create({
  name: "edit_use_data_form",
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return Object.keys(props.editedData).reduce(
      (prev, key) => ({
        ...prev,
        [key]: Form.createFormField({ ...props.editedData[key] })
      }),
      {}
    );
  }
})(UseDataForm);

class UseDataDialog extends Component {
  static propTypes = {
    mode: PropTypes.string,
    editedData: PropTypes.object,
    loadedData: PropTypes.object,
    onClose: PropTypes.func,
    loadData: PropTypes.func,
    updateData: PropTypes.func
  };

  onUpdateFields = changedFields => {
    const { editedData, updateData } = this.props;
    const newValue = Object.keys(changedFields).reduce(
      (prev, key) => ({ ...prev, [key]: changedFields[key].value }),
      {}
    );
    if (newValue !== editedData.fields) {
      updateData({
        ...editedData,
        fields: { ...editedData.fields, ...newValue }
      });
    }
  };

  render() {
    const {
      mode,
      editedData,
      loadedData,
      onClose,
      loadData,
      updateData
    } = this.props;
    return (
      <div className="LoadDataDialog">
        {mode === "edit" ? (
          <WrappedEditUseDataForm
            mode="edit"
            onClose={onClose}
            updateData={updateData}
            editedData={editedData.fields}
            loadedData={loadedData}
            onChange={this.onUpdateFields}
          />
        ) : (
          <WrappedUseDataForm
            mode="load"
            onClose={onClose}
            loadData={loadData}
            loadedData={loadedData}
          />
        )}
      </div>
    );
  }
}

export default UseDataDialog;
