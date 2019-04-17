import React, { Component } from "react";
import PropTypes from "prop-types";
import { filter, find } from "lodash";
// imported elements
import ColorSelect from "../../../Common/ColorSelect";
import { extractDataSource } from "../common";
// ant.design
import {
  Button,
  Checkbox,
  Col,
  Form,
  Icon,
  Input,
  InputNumber,
  Row,
  Select,
  Tabs
} from "antd";
const { TabPane } = Tabs;
const { Option } = Select;

const isUsed = (key, usedData) =>
  find(
    Object.keys(usedData),
    i => extractDataSource(usedData[i].fields.dataSource.value) === key
  );

const selectSameKeys = (loadedData, usedData) => {
  const dataKeys = Object.keys(loadedData);
  const list = id => loadedData[id].loadedKeys;
  return filter(dataKeys, k => isUsed(k, usedData)).reduce((prev, i) => {
    const keyList = list(i);
    return filter(prev, p => find(keyList, e => e.key === p.key));
  }, list(dataKeys[0]));
};

class SelectxKey extends Component {
  static propTypes = {
    selectable: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
      })
    )
  };
  render() {
    const { selectable, ...props } = this.props;
    return (
      <Select {...props}>
        {selectable.map(({ key, description }) => (
          <Option key={key} value={key}>
            {description}
          </Option>
        ))}
      </Select>
    );
  }
}

class XAxisForm extends Component {
  static propTypes = {
    editedAxis: PropTypes.object.isRequired,
    loadedData: PropTypes.object.isRequired,
    usedData: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    updateData: PropTypes.func.isRequired
  };

  changeAxisType = (axis, selectable) => {
    const xKey = this.props.form.getFieldValue("xKey");
    console.log("change Axis", axis, "xkey", xKey);
    const result = {
      keyType: axis
    };
    if (axis === "other" && xKey === null) {
      result.xKey = selectable[0].key;
    }
    this.props.form.setFieldsValue({
      ...result
    });
  };

  componentDidMount() {
    const { loadedData, usedData, form } = this.props;
    const selectable = selectSameKeys(loadedData, usedData);
    form.setFieldsValue({
      xKey: selectable[0].key
    });
  }

  render() {
    const { onClose, loadedData, usedData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const selectable = selectSameKeys(loadedData, usedData);
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
          <Form.Item label="Opis osi">
            {getFieldDecorator("description", {
              validateTrigger: ["onChange", "onBlur"],
              rules: [
                {
                  required: true,
                  message:
                    "Proszę podać nazwę osi, która pozwoli na identyfikację"
                },
                {
                  message: "Wymagana nazwa o długości od 2 do 20 znaków",
                  whitespace: true,
                  min: 2,
                  max: 20
                }
              ],
              initialValue: "Czas"
            })(<Input placeholder="Opis osi" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("showDescription", {
              initialValue: true,
              valuePropName: "checked"
            })(<Checkbox>Pokaż nazwę osi na wykresie</Checkbox>)}
          </Form.Item>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label="Kolor osi">
                {getFieldDecorator("color", {
                  validateTrigger: ["onChange"],
                  rules: [
                    {
                      required: true,
                      message: "Wybierz kolor osi"
                    }
                  ],
                  initialValue: "black"
                })(<ColorSelect />)}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Rodzaj osi">
            {getFieldDecorator("keyType", {
              valuePropName: "activeKey",
              initialValue: "time"
            })(
              <Tabs onChange={axis => this.changeAxisType(axis, selectable)}>
                <TabPane
                  tab={
                    <span>
                      <Icon type="clock-circle" />
                      Oś czasu
                    </span>
                  }
                  key="time"
                >
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        label="Minimalna ilość dat na osi"
                        help="Wyświetlna liczba może być mniejsza dla krótkich okresów"
                      >
                        {getFieldDecorator("datesNumber", {
                          initialValue: 5,
                          rules: [
                            {
                              required: true,
                              type: "number",
                              min: 2,
                              max: 8,
                              message: "Wybierz liczbę z zakresu od 2 do 8"
                            }
                          ]
                        })(
                          <InputNumber
                            className="AutoInputNumber"
                            min={2}
                            max={8}
                            step={1}
                            precision={0}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item>
                        {getFieldDecorator("withTime", {
                          initialValue: false,
                          valuePropName: "checked"
                        })(<Checkbox>Pokaż godzinę</Checkbox>)}
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <Icon type="dot-chart" />
                      Inna wartość
                    </span>
                  }
                  key="other"
                  disabled={selectable.length === 0}
                >
                  <Form.Item label="Dane na osi X">
                    {getFieldDecorator("xKey", {
                      validateTrigger: ["onChange"],
                      rules: [
                        {
                          required: true,
                          message: "Wybierz rodzaj zakresu czasu"
                        }
                      ]
                      // initialValue: selectable[0].key
                    })(<SelectxKey selectable={selectable} />)}
                  </Form.Item>
                  <Form.Item label="Jednostka">
                    {getFieldDecorator("unit", {
                      initialValue: "",
                      rules: [
                        {
                          message: "Maksymalna długość to 10 znaków",
                          whitespace: true,
                          max: 10
                        }
                      ]
                    })(<Input placeholder="Jednostka" />)}
                  </Form.Item>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item label="Od">
                        {getFieldDecorator("rangeFrom", {
                          initialValue: "auto",
                          rules: [
                            {
                              required: true,
                              message: "Proszę podać początek zakresu"
                            }
                          ]
                        })(<Input placeholder="Początek zakresu" />)}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Do">
                        {getFieldDecorator("rangeTo", {
                          initialValue: "auto",
                          rules: [
                            {
                              required: true,
                              message: "Proszę podać koniec zakresu"
                            }
                          ]
                        })(<Input placeholder="Początek zakresu" />)}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Krok">
                        {getFieldDecorator("rangeSpan", {
                          initialValue: "auto",
                          rules: [
                            {
                              required: true,
                              message:
                                "Proszę podać krok pomiędzy punktami odniesienia"
                            }
                          ]
                        })(<Input placeholder="Krok" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            )}
          </Form.Item>
        </div>
        <div className="LoadDataDialogSubmit">
          <Button type="primary" icon="redo" onClick={onClose}>
            Aktualizuj
          </Button>
        </div>
      </Form>
    );
  }
}

const updateValidationRules = {
  description: [value => value.length >= 2, value => value.length <= 20],
  datesNumber: [value => value >= 2, value => value <= 8]
};

const validateField = (field, value) =>
  !updateValidationRules[field] ||
  updateValidationRules[field].reduce(
    (result, rule) => result && rule(value),
    true
  );

const validateFields = fields =>
  Object.keys(fields).reduce(
    (prev, field) => prev && validateField(field, fields[field].value),
    true
  );

const WrappedXAxisForm = Form.create({
  name: "edit_xaxis_form",
  onFieldsChange(props, changedFields) {
    if (!validateFields(changedFields)) {
      return console.warn("Form not valid, abort update");
    }
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return Object.keys(props.editedAxis).reduce(
      (prev, key) => ({
        ...prev,
        [key]: Form.createFormField({ ...props.editedAxis[key] })
      }),
      {}
    );
  }
})(XAxisForm);

class XAxisDialog extends Component {
  static propTypes = {
    editedAxis: PropTypes.object.isRequired,
    loadedData: PropTypes.object.isRequired,
    usedData: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    updateData: PropTypes.func.isRequired
  };

  onUpdateFields = changedFields => {
    const { editedAxis, updateData } = this.props;
    if (changedFields !== editedAxis) {
      console.log({
        ...editedAxis,
        ...changedFields
      });
      updateData({
        ...editedAxis,
        ...changedFields
      });
    }
  };

  render() {
    const {
      editedAxis,
      updateData,
      loadedData,
      usedData,
      onClose
    } = this.props;
    return (
      <div className="LoadDataDialog">
        <WrappedXAxisForm
          editedAxis={editedAxis}
          onClose={onClose}
          updateData={updateData}
          loadedData={loadedData}
          usedData={usedData}
          onChange={this.onUpdateFields}
        />
      </div>
    );
  }
}

export default XAxisDialog;
