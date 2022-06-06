/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import { Modal, Button, Input, Select, Rate, Form, Radio, notification, Tooltip, message } from 'antd';
import { DialogType, Dream } from '../../Services/EnumValue';
import * as DreamServices from '../../Services/PackageServices/DreamServices';
import { QuestionCircleOutlined } from '@ant-design/icons';
import '../../CommonComponents/commonCss.css';
const { TextArea } = Input;
const { Option } = Select;
const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 20 } };

export default class DialogDream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dreamData: this.props.dreamData || [],
      skillsValue: [],
      //Value of Form
      influenceValue: 0,
      difficultyValue: 0,
      selectSkillValue: [],
      typeValue: Dream.Dream,
      topicValue: '',
      itemValue: '',
    };
    this.Skill = this.initSkills();
  }
  componentDidMount = () => {
    if (this.props.dialogType) {
      this.setState({
        influenceValue: this.props.dreamData.InfluenceLevel,
        difficultyValue: this.props.dreamData.DifficultyLevel,
        selectSkillValue: this.props.dreamData.SkillNames,
        typeValue: this.props.dreamData.DreamType,
        topicValue: this.props.dreamData.DreamTopic,
        itemValue: this.props.dreamData.DreamItem,
      });
    }
  };
  initSkills = () => {
    // console.log('state:', this.state);
    DreamServices.listSkills()
      .then(res => {
        //console.log('skills', res);
        this.setState({ skillsValue: res });
      })
      .catch(function (e) {
        notification.open({
          message: 'Data Loading Error',
          description: 'Data loading error, please quit and try again or try again later.',
        });
      });
  };

  onChangeDreamTopic = e => {
    // console.log('Change:', e.target.value);
    this.setState({ topicValue: e.target.value });
  };
  onChangeDreamItem = e => {
    // console.log('Change:', e.target.value);
    this.setState({ itemValue: e.target.value });
  };
  onChangeInfluence = value => {
    // console.log('influence:', value);
    this.setState({ influenceValue: value });
  };
  onChangeDifficulty = value => {
    // console.log('difficulty:', value);
    this.setState({ difficultyValue: value });
  };
  onChangeType = e => {
    // console.log('type', e.target.value);
    this.setState({ typeValue: e.target.value });
  };
  handleChange = value => {
    // console.log(`selected: ${value}`);
    this.setState({ selectSkillValue: value });
  };

  onOkCreateNew = e => {
    if (!this.state.topicValue) {
      message.warning('You must have a dream!');
      return false;
    }
    this.setState({ loading: true });
    let data = {
      DreamTopic: this.state.topicValue,
      DreamItem: this.state.itemValue,
      DreamType: this.state.typeValue,
      InfluenceLevel: this.state.influenceValue,
      DifficultyLevel: this.state.difficultyValue,
      SkillNames: this.state.selectSkillValue,
    };
    DreamServices.createDream(data)
      .then(res => {
        // console.log('res:', res);
        this.setState({ loading: false });
        switch (res) {
          case 0:
            message.success('Dream created successfully.');
            this.props.getDramList();
            this.props.onHideDialog();
            break;
          case 501:
            message.error('There can only be two career visions, please modify the Dream type.');
            break;
          case 502:
            message.error('There can only be two life visions, please modify the Dream type.');
            break;
          case 503:
            message.error('Required field has no value.');
            break;
          case 506:
            message.error('The corresponding Skill is not found, please create the corresponding Skill first.');
            break;
          case 504:
            message.error('Skill values has exceptions.');
            break;
          case 3:
            message.error('There was an error updating user, please refresh or try again later.');
            break;
          case 1:
            message.error('An unknown error occurred, please refresh or try again later.');
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
  onOkChange = () => {
    if (!this.state.topicValue) {
      message.warning('You must have a dream!');
      return false;
    }
    this.setState({ loading: true });
    let data = {
      DreamTopic: this.state.topicValue,
      DreamItem: this.state.itemValue,
      DreamType: this.state.typeValue,
      InfluenceLevel: this.state.influenceValue,
      DifficultyLevel: this.state.difficultyValue,
      SkillNames: this.state.selectSkillValue,
      Id: this.props.dreamData.Id,
    };
    //console.log("data:",data);
    DreamServices.changeDream(data)
      .then(res => {
        // console.log('changeRES:', res);
        this.setState({ loading: false });
        switch (res) {
          case 0:
            message.success('Dream changed successfully.');
            this.props.getDramList();
            this.props.onHideDialog();
            break;
          case 501:
            message.error('There can only be two career visions, please modify the Dream type.');
            break;
          case 502:
            message.error('There can only be two life visions, please modify the Dream type.');
            break;
          case 2:
            message.error('Dram change failed.');
            break;
          case 3:
            message.error('There was an error updating user, please refresh or try again later.');
            break;
          case 1:
            message.error('An unknown error occurred, please refresh or try again later.');
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

  render() {
    return (
      <div id={`DreamDialog+${this.props.dialogType}`}>
        <Modal
          title={this.props.dialogType ? 'Edit dream' : 'Create a new dream'}
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
            name="validate_dream"
            {...formItemLayout}
            initialValues={{
              'dream-topic': this.state.topicValue,
              'dream-item': this.state.itemValue,
              'dream-type': this.state.typeValue,
              'dream-influence': this.state.influenceValue,
              'dream-difficulty': this.state.difficultyValue,
              // 'dream-Skills': this.state.selectSkillValue,
            }}
          >
            <Form.Item
              label="Dream"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Please input your dream!',
                },
              ]}
            >
              <Input showCount maxLength={50} onChange={this.onChangeDreamTopic} value={this.state.topicValue} name="dream-topic" />
            </Form.Item>
            <Form.Item label="Details">
              <TextArea showCount maxLength={200} onChange={this.onChangeDreamItem} value={this.state.itemValue} name="dream-item" />
            </Form.Item>
            <div className="flex-row" style={{ marginLeft: '57px' }}>
              <Form.Item
                label="Type"
                rules={[
                  {
                    required: true,
                    message: 'Please pick an item!',
                  },
                ]}
              >
                <Radio.Group onChange={this.onChangeType} value={this.state.typeValue} name="dream-type" size="small">
                  <Radio.Button value={Dream.Dream}>Dream</Radio.Button>
                  <Radio.Button value={Dream.Career}>Career</Radio.Button>
                  <Radio.Button value={Dream.Life}>Life</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <span className="margin-left-m margin-top-s">
                <Tooltip arrowPointAtCenter title={<span>The number of life and career visions is limited to two.</span>}>
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            </div>

            <Form.Item name="dream-influence" label="Influence">
              <span>
                <Rate count={10} defaultValue={0} value={this.state.influenceValue} onChange={this.onChangeInfluence} />
                <span className="ant-rate-text">{this.state.influenceValue}</span>
              </span>
            </Form.Item>
            <Form.Item name="dream-difficulty" label="Difficulty">
              <span>
                <Rate count={10} defaultValue={0} value={this.state.difficultyValue} onChange={this.onChangeDifficulty} />
                <span className="ant-rate-text">{this.state.difficultyValue}</span>
              </span>
            </Form.Item>
            <Form.Item label="Required skills">
              <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="Please select" onChange={this.handleChange} name="dream-Skills" value={this.state.selectSkillValue}>
                {this.state.skillsValue.map(a => (
                  <Option key={a.SkillName}>{a.SkillName}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
