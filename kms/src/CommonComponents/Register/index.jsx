/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import { Layout, Menu, Avatar, Tooltip, Popconfirm, Row, Col, Form, Input, Button, Select, Divider, Typography, Space, message } from 'antd';
import IconFont from '../IconFont';
import { UserOutlined, LockOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as StartServices from '../../Services/PackageServices/StartServices';
const { Header } = Layout;
const { Option } = Select;

export const withNavigation = Component => {
  return props => <Component {...props} navigate={useNavigate()} />;
};
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userPassword: '',
      imageList: [],
      loading: false,
      addValue: '',
      items: ['Patriotic', 'Dedicated', 'Integrity', 'Friendly'],
    };
  }

  inputChangeUsername = e => {
    this.setState({ userName: e.target.value });
    // StartServices.Check(e.target.value).then(res=>{
    //   console.log(res)
    // })
  };
  inputChangePassword = e => {
    this.setState({ userPassword: e.target.value });
  };
  onNameChange = e => {
    this.setState({ addValue: e.target.value });
  };
  addItem = e => {
    e.preventDefault();
    let add = this.state.addValue;
    this.state.items.push(add);
    this.setState({ addValue: '' });
    // console.log(e.preventDefault());
  };
  select = value => {
    this.setState({
      imageList: value,
    });
  };

  handleID = (rules, value, callback) => {
    console.log(`rules:${rules},value:${value},callback:${callback}`);
  };

  onFinish = values => {
    // console.log(values);
    let data = {
      LoginName: values.UserID,
      DisplayName: values.displayName,
      Password: values.UserPassword,
      UserLevel: 0,
      ImagePositives: this.state.imageList,
    };

    StartServices.register(data)
      .then(res => {
        // console.log(res);
        if (res.Status == 1001) {
          message.success(`User created successfully, please log in with ${values.UserID}`);
          this.props.navigate('/login');
        } else if (res.Status ==1104) {
          message.error(`${values.UserID} already exists, please re-enter another one.`);
        }else {
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

  render() {
    return (
      <div id="register-page" style={{ backgroundColor: '#565373', height: '100vh', minHeight: '557px' }}>
        <Header className="nav-bar-header" style={{ backgroundColor: '#fff' }}>
          <IconFont type="icon-TODO_INFO" style={{ fontSize: '45px' }} />
          <span className="header-tittle">
            Just Do It <span className="header-tittle-son">(Personal Karma Management System)</span>
          </span>
        </Header>
        <Row>
          <Col span={11} offset={6}>
            <div style={{ backgroundColor: 'white', height: '86vh', padding: '10px' }}>
              <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={this.onFinish}>
                <Form.Item name="UserID" rules={[{ required: true, message: 'Please input your User ID!' }]}>
                  <Input onChange={this.inputChangeUsername} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="User ID" />
                </Form.Item>
                <Form.Item
                  name="UserPassword"
                  rules={[
                    { required: true, message: 'Please enter any three of numbers, uppercase and lowercase letters or special characters.' },
                    {
                      pattern: /^(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/,
                      message: 'Please enter any three of numbers, uppercase and lowercase letters or special characters.',
                    },
                    ({ getFieldValue }) => ({
                      validator(role, value) {
                        if (value !== getFieldValue('UserPassword')) {
                          return Promise.reject('The two passwords are inconsistent!');
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input onChange={this.inputChangePassword} prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item
                  name="password2"
                  rules={[
                    { required: true, message: 'Please input your Password!' },
                    ({ getFieldValue }) => ({
                      validator(role, value) {
                        if (value !== getFieldValue('UserPassword')) {
                          return Promise.reject('The two passwords are inconsistent!');
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password Again" />
                </Form.Item>

                <Form.Item name="displayName">
                  <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="DisplayName(optional)" />
                </Form.Item>

                <Form.Item>
                  <Select
                    placeholder="Add or select the value(optional)"
                    mode="multiple"
                    dropdownRender={menu => (
                      <>
                        {menu}
                        <Divider style={{ margin: '8px 0' }} />
                        <Space align="center" style={{ padding: '0 8px 4px' }}>
                          <Input placeholder="Please enter value" value={this.state.addValue} onChange={this.onNameChange} />
                          <Typography.Link onClick={this.addItem} style={{ whiteSpace: 'nowrap' }}>
                            <PlusOutlined /> Add item
                          </Typography.Link>
                        </Space>
                      </>
                    )}
                    onChange={this.select}
                  >
                    {this.state.items.map(item => (
                      <Option key={item}>{item}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button" block>
                    Register
                  </Button>
                </Form.Item>

                <Form.Item>
                  <a className="return-login-form" href="/login">
                    Return Sign in
                  </a>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withNavigation(Register);
