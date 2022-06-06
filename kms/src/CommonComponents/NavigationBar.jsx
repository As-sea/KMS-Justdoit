/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import './commonComponents.css';
import { Layout, Menu, Avatar, Tooltip, Popconfirm } from 'antd';
import IconFont from './IconFont';
import { Link, Outlet } from 'react-router-dom';
import { delCookie } from '../Services/cookies';
import { Logout, getDisplay } from '../Services/PackageServices/StartServices';
import { getCookie } from '../Services/cookies';
const { Header, Content, Sider } = Layout;

export default class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentName: 'todohome',
      subMenuName: '',
      displayName: '',
    };
  }
  componentDidMount = () => {
    getDisplay(getCookie()).then(res => {
      // console.log(res);
      this.setState({ displayName: res });
    });
  };
  onClickToChangeNav = value => {
    //console.log('nume:', value);
    this.setState({
      contentName: value.key,
    });
  };

  onOpenChange = value => {
    // console.log('sunMenu:', value);
    this.setState({
      subMenuName: value[1],
    });
  };

  confirm = () => {
    console.log('sign out');
    delCookie();
    Logout().then(res => {
      console.log(res);
    });
    window.location.pathname = '/login';
  };

  render() {
    return (
      <Layout id="nav-bar" className="nav-bar height-allpage">
        <Header className="nav-bar-header" style={{ backgroundColor: '#fff' }}>
          <IconFont type="icon-TODO_INFO" style={{ fontSize: '45px' }} />
          <span className="header-tittle">
            Just Do It <span className="header-tittle-son">(Personal Karma Management System)</span>
          </span>

          <span className="float-right margin-right-m">
            <Tooltip placement="bottom" title={this.state.displayName}>
              <Avatar size="large">{this.state.displayName[0]?.toUpperCase()}</Avatar>
            </Tooltip>
            <span className="margin-left-m"></span>
            <Popconfirm title="Are you sure you want to sign out?" onConfirm={this.confirm} okText="Yes" cancelText="No" placement="bottomRight">
              <a>Sign out</a>
            </Popconfirm>
          </span>
        </Header>
        <Layout id="nav-bar-content" className="nav-bar-content">
          <Sider breakpoint="sm" collapsedWidth="0" width="160`" className="nav-bar-sider">
            <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.state.contentName]} selectedKeys={[this.state.contentName]} openKeys={[this.state.subMenuName]} onClick={this.onClickToChangeNav} onOpenChange={this.onOpenChange}>
              <Menu.SubMenu key="todo" title="To-do" icon={<IconFont type="icon-quhangdong" style={{ fontSize: '30px', paddingRight: '1px' }} />}>
                {/* <Menu.Item key="todohome">
                  <Link to="/todo">Home</Link>
                </Menu.Item> */}
                <Menu.Item key="todoList">
                  <Link to="/todo/todos">To-do List</Link>
                </Menu.Item>
                <Menu.Item key="ideaList">
                  <Link to="/todo/ideas">Inspired Collection</Link>
                </Menu.Item>
                <Menu.Item key="todohabit">
                  <Link to="todo/habits">Habit-building</Link>
                </Menu.Item>
              </Menu.SubMenu>

              <Menu.SubMenu key="plan" title="Plan" icon={<IconFont type="icon-xiangmujihua" style={{ fontSize: '23px', paddingRight: '8px' }} />}>
                {/* <Menu.Item key="planhome">
                  <Link to="/plan">Home</Link>
                </Menu.Item> */}
                <Menu.Item key="planList">
                  <Link to="/plan/plans">Plan List</Link>
                </Menu.Item>
                <Menu.Item key="planPerson">
                  <Link to="/plan/persons">Related People</Link>
                </Menu.Item>
              </Menu.SubMenu>

              <Menu.SubMenu key="dream" title="Dream" icon={<IconFont type="icon-planefill" style={{ fontSize: '30px' }} />}>
                {/* <Menu.Item key="dreamhome">
                  <Link to="/dream">Home</Link>
                </Menu.Item> */}
                <Menu.Item key="dreamList">
                  <Link to="/dream/dreams">Dream List</Link>
                </Menu.Item>
              </Menu.SubMenu>

              <Menu.SubMenu key="personal" title="Personal" icon={<IconFont type="icon-gerenshezhi" style={{ fontSize: '23px', paddingRight: '8px' }} />}>
                <Menu.Item key="message">
                  <Link to="/mine">Personal Information</Link>
                </Menu.Item>
                {/* <Menu.Item key="image">
                  <Link to="/mine/images">Personal Values</Link>
                </Menu.Item> */}
                <Menu.Item key="skill">
                  <Link to="/mine/skills">Skills Required</Link>
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Sider>
          <Content style={{ margin: '0 16px 0' }}>
            <div className="site-layout-background" style={{ padding: 1 }}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
