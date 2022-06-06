/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import '../../CommonComponents/commonCss.css';
import { Modal, Button, Input, Form, message, Tooltip, Row, Col } from 'antd';
import * as PlanServices from '../../Services/PackageServices/PlanServices';
import { QuestionCircleOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 20 } };

export default class DialogPeople extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      //Value of Form

      topicValue: '',
      itemValue: '',

      oldName: '',
    };
  }
  componentDidMount = () => {
    if (this.props.dialogType) {
      this.setState({
        oldName: this.props.peopleData.CharecterName,
        topicValue: this.props.peopleData.CharecterName,
        itemValue: this.props.peopleData.PeopleDetails,
      });
    }
  };
  onChangeTopic = e => {
    this.setState({ topicValue: e.target.value });
  };
  onChangeItem = e => {
    this.setState({ itemValue: e.target.value });
  };
  onOkChange = () => {
    if (!this.state.topicValue) {
      message.warning('Name should have a value!');
      return false;
    }
    this.setState({ loading: true });
    let data = {
      CharecterName: this.state.topicValue,
      OccurrenceFrequency: this.props.peopleData.OccurrenceFrequency,
      PeopleDetails: this.state.itemValue,
    };

    PlanServices.changePeople(data, this.state.oldName)
      .then(res => {
        //console.log('CREATEres:', res);
        this.setState({ loading: false });

        switch (res) {
          case 0:
            message.success('Created successfully.');
            this.props.getPeopleList();
            this.props.onHideDialog();
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
  onOkCreateNew = () => {
    if (!this.state.topicValue) {
      message.warning('Name should have a value!');
      return false;
    }
    this.setState({ loading: true });
    let data = {
      CharecterName: this.state.topicValue,
      OccurrenceFrequency: 0,
      PeopleDetails: this.state.itemValue,
    };

    PlanServices.createPeople(data)
      .then(res => {
        //console.log('CREATEres:', res);
        this.setState({ loading: false });

        switch (res) {
          case 0:
            message.success('Created successfully.');
            this.props.getPeopleList();
            this.props.onHideDialog();
            break;
          case 201:
            message.error(`You already have the same name.`);
            break;
          case 2:
            message.error('Failed, please refresh or try again later.');
            break;
          default:
            message.error('An unknown error occurred, please refresh or try again later.');
            break;
        }
      })
      .catch(err => {
        //console.log('Fetch error:%S', err);
        this.setState({ loading: false });
        message.error('There is an exception in the interface connection, please refresh or try again later.');
      });
  };

  render() {
    return (
      <div id={`PeopleDialog${this.props.dialogType}`}>
        <Modal
          title={this.props.dialogType ? 'Edit related person' : 'Create a new related person'}
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
              'people-topic': this.state.topicValue,
              'people-item': this.state.itemValue,
            }}
          >
            <Form.Item
              label="Name"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Please input name!',
                },
              ]}
            >
              <Row>
                <Col span={20}>
                  {' '}
                  <Input showCount maxLength={20} onChange={this.onChangeTopic} value={this.state.topicValue} name="people-topic" />
                </Col>
                <Col className="margin-left-s padding-s" span={2}>
                  {' '}
                  <span className="margin-left-m padding-top-m magin-top-m">
                    <Tooltip arrowPointAtCenter title={<span>The name of the related person does not support repetition. If there is the same name, please add a unique mark after the name.</span>}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>{' '}
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label="Biography">
              <TextArea showCount maxLength={200} onChange={this.onChangeItem} value={this.state.itemValue} name="people-item" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
