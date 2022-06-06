/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import CustomBreadcrumb from '../../CommonComponents/CustomBreadcrumb';
import { Input, Button, Row, Col, message, Descriptions, Avatar, notification, Tag, Tooltip } from 'antd';
import { SettingOutlined, QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons';
import * as MineServices from '../../Services/PackageServices/MineServices';
import { getCookie } from '../../Services/cookies';
import DialogPassword from './DialogPassword';

export default class Mine extends Component {
  constructor() {
    super();
    this.state = {
      userMessage: {},
      image: [],
      isPasswordShow: false,
      isChangeName: false,
      nameValue: '',

      isImageInput: false,
      addImage: '',
    };
  }

  componentDidMount = () => {
    this.getUserMessage();
  };
  handleNameInAvatar = name => {
    if (name) {
      var nameArr = name.split(' ');
      var nameInAvatar = '';
      nameArr.map(x => (nameInAvatar += x[0]));
      return nameInAvatar.toUpperCase();
    }
    return 'User';
  };

  getUserMessage = () => {
    MineServices.getmessage(getCookie())
      .then(res => {
        // console.log(res);
        this.setState({
          userMessage: res,
          image: res.ImagePositives,
          nameValue: res.DisplayName,
        });
      })
      .catch(function (e) {
        notification.open({
          message: 'Data Loading Error',
          description: 'Data loading error, please quit and try again or try again later.',
        });
      });
  };

  onDisplayPasswordDialog = () => {
    this.setState({ isPasswordShow: true });
  };

  onHidePasswordDialog = () => {
    this.setState({ isPasswordShow: false });
  };

  onChangeName = () => {
    this.setState({ isChangeName: true });
  };
  onChangeNameValue = e => {
    this.setState({
      nameValue: e.target.value,
    });
  };
  ChangeName = () => {
    MineServices.changemessage(this.state.nameValue)
      .then(res => {
        switch (res) {
          case 0:
            message.success('Changed successfully.');
            this.setState({ isChangeName: false });
            this.getUserMessage();
            break;
          case 803:
            message.error('Change Name Fialed.');
            break;
          case 2:
            message.error('Displayname is not null, or has An unknown error, please refresh or try again later.');
            break;
          default:
            message.error('An unknown error occurred, please refresh or try again later.');
            break;
        }
      })
      .catch(err => {
        message.error('There is an exception in the interface connection or format is wrong, please refresh or try again later.');
      });
  };

  displayAddImage = () => {
    this.setState({ isImageInput: true });
  };

  onChangeAddImage = e => {
    this.setState({ addImage: e.target.value });
  };
  addImageClick = () => {
    //  console.log(this.state.addImage);
    MineServices.createImage(this.state.addImage)
      .then(res => {
        switch (res) {
          case 0:
            message.success('Added successfully.');
            this.setState({ isImageInput: false, addImage: '' });
            this.getUserMessage();
            break;
          case 302:
            message.error('Number of value is 6, no one more than.');
            break;
          case 301:
            message.error('The value already has the same.');
            break;
          case 2:
            message.error('Displayname is not null, or has An unknown error, please refresh or try again later.');
            break;
          default:
            message.error('An unknown error occurred, please refresh or try again later.');
            break;
        }
      })
      .catch(err => {
        message.error('There is an exception in the interface connection, please refresh or try again later.');
      });
  };

  delImage = value => {
    // console.log(value);
    MineServices.delImage(value)
      .then(res => {
        switch (res) {
          case 0:
            message.success('Deleted successfully.');
            this.getUserMessage();
            break;
          case 303:
            message.error('The Image has an associated plan.');
            break;
          case 2:
            message.error('Displayname is not null, or has An unknown error, please refresh or try again later.');
            break;
          default:
            message.error('An unknown error occurred, please refresh or try again later.');
            break;
        }
      })
      .catch(err => {
        message.error('There is an exception in the interface connection, please refresh or try again later.');
      });
  };
  render() {
    return (
      <div>
        <CustomBreadcrumb primaryHeading="personal" secondaryHeading="message" />
        <Row gutter={[8, 32]}>
          <Col span={24} />
          <Col span={4} offset={2}>
            <Avatar size={80} style={{ backgroundColor: '#3184c5' }}>
              {this.handleNameInAvatar(this.state.userMessage.DisplayName)}
            </Avatar>
          </Col>
          <Col span={15}>
            <Descriptions title="User Information" column={1}>
              <Descriptions.Item label="User ID" span={1}>
                {this.state.userMessage.LoginName}
              </Descriptions.Item>
              <Descriptions.Item label="Display Name" span={1}>
                {this.state.isChangeName ? (
                  <>
                    <Input value={this.state.nameValue} size="small" style={{ width: '150px' }} onChange={this.onChangeNameValue} onPressEnter={this.ChangeName} />
                    <span className="margin-left-m padding-top-m magin-top-m">
                      <Tooltip arrowPointAtCenter title={<span>Currently, the system does not support displayName with symbols such as '.';'@'etc.</span>}>
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </span>
                  </>
                ) : (
                  this.state.userMessage.DisplayName
                )}{' '}
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button shape="circle" icon={<SettingOutlined />} size="small" ghost type="primary" onClick={this.onChangeName} />
              </Descriptions.Item>
              <Descriptions.Item label="Password" span={1}>
                ********** &nbsp;&nbsp;&nbsp;&nbsp;
                <Button shape="circle" icon={<SettingOutlined />} size="small" ghost type="primary" onClick={this.onDisplayPasswordDialog} />
              </Descriptions.Item>
              <Descriptions.Item label="Value" span={1}>
                {this.state.image.map(a => (
                  <Tag closable onClose={this.delImage.bind(this, a)} key={a}>
                    {a}
                  </Tag>
                ))}
                {!this.state.isImageInput && this.state.image.length < 6 && (
                  <Tag className="site-tag-plus" onClick={this.displayAddImage}>
                    <PlusOutlined /> New
                  </Tag>
                )}
                {this.state.isImageInput && <Input type="text" size="small" style={{ width: 78 }} value={this.state.addImage} onChange={this.onChangeAddImage} onPressEnter={this.addImageClick} />}
              </Descriptions.Item>
              <Descriptions.Item label="Skill" span={1}>
                <a href="/mine/skills">check detials</a>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        {this.state.isPasswordShow && <DialogPassword onHidePasswordDialog={this.onHidePasswordDialog} isPasswordShow={this.state.isPasswordShow} />}
      </div>
    );
  }
}
