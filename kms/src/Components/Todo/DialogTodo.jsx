/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import { Modal, Button, Input, Select, Rate, Form, Radio, notification, Tooltip, message, DatePicker, Checkbox, Row, Col, Slider, InputNumber, TimePicker } from 'antd';
import { DialogType, Todo } from '../../Services/EnumValue';
import * as PlanServices from '../../Services/PackageServices/PlanServices';
import * as TodoServices from '../../Services/PackageServices/TodoServices';
import { QuestionCircleOutlined } from '@ant-design/icons';
import '../../CommonComponents/commonCss.css';

const { TextArea } = Input;
const { Option } = Select;
const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 20 } };
const { RangePicker } = DatePicker;

export default class DialogTodo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      planData: this.props.planData || [],
      peopleList: [],
      dreamList: [],
      imageList: [],
      //Value of Form
      topicValue: '',
      itemValue: '',
      dateFrom: '',
      dateTo: '',
      selectPeopleValue: [],
      selectDreamValue: [],
      selectImagevalue: [],
      scoreValue: 1,
      typeValue: 1,
    };
    this.Dream = this.initDream();
  }

  componentDidMount = () => {
    if (this.props.dialogType) {
      this.setState({
        topicValue: this.props.todoData.TodoTopic,
        itemValue: this.props.todoData.TodoItem,

        selectDreamValue: this.props.todoData.PlanId,

        typeValue: this.props.TodoType,
      });
    }
  };

  initDream = () => {
    PlanServices.listPlan()
      .then(res => {
        // console.log('plan', res);
        this.setState({ dreamList: res });
      })
      .catch(function (e) {
        notification.open({
          message: 'Data Loading Error',
          description: 'Data loading error, please quit and try again or try again later.',
        });
      });
  };

  onOkChange = () => {
    // console.log('Change');
    if (!this.state.topicValue) {
      message.warning('You must have a plan!');
      return false;
    }
    this.setState({ loading: true });
    let data = {
      TodoTopic: this.state.topicValue,
      TodoItem: this.state.itemValue,
      DateFrom: this.props.todoData.DateFrom,
      DateTo: this.props.todoData.DateTo,

      PlanId: this.state.selectDreamValue,
      Id: this.props.todoData.Id,
      UserId: this.props.todoData.UserId,
      isAdvanceRemind: false,
      isComplete:this.props.todoData.isComplete,
      TodoType: this.props.todoData.TodoType,
    };
    TodoServices.changeTodo(data)
      .then(res => {
        // console.log('CREATEres:', res);
        this.setState({ loading: false });
        switch (res) {
          case 0:
            message.success('To-do changeed successfully.');
            this.props.getTodoList();
            this.props.onHideDialog();
            break;
            case 701:
                message.error('The required is have no value.');
                break;
              case 702:
                message.error('Data format is wrong.');
                break;
              case 705:
                message.error('Date format is wrong.');
                break;
              case 703:
                message.error('Select Plan has error.');
                break;
              case 704:
                message.error(`Type has an unknown error,please refresh or try again later.`);
                break;
              case 2:
                message.error('Failed to update data, please refresh or try again later.');
                break;
              default:
                message.error('An unknown error occurred, please refresh or try again later.');
                break;
        }
        this.setState({ loading: false });
      })
      .catch(err => {
        console.log('Fetch error:%S', err);
        this.setState({ loading: false });
        message.error('There is an exception in the interface connection, please refresh or try again later.');
      });
  };
  onOkCreateNew = () => {
    // console.log('CreateNew');
    if (!this.state.topicValue) {
      message.warning('You must have a plan!');
      return false;
    }
    if (!this.state.dateFrom || !this.state.dateTo) {
      message.warning('Plan needs to have a deadline!');
      return false;
    }
    this.setState({ loading: true });
    let data = {
      TodoTopic: this.state.topicValue,
      TodoItem: this.state.itemValue,
      TodoType: this.state.typeValue,
      DateFrom: this.state.dateFrom,
      DateTo: this.state.dateTo,
      isAdvanceRemind: false,
      PlanId: this.state.selectDreamValue,
      isComplete: false,
    };
    TodoServices.createTodo(data)
      .then(res => {
        // console.log('CREATEres:', res);
        this.setState({ loading: false });
        switch (res) {
          case 0:
            message.success('To-do Created successfully.');
            this.props.getTodoList();
            this.props.onHideDialog();
            break;
          case 701:
            message.error('The required is have no value.');
            break;
          case 702:
            message.error('Data format is wrong.');
            break;
          case 705:
            message.error('Date format is wrong.');
            break;
          case 703:
            message.error('Select Plan has error.');
            break;
          case 704:
            message.error(`Type has an unknown error,please refresh or try again later.`);
            break;
          case 2:
            message.error('Failed to update data, please refresh or try again later.');
            break;
          default:
            message.error('An unknown error occurred, please refresh or try again later.');
            break;
        }
      })
      .catch(err => {
        console.log('Fetch error:%S', err);
        this.setState({ loading: false });
        message.error('There is an exception in the interface connection, please refresh or try again later.');
      });
  };
  onChangePlanTopic = e => {
    // console.log('topic:', e.target.value);
    this.setState({ topicValue: e.target.value });
  };
  onChangePlanItem = e => {
    // console.log('item', e.target.value);
    this.setState({ itemValue: e.target.value });
  };
  onChangeDate = (dates, dateStrings) => {
    // console.log('data:', dates);
    // console.log('dataString:', dateStrings);
    this.setState({
      dateFrom: dateStrings,
      dateTo: dateStrings,
    });
  };
  onChangeTime = (time, timestr) => {
    // console.log('data:', time);
    // console.log('dataString:', timestr);
    let sataFromstr = this.state.dateFrom + ' ' + timestr[0];
    let dataTostr = this.state.dateTo + ' ' + timestr[1];
    this.setState({
      dateFrom: sataFromstr,
      dateTo: dataTostr,
    });
    // console.log('startTime', sataFromstr);
    // console.log('dataTo', dataTostr);
  };
  onChangeType = e => {
    // console.log('type', e.target.value);
    this.setState({ typeValue: e.target.value });
  };

  handlePlanChange = value => {
    // console.log('selectDream', value);
    // console.log('selectDreamOption', option);
    this.setState({ selectDreamValue: value });
  };

  render() {
    const dateFormat = 'MM-DD-YYYY';
    return (
      <div id={`TodoDialog+${this.props.dialogType}`}>
        <Modal
          title={this.props.dialogType ? 'Edit To-do' : 'Create a new To-do'}
          visible={this.props.isShowDialog}
          onCancel={this.props.onHideDialog}
          destroyOnClose={true}
          footer={[
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.props.dialogType ? this.onOkChange : this.onOkCreateNew}>
              {this.props.dialogType ? 'Change' : 'Submit'}
            </Button>,
            <Button key="cancel" onClick={this.props.onHideDialog}>
              Cancel
            </Button>,
          ]}
        >
          <Form
            name="validate_plan"
            {...formItemLayout}
            initialValues={{
              'dream-topic': this.state.topicValue,
              'dream-item': this.state.itemValue,
              'plan-peoples': this.state.selectPeopleValue,
              'plan-image': this.state.selectImagevalue,
              'plan-dream': this.state.selectDreamValue,
            }}
          >
            <Form.Item
              label="To-do"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Please input your to-do!',
                },
              ]}
            >
              <Input showCount maxLength={50} onChange={this.onChangePlanTopic} value={this.state.topicValue} name="dream-topic" />
            </Form.Item>
            <Form.Item label="Details">
              <TextArea showCount maxLength={200} onChange={this.onChangePlanItem} value={this.state.itemValue} name="dream-item" />
            </Form.Item>
            <Form.Item
              label="Type"
              rules={[
                {
                  required: true,
                  message: 'Please pick an item!',
                },
              ]}
            >
              <Radio.Group onChange={this.onChangeType} value={this.state.typeValue} name="dream-type" size="small" disabled={this.props.dialogType}>
                <Radio.Button value={Todo.FreeTime}>Free</Radio.Button>
                <Radio.Button value={Todo.NoFreeTime}>Fixed</Radio.Button>
              </Radio.Group>{' '}
              <span className="margin-left-m padding-top-m magin-top-l">
                <Tooltip arrowPointAtCenter title={<span>Please choose carefully, you cannot modify it after adding.</span>}>
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            </Form.Item>

            {!this.props.dialogType && (
              <Form.Item
                label="Date"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Please select a time range!',
                  },
                ]}
              >
                <Row>
                  <Col span={10}>
                    <DatePicker onChange={this.onChangeDate} />
                  </Col>

                  <Col span={2} className="margin-left-s padding-s">
                    {' '}
                    <span className="margin-left-m padding-top-m magin-top-l">
                      <Tooltip arrowPointAtCenter title={<span>Please choose carefully, you cannot modify it after adding.</span>}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </span>{' '}
                  </Col>
                </Row>
              </Form.Item>
            )}
            {!this.props.dialogType && this.state.typeValue == Todo.NoFreeTime && (
              <Form.Item
                label="Time Range"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Please select a time range!',
                  },
                ]}
              >
                <Row>
                  <Col span={18}>
                    <TimePicker.RangePicker onChange={this.onChangeTime} format={'HH:mm'} />
                  </Col>

                  <Col span={2} className="margin-left-s padding-s">
                    {' '}
                    <span className="margin-left-m padding-top-m magin-top-l">
                      <Tooltip arrowPointAtCenter title={<span>Please choose carefully, you cannot modify it after adding.</span>}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </span>{' '}
                  </Col>
                </Row>
              </Form.Item>
            )}
            <Form.Item label="Related plan">
              <Select allowClear style={{ width: '100%' }} placeholder="Please select related plan" onChange={this.handlePlanChange} name="plan-dream" value={this.state.selectDreamValue}>
                {this.state.dreamList.map(a => (
                  <Option key={a.Id}>{a.PlanTopic}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
