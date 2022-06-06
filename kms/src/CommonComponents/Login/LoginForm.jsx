/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import IconFont from '../IconFont';
import { Form, Input, Button, Checkbox, Row, Col, Divider, Spin, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as StartServices from '../../Services/PackageServices/StartServices';
import * as customCookie from '../../Services/cookies';

export const withNavigation = Component => {
  return props => <Component {...props} navigate={useNavigate()} />;
};

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userPassword: '',
      isRemember: false,
      loading: false,
    };
  }

  onFinish = values => {
    this.setState({
      userName: values.UserID,
      userPassword: values.userPassword,
      isRemember: values.remember,
      loading: true,
    });

    let data = {
      LoginName: values.UserID,
      Password: values.userPassword,
      isRemember: values.remember,
    };
    StartServices.Login(data)
      .then(res => {
        // console.log('RES:', res);
        this.setState({ loading: false });
        if (res.Id == null) {
          message.error('User ID or password is incorrect, please re-enter.');
          return false;
        }
        if (res.Status == 1000) {
          message.success(`Welcome , ${res.LoginName}`);
          customCookie.setCookie(res.Id, values.remember ? 30 : 1);
          window.location.pathname = '/admin';
        } else if (res.Status == 1001) {
          message.success(`Welcome , ${res.LoginName} `);
          customCookie.setCookie(res.Id, values.remember ? 30 : 1);
          this.jump();
          // this.props.navigate('/todo');
        } else {
          message.error('An unknown error occurred, please refresh or try again later.');
          return false;
        }
      })
      .catch(err => {
        console.log('Fetch error:%S', err);
        this.setState({ loading: false });
        message.error('There is an exception in the interface connection, please refresh or try again later.');
      });
  };

  jump = () => {
    window.location.pathname = '/';
    // this.props.navigate('/');
  };

  render() {
    return (
      <React.Fragment>
        <Spin size="large" spinning={this.state.loading}>
          <Row gutter={[8, 32]}>
            <Col span={24} />
            <Col span={18} offset={3}>
              <Row justify="start">
                <Col span={4}>
                  <IconFont type="icon-TODO" style={{ fontSize: '50px', marginTop: '15px', paddingRight: '1px', color: 'white' }} />
                </Col>
                <Col span={20}>
                  <div style={{ color: 'white' }}>
                    <p className="font-l margin-buttom-s font-semibold">Just Do It</p>
                    <p className="font-s ">Personal Karma Management System</p>
                  </div>
                </Col>
              </Row>
              <Divider style={{ backgroundColor: 'white' }} />
              <Row justify="start" gutter={[8, 16]}>
                <Col span={24}>
                  <p className="font-l margin-buttom-s font-bold-puls " style={{ color: 'white', letterSpacing: '1px' }}>
                    Sign in with your account
                  </p>
                </Col>
                <Col span={24}>
                  <div className="form-content">
                    <Form name="normal_login" className="login-form" initialValues={{ remember: false }} onFinish={this.onFinish}>
                      <Form.Item name="UserID" rules={[{ required: true, message: 'Please input your User ID!' }]}>
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="User ID" size="large" />
                      </Form.Item>
                      <Form.Item
                        name="userPassword"
                        rules={[
                          { required: true, message: 'Please input your Password!' },
                          {
                            pattern: /^(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/,
                            message: 'Input Correct format!',
                          },
                        ]}
                      >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" size="large" />
                      </Form.Item>

                      <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                          <Checkbox style={{ color: 'white' }}>Stay signed in for the next 30 days</Checkbox>
                        </Form.Item>
                      </Form.Item>

                      <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" block size="large">
                          Sign in
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </Col>
                <Col span={8} offset={8}>
                  <p style={{ color: 'white' }}>
                    No account? <a href="/register">Register</a>
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
          {/* <Button onClick={this.jump}>jump</Button> */}
        </Spin>
      </React.Fragment>
    );
  }
}
export default withNavigation(LoginForm);
