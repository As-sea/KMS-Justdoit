/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import { Modal, Button, Input, Select, Rate, Form, Radio, notification, Tooltip, message, DatePicker, Checkbox, Row, Col, Slider, InputNumber } from 'antd';
import { DialogType } from '../../Services/EnumValue';
import * as PlanServices from '../../Services/PackageServices/PlanServices';
import { QuestionCircleOutlined } from '@ant-design/icons';
import '../../CommonComponents/commonCss.css';

const { TextArea } = Input;
const { Option } = Select;
const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 20 } };
const { RangePicker } = DatePicker;

export default class DialogPlan extends Component {
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
      selectPeopleValue: null,
      selectDreamValue: null,
      selectImagevalue: null,
      scoreValue: 1,
    };
    this.Dream = this.initDream();
    this.Image = this.initImage();
    this.People = this.initPeople();
  }

  componentDidMount = () => {
    if (this.props.dialogType) {
      this.setState({
        topicValue: this.props.planData.PlanTopic,
        itemValue: this.props.planData.PlanItem,
        dateFrom: new Date(this.props.planData.DateFrom).toLocaleDateString().replace(/\//g, '-'),
        dateTo: new Date(this.props.planData.DateTo).toLocaleDateString().replace(/\//g, '-'),
        selectPeopleValue: this.props.planData.CharacterNames,
        selectDreamValue: this.props.planData.DreamId,
        scoreValue: this.props.planData.ImageAssociateds?this.props.planData.ImageAssociateds[0]?.Conformity:null,
        selectImagevalue: this.props.planData.ImageAssociateds?this.props.planData.ImageAssociateds[0]?.ImageName:null,
      });
    }
  };

  initPeople = () => {
    PlanServices.listPeople()
      .then(res => {
        // console.log('people', res);
        this.setState({ peopleList: res });
      })
      .catch(function (e) {
        notification.open({
          message: 'Data Loading Error',
          description: 'Data loading error, please quit and try again or try again later.',
        });
      });
  };

  initDream = () => {
    PlanServices.listDream()
      .then(res => {
        // console.log('dream', res);
        this.setState({ dreamList: res });
      })
      .catch(function (e) {
        notification.open({
          message: 'Data Loading Error',
          description: 'Data loading error, please quit and try again or try again later.',
        });
      });
  };

  initImage = () => {
    PlanServices.listImage()
      .then(res => {
        // console.log('image', res);
        this.setState({ imageList: res });
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
      PlanTopic: this.state.topicValue,
      PlanItem: this.state.itemValue,
      DateFrom: this.props.planData.DateFrom,
      DateTo: this.props.planData.DateTo,
      // dateFrom: new Date(this.props.planData.DateFrom).toLocaleDateString().replace(/\//g, '-'),
      // dateTo: new Date(this.props.planData.DateTo).toLocaleDateString().replace(/\//g, '-'),
      CharacterNames: this.state.selectPeopleValue,
      ImageAssociateds: this.props.planData.ImageAssociateds,
      DreamId: this.state.selectDreamValue,
      Id: this.props.planData.Id,
      UserId: this.props.planData.UserId,
    };
    PlanServices.changePlan(data)
      .then(res => {
        // console.log('CREATEres:', res);
        this.setState({ loading: false });
        switch (res) {
          case 0:
            message.success('Plan changeed successfully.');
            this.props.getPlanList();
            this.props.onHideDialog();
            break;
          case 102:
            message.error('Plan needs to have a deadline.');
            break;
          case 103:
            message.error('The date entered is incorrect.');
            break;
          case 104:
            message.error('Value entered incorrectly.');
            break;
          case 106:
            message.error('The associated value did not match, please try again later.');
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
      PlanTopic: this.state.topicValue,
      PlanItem: this.state.itemValue,
      DateFrom: this.state.dateFrom,
      DateTo: this.state.dateTo,
      CharacterNames: this.state.selectPeopleValue,
      ImageAssociateds: this.state.selectImagevalue?[
        {
          ImageName: this.state.selectImagevalue,
          Conformity: this.state.scoreValue,
        },
      ]:null,
      DreamId: this.state.selectDreamValue,
    };
    PlanServices.createPlan(data)
      .then(res => {
        // console.log('CREATEres:', res);
        this.setState({ loading: false });
        switch (res) {
          case 0:
            message.success('Plan created successfully.');
            this.props.getPlanList();
            this.props.onHideDialog();
            break;
          case 101:
            message.error('Required field has no value.');
            break;
          case 102:
            message.error('Plan needs to have a deadline.');
            break;
          case 103:
            message.error('The date entered is incorrect.');
            break;
          case 105:
            message.error('You don' + 't have this related person yet, Please create a person and try again.');
            break;
          case 104:
            message.error('Value entered incorrectly.');
            break;
          case 107:
            message.error('Score is out of range.');
            break;
          case 106:
            message.error('The associated value did not match, please try again later.');
            break;
          case 3:
            message.error('There was an error updating user, please refresh or try again later.');
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
      dateFrom: dateStrings[0],
      dateTo: dateStrings[1],
    });
  };
  handlePeopleChange = value => {
    // console.log('select:', value);
    this.setState({ selectPeopleValue: value });
  };

  handleDreamChange = value => {
    // console.log('selectDream', value);
    // console.log('selectDreamOption', option);
    this.setState({ selectDreamValue: value });
  };

  onChangeScore = value => {
    // console.log('score:', value);
    this.setState({ scoreValue: value });
  };

  handleImageChange = value => {
    // console.log('image', value);
    this.setState({ selectImagevalue: value });
  };

  render() {
    const dateFormat = 'MM-DD-YYYY';
    return (
      <div id={`PlanDialog+${this.props.dialogType}`}>
        <Modal
          title={this.props.dialogType ? 'Edit plan' : 'Create a new plan'}
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
              label="Plan"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Please input your plan!',
                },
              ]}
            >
              <Input showCount maxLength={50} onChange={this.onChangePlanTopic} value={this.state.topicValue} name="dream-topic" />
            </Form.Item>
            <Form.Item label="Details">
              <TextArea showCount maxLength={200} onChange={this.onChangePlanItem} value={this.state.itemValue} name="dream-item" />
            </Form.Item>

            {!this.props.dialogType && (
              <Form.Item
                label="Date range"
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
                    <RangePicker onChange={this.onChangeDate} format={dateFormat} style={{ paddingLeft: '10px' }} />
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

            <Form.Item label="Related people">
              <Select mode="multiple" allowClear style={{ width: '90%', paddingLeft: '1px' }} placeholder="Please select related people" onChange={this.handlePeopleChange} name="plan-peoples" value={this.state.selectPeopleValue}>
                {this.state.peopleList.map(a => (
                  <Option key={a.CharecterName}>{a.CharecterName}</Option>
                ))}
              </Select>
            </Form.Item>

            {!this.props.dialogType && (
              <Form.Item label="Judge values">
                <Row>
                  <Col span={10}>
                    <Select allowClear style={{ width: '100%' }} onChange={this.handleImageChange} name="plan-image" value={this.state.selectImagevalue}>
                      {this.state.imageList.map(a => (
                        <Option key={a}>{a}</Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={2}>
                    <span style={{ margin: '1px 4px' }}>:</span>
                  </Col>
                  <Col span={8}>
                    <InputNumber min={1} max={10} style={{ margin: '0 16px' }} value={this.state.scoreValue} onChange={this.onChangeScore} />
                  </Col>
                </Row>
              </Form.Item>
            )}

            <Form.Item label="Related dream">
              <Select allowClear style={{ width: '100%' }} placeholder="Please select related dream" onChange={this.handleDreamChange} name="plan-dream" value={this.state.selectDreamValue}>
                {this.state.dreamList.map(a => (
                  <Option key={a.Id}>{a.DreamTopic}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
