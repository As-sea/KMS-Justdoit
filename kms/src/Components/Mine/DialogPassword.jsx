import React, { Component } from 'react';
import '../../CommonComponents/commonCss.css';
import { Modal, Button, Input, Form, message, Tooltip, Row, Col } from 'antd';
import * as MineServices from '../../Services/PackageServices/MineServices';
import { QuestionCircleOutlined, CheckCircleTwoTone } from '@ant-design/icons';
const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 20 } };

export default class DialogPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ischeck: false,
      loading: false,
      checkLoading: false,
      oldPassword: '',
      newPassword: '',
      againPassword: '',
    };
  }
  changePassword = () => {
    this.setState({ loading: true });
    MineServices.changepass(this.state.newPassword)
      .then(res => {
        this.setState({ loading: false });
        switch (res) {
          case 0:
            message.success('Changed successfully.');
            this.props.onHidePasswordDialog();
            break;
          case 801:
            message.error(`Password must have value.`);
            break;
          case 802:
            message.error('Change password Fialed.');
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
  checkPassword = () => {
    this.setState({ checkLoading: true });
    MineServices.checkPass(this.state.oldPassword)
      .then(res => {
        if (res) {
          this.setState({ checkLoading: false, ischeck: true });
          message.success('Successfully.');
        } else {
          this.setState({ checkLoading: false });
          message.error('Verification failed.');
        }
      })
      .catch(err => {
        //console.log('Fetch error:%S', err);
        this.setState({ checkLoading: false });
        message.error('There is an exception in the interface connection, please refresh or try again later.');
      });
  };
  onChangeOld = e => {
    this.setState({ oldPassword: e.target.value });
  };
  onChangeNew = e => {
    this.setState({ newPassword: e.target.value });
  };
  onChangeConfirm = e => {
    this.setState({ againPassword: e.target.value });
  };
  render() {
    return (
      <div id={`changePassword`}>
        <Modal
          title={'Change password'}
          visible={this.props.isPasswordShow}
          onCancel={this.props.onHidePasswordDialog}
          destroyOnClose={true}
          footer={[
            <Button key="cancel" onClick={this.props.onHidePasswordDialog}>
              Cancel
            </Button>,
          ]}
        >
          <Form name="validate_habit" {...formItemLayout} onFinish={this.changePassword}>
            <Form.Item
              label="OldPassword"
              name="OldPassword"
              rules={[
                {
                  required: true,
                  message: 'Please input password!',
                },
              ]}
            >
              <Row>
                <Col span={20}>
                  {' '}
                  <Input.Password onChange={this.onChangeOld} value={this.state.oldPassword} name="old-password" disabled={this.state.ischeck} />
                </Col>
                <Col className="margin-left-s padding-s" span={1}>
                  {' '}
                  <span className="margin-left-m padding-top-m magin-top-m">
                    <Tooltip arrowPointAtCenter title={<span>Please click the check button to confirm.</span>}>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>{' '}
                </Col>
              </Row>
            </Form.Item>
            {!this.state.ischeck && (
              <Form.Item>
                <Row>
                  <Col span={4} offset={15}>
                    <Button type="primary" icon={<CheckCircleTwoTone />} shape="round" loading={this.state.checkLoading} onClick={this.checkPassword}>
                      Check password
                    </Button>{' '}
                  </Col>
                </Row>
              </Form.Item>
            )}

            {this.state.ischeck && (
              <Form.Item
                label="NewPassword"
                name="NewPassword"
                rules={[
                  {
                    required: true,
                    message: 'Please input password!',
                  },
                  {
                    pattern: /^(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/,
                    message: 'Please enter a password of 6 to 20 characters, which must include uppercase and lowercase letters and numbers, and special characters can also be entered.',
                  },
                ]}
              >
                <Row>
                  <Col span={22}>
                    {' '}
                    <Input.Password onChange={this.onChangeNew} value={this.state.newPassword} name="new-password" />
                  </Col>
                </Row>
              </Form.Item>
            )}
            {this.state.ischeck && (
              <Form.Item
                label="Confirm"
                name="Confirm"
                rules={[
                  {
                    required: true,
                    message: 'Please input password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(role, value) {
                      if (value !== getFieldValue('NewPassword')) {
                        return Promise.reject('The two passwords are inconsistent!');
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Row>
                  <Col span={22}>
                    {' '}
                    <Input.Password onChange={this.onChangeConfirm} value={this.state.againPassword} name="confirm-password" />
                  </Col>
                </Row>
              </Form.Item>
            )}
            {this.state.ischeck && (
              <Form.Item>
                <Row>
                  <Col span={4} offset={12}>
                    {' '}
                    <Button key="submit" type="primary" loading={this.state.loading} disabled={!this.state.ischeck} htmlType="submit">
                      Change
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            )}
          </Form>
        </Modal>
      </div>
    );
  }
}
