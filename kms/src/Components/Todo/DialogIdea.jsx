/* 
 * Author: Kristen.Qi 
 * Version: KMS 1.0
 * Created Date: 2022-03-30    
 */
import React, { Component } from 'react';
import '../../CommonComponents/commonCss.css';
import { Modal, Button, Input, Form, message } from 'antd';
import { DialogType, Todo } from '../../Services/EnumValue';
import * as TodoServices from '../../Services/PackageServices/TodoServices';
const { TextArea } = Input;
const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 20 } };

export default class DialogIdea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      ideaData: this.props.ideadata || [],

      //Value of Form

      topicValue: '',
      itemValue: '',
    };
  }
  componentDidMount = () => {
    if (this.props.dialogType) {
      this.setState({
        topicValue: this.props.ideadata.TodoTopic,
        itemValue: this.props.ideadata.TodoItem,
      });
    }
  };

  onOkCreateNew = () => {
    if (!this.state.topicValue) {
      message.warning('You must have a tittle!');
      return false;
    }
    this.setState({ loading: true });
    let data = {
      TodoTopic: this.state.topicValue,
      TodoItem: this.state.itemValue,
      TodoType: Todo.Idea,
    };
    TodoServices.createTodo(data)
      .then(res => {
        this.setState({ loading: false });

        switch (res) {
          case 0:
            message.success('Created successfully.');
            this.props.getIdeaList();
            this.props.onHideDialog();
            break;
          case 701:
            message.error(`You should write the title.`);
            break;
          case 704:
            message.error(`Type has an unknown error,please refresh or try again later.`);
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
  onOkChange = () => {
    if (!this.state.topicValue) {
      message.warning('You must have a tittle!');
      return false;
    }
    this.setState({ loading: true });
    let data = {
      TodoTopic: this.state.topicValue,
      TodoItem: this.state.itemValue,
      TodoType: Todo.Idea,
      Id: this.props.ideadata.Id,
    };
    
    TodoServices.changeTodo(data)
      .then(res => {
        this.setState({ loading: false });

        switch (res) {
          case 0:
            message.success('Changed successfully.');
            this.props.getIdeaList();
            this.props.onHideDialog();
            break;
          case 2:
            message.error('Failed, please refresh or try again later.');
            break;
          case 704:
            message.error(`Type has an unknown error,please refresh or try again later.`);
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
      <div id={`IdeaDialog${this.props.dialogType}`}>
        <Modal
          title={this.props.dialogType ? 'Update inspiration' : 'Create inspiration'}
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
              label="Title"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Please input your habit!',
                },
              ]}
            >
              <Input showCount maxLength={30} onChange={this.onChangeTopic} value={this.state.topicValue} name="habit-topic" />
            </Form.Item>
            <Form.Item label="Content">
              <TextArea showCount onChange={this.onChangeItem} value={this.state.itemValue} name="habit-item" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
