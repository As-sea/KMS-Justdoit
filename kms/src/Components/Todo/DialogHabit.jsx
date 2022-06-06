/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import '../../CommonComponents/commonCss.css';
import { Modal, Button, Input, Select, Form, notification, message, Switch, Tooltip, Row, Col } from 'antd';
import { DialogType } from '../../Services/EnumValue';
import * as TodoServices from '../../Services/PackageServices/TodoServices';
import { QuestionCircleOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 20 } };

export default class DialogHabit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      habitData: this.props.habitData || [],
      //Value of Form
      isOpen: false,
      topicValue: '',
      itemValue: '',

      oldName: '',
    };
  }
  componentDidMount = () => {
    if (this.props.dialogType) {
      this.setState({
        oldName: this.props.habitData.HabitName,
        topicValue: this.state.habitData.HabitName,
        itemValue: this.state.habitData.HabitItem,
        isOpen: this.state.habitData.isOpen,
      });
    }
  };

  onOkChange = () => {
    //console.log('Change');
    if (!this.state.topicValue) {
      message.warning('You must have a habit!');
      return false;
    }
    this.setState({ loading: true });
    let data = {
      HabitName: this.state.topicValue,
      HabitItem: this.state.itemValue,
      isOpen: this.state.isOpen,
    };
    TodoServices.changeHabit(data, this.state.oldName)
      .then(res => {
        this.setState({ loading: false });
        switch (res) {
          case 0:
            message.success('Changed successfully.');
            this.props.getHabitList();
            this.props.onHideDialog();
            break;
          case 604:
            message.error(`You don't have a habit development plan yet, please create one.`);
            break;
          case 2:
            message.error('Failed, please refresh or try again later.');
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
    if (!this.state.topicValue) {
      message.warning('You must have a habit!');
      return false;
    }
    this.setState({ loading: true });
    let data = {
      HabitName: this.state.topicValue,
      HabitItem: this.state.itemValue,
      isOpen: this.state.isOpen,
    };

    TodoServices.createHabit(data)
      .then(res => {
        //console.log('CREATEres:', res);
        this.setState({ loading: false });

        switch (res) {
          case 0:
            message.success('Created successfully.');
            this.props.getHabitList();
            this.props.onHideDialog();
            break;
          case 601:
            message.error(`You already have the same habit.`);
            break;
          case 2:
            message.error('Failed, please refresh or try again later.');
            break;
          default:
            message.error('An unknown error occurred, please refresh or try again later.');
            break;
        }
        this.setState({ loading: false });
      })
      .catch(err => {
        //console.log('Fetch error:%S', err);
        this.setState({ loading: false });
        message.error('There is an exception in the interface connection, please refresh or try again later.');
      });
  };
  onChanegStatus = value => {
    // console.log('status:', value);
    this.setState({ isOpen: value });
  };
  onChangeTopic = e => {
    //console.log('Change:', e.target.value);
    this.setState({ topicValue: e.target.value });
    //console.log("qukongge:",e.target.value.trim())
  };
  onChangeItem = e => {
    //console.log('Change:', e.target.value);
    this.setState({ itemValue: e.target.value });
  };

  render() {
    return (
      <div id={`HabitDialog${this.props.dialogType}`}>
        <Modal
          title={this.props.dialogType ? 'Edit Habit' : 'Create a new Habit'}
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
            name="validate_habit"
            {...formItemLayout}
            initialValues={{
              'habit-topic': this.state.topicValue,
              'habit-item': this.state.itemValue,
            }}
          >
            <Form.Item
              label="Habit"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Please input your habit!',
                },
              ]}
            >
              <Input showCount maxLength={20} onChange={this.onChangeTopic} value={this.state.topicValue} name="habit-topic" />
            </Form.Item>
            <Form.Item label="Details">
              <TextArea showCount maxLength={200} onChange={this.onChangeItem} value={this.state.itemValue} name="habit-item" />
            </Form.Item>

            <Form.Item label="Status">
              <Row>
                <Col span={3}>{this.props.dialogType ? <Switch disabled={!this.props.habitData.isOpen && this.props.openCount >= 3} onChange={this.onChanegStatus} defaultChecked={this.props.habitData.isOpen} /> : <Switch disabled={this.props.openCount >= 3} onChange={this.onChanegStatus} />}</Col>
                <Col className="margin-left-s padding-s">
                  {' '}
                  <span className="margin-left-m padding-top-m magin-top-m">
                    <Tooltip arrowPointAtCenter title={<span>If it doesn't work, it's because you already have three executing habits.You can set the state after you create it.</span>}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>{' '}
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
