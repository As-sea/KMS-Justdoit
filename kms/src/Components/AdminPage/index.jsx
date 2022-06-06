/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import { getLevel } from '../../Services/PackageServices/StartServices';
import { getCookie, delCookie } from '../../Services/cookies';
import { Button, Input, message, Row, Col, Layout, Tooltip, notification, Space, Table, Popconfirm, Avatar } from 'antd';
import { Level } from '../../Services/EnumValue';
import IconFont from '../../CommonComponents/IconFont';
import * as UsersServices from '../../Services/PackageServices/UsersServices';
import { Logout } from '../../Services/PackageServices/StartServices';
import { AudioOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Search } = Input;

export default class AdminPage extends Component {
  constructor() {
    super();
    this.state = {
      usersData: [],
      loading: false,
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 6,
      },
    };
    this.columns = this.initColums();
  }
  initColums = () => {
    return [
      {
        title: 'User Id',
        dataIndex: 'LoginName',

        ellipsis: { showTitle: false },
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            <p>{text}</p>
          </Tooltip>
        ),
      },
      {
        title: 'Display Name',
        dataIndex: 'DisplayName',

        ellipsis: { showTitle: false },
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            <p>{text}</p>
          </Tooltip>
        ),
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (_, record) =>
          record.DisplayName === 'System Account' ? (
            <Space size="middle">-- --</Space>
          ) : (
            <Space size="middle">
              <Popconfirm placement="top" title="Are you sure to reset the user's password?" onConfirm={this.resetPassword.bind(this, record.key)} okText="Yes" cancelText="No">
                <a>Reset Password</a>
              </Popconfirm>
              <Popconfirm placement="top" title="Are you sure to delete the user?" onConfirm={this.deleteUser.bind(this, record.key)} okText="Yes" cancelText="No">
                <a>Delete User</a>
              </Popconfirm>
            </Space>
          ),
      },
    ];
  };
  componentDidMount = () => {
    getLevel(getCookie())
      .then(res => {
        if (res == Level.NormalUser) {
          message.warning('You do not have permission to enter this page.', 5);
          window.location.pathname = '/';
        } else {
          this.getuserList();
        }
      })
      .catch(err => {
        message.error('There is an exception in the interface connection, please refresh or try again later.');
        window.location.pathname = '/login';
      });
  };

  getuserList = () => {
    this.setState({ loading: true });
    UsersServices.listUsers()
      .then(res => {
        let temp = [];
        res.map(item => {
          temp.push(Object.assign(item, { key: item.Id }));
        });
        // console.log('dreamList:', temp);
        this.setState({
          usersData: temp,
          selectedRowKeys: [],
        });
      })

      .catch(function (e) {
        notification.open({
          message: 'Data Loading Error',
          description: 'Data loading error, please quit and try again or try again later.',
        });
      });
    this.setState({
      loading: false,
    });
  };

  onChangePage = page => {
    //console.log('page:', page);
    this.setState({ pagination: page });
  };

  confirm = () => {
    console.log('sign out');
    delCookie();
    Logout().then(res => {
      console.log(res);
    });
    window.location.pathname = '/login';
  };
  resetPassword = id => {
    //console.log(id);
    UsersServices.resetPassword(id)
      .then(res => {
        if (res) message.success('Reseted successfully.');
        else message.error('An unknown error occurred, please refresh or try again later.');
      })
      .catch(err => {
        console.log('Fetch error:%S', err);
        this.setState({ loading: false });
        message.error('There is an exception in the interface connection, please refresh or try again later.');
      });
  };
  deleteUser = id => {
    //console.log(id);
    UsersServices.removeUser(id)
      .then(res => {
        switch (res) {
          case 1020:
            message.success('Deleted successfully.');
            this.getuserList();
            break;
          case 1021:
            message.error('you have no power.');
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

  onSearch = (value, event) => {
    if (value) {
      this.setState({ loading: true });
      UsersServices.seachUser(value)
        .then(res => {
          let temp = [];
          res?.map(item => {
            temp.push(Object.assign(item, { key: item.Id }));
          });
          this.setState({ loading: false, usersData: temp });
        })
        .catch(err => {
          console.log('Fetch error:%S', err);
          this.setState({ loading: false });
          message.error('There is an exception in the interface connection, please refresh or try again later.');
        });
    } else {
      this.getuserList();
    }
  };
  render() {
    return (
      <div id="admin-page">
        <Header className="nav-bar-header" style={{ backgroundColor: '#fff' }}>
          <IconFont type="icon-TODO_INFO" style={{ fontSize: '45px' }} />
          <span className="header-tittle">
            Just Do It <span className="header-tittle-son">(Personal Karma Management System)</span>
          </span>

          <span className="float-right margin-right-m">
            <Tooltip placement="bottom" title="System Account">
              <Avatar size="large">SA</Avatar>
            </Tooltip>
            <span className="margin-left-m"></span>
            <Popconfirm title="Are you sure you want to sign out?" onConfirm={this.confirm} okText="Yes" cancelText="No" placement="bottomRight">
              <a>Sign out</a>
            </Popconfirm>
          </span>
        </Header>
        <Row gutter={[0, 16]}>
          <Col span={24} />
          <Col span={6} offset={16}>
            <Search placeholder="input search User Id" style={{ width: 340 }} enterButton onSearch={this.onSearch} allowClear />
          </Col>
          <Col span={20} offset={3}>
            <Table columns={this.columns} dataSource={this.state.usersData} loading={this.state.loading} pagination={this.state.pagination} onChange={this.onChangePage} />
          </Col>
        </Row>
      </div>
    );
  }
}
