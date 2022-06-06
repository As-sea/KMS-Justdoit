/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import '../../CommonComponents/commonCss.css';
import { Modal, Button, Input, Form, message, Tooltip, Row, Col } from 'antd';
import * as MineServices from '../../Services/PackageServices/MineServices';
import { QuestionCircleOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 20 } };

export default class DialogSkill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      //Value of Form
      topicValue: '',

      oldName: '',
    };
  }
  componentDidMount = () => {
    if (this.props.dialogType) {
      this.setState({
        oldName: this.props.skillData.SkillName,
        topicValue: this.props.skillData.SkillName,
      });
    }
  };

  onChangeTopic = e => {
    this.setState({ topicValue: e.target.value });
  };
  onOkCreateNew = () => {
    if (!this.state.topicValue) {
      message.warning('Skill should have a value!');
      return false;
    }
    this.setState({ loading: true });
    MineServices.createSkill(this.state.topicValue)
      .then(res => {
        // console.log('CREATEres:', res);
        this.setState({ loading: false });
        switch (res) {
          case 0:
            message.success('Created successfully.');
            this.props.getSkillList();
            this.props.onHideDialog();
            break;
          case 401:
            message.error(`You already have the same skill.`);
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

  onOkChange = () => {
    if (!this.state.topicValue) {
      message.warning('Name should have a value!');
      return false;
    }
    this.setState({ loading: true });
    MineServices.createSkill(this.state.topicValue)
      .then(res => {
        // console.log('CREATEres:', res);
        this.setState({ loading: false });
        switch (res) {
          case 0:
            MineServices.deleteSkill(this.state.oldName)
              .then(result => {
                // console.log('DeleteRES:', result);
                switch (result) {
                  case 0:
                    message.success('Changed successfully.');
                    this.props.getSkillList();
                    this.props.onHideDialog();
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

            break;
          case 401:
            message.error(`You already have the same skill.`);
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
      <div id={`SkillDialog${this.props.dialogType}`}>
        <Modal
          title={this.props.dialogType ? 'Edit skills required' : 'Create a new skill required'}
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
              'skill-topic': this.state.topicValue,
            }}
          >
            <Form.Item
              label="Name"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Please input skill!',
                },
              ]}
            >
              <Row>
                <Col span={20}>
                  {' '}
                  <Input showCount maxLength={20} onChange={this.onChangeTopic} value={this.state.topicValue} name="skill-topic" />
                </Col>
                <Col className="margin-left-s padding-s" span={2}>
                  {' '}
                  <span className="margin-left-m padding-top-m magin-top-m">
                    <Tooltip arrowPointAtCenter title={<span>The name of the skill required does not support repetition. If there is the same name, please add a unique mark after the name.</span>}>
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
