/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import { Button, notification, Drawer, Tag, Tooltip, Popover, Rate } from 'antd';
import '../../CommonComponents/commonCss.css';
import { Todo } from '../../Services/EnumValue';
import * as TodoServices from '../../Services/PackageServices/TodoServices';

export default class PreviewTodo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoData: this.props.todoData || [],
      tempPlanName: '',
    };
  }
  componentDidMount = () => {
    if (this.state.todoData?.lenght == 0) {
      notification.open({
        message: 'Data Loading Error',
        description: 'Data loading error, please quit and try again or try again later.',
      });
    }
    if (this.state.todoData[0].PlanId) this.getPlanName(this.state.todoData[0].Id);
  };

  getPlanName = id => {
    if (id != null) {
      TodoServices.getPlan(id).then(res => {
        // console.log(res.PlanTopic);
        this.setState({ tempPlanName: res.PlanTopic });
      });
    }
  };

  render() {
    return (
      <div id={this.state.todoData[0]?.key}>
        <Drawer title="View Plan" placement="right" onClose={this.props.onHidePreview} visible={this.props.isShowPreview} width={450}>
          <div className="detail-row">
            <div className="detail-row-title">To-do</div>
            <Tooltip title={this.state.todoData[0].TodoTopic}>
              <div className="detail-row-value overflow-ellipis">{this.state.todoData[0].TodoTopic}</div>
            </Tooltip>
          </div>
          {this.state.todoData[0].TodoItem && (
            <div className="detail-row">
              <div className="detail-row-title">Details</div>
              <Tooltip title={this.state.todoData[0].TodoItem}>
                <div className="detail-row-value overflow-ellipis">{this.state.todoData[0].TodoItem}</div>
              </Tooltip>
            </div>
          )}
          <div className="detail-row">
            <div className="detail-row-title">Type</div>
            <div className="detail-row-value">{this.state.todoData[0].TodoType === Todo.NoFreeTime ? 'Fixed' : 'Free'}</div>
          </div>

          <div className="detail-row margin-buttom-l">
            <div className="detail-row-title">{this.state.todoData[0].TodoType === Todo.NoFreeTime ? 'Date range' : 'Date'}</div>
            <div className="detail-row-value">
              {this.state.todoData[0].TodoType === Todo.NoFreeTime
                ? new Date(this.state.todoData[0].DateFrom).toLocaleDateString() + ' ' + new Date(this.state.todoData[0].DateFrom).toLocaleTimeString() + '-' + new Date(this.state.todoData[0].DateTo).toLocaleTimeString()
                : new Date(this.state.todoData[0].DateFrom).toLocaleDateString()}
            </div>
          </div>

          {this.state.todoData[0].PlanId && (
            <div className="detail-row margin-buttom-l">
              <div className="detail-row-title">Related Plan</div>
              <div className="detail-row-value">{this.state.tempPlanName}</div>
            </div>
          )}
        </Drawer>
      </div>
    );
  }
}
