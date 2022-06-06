/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import { Button, notification, Drawer, Tag, Tooltip } from 'antd';
import '../../CommonComponents/commonCss.css';
import { Dream } from '../../Services/EnumValue';

export default class PreviewDream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dreamData: this.props.dreamData || [],
    };
  }

  componentDidMount = () => {
    if (this.state.dreamData?.lenght == 0) {
      notification.open({
        message: 'Data Loading Error',
        description: 'Data loading error, please quit and try again or try again later.',
      });
    }
    // console.log('dreamDetials:', this.state.dreamData);
  };

  render() {
    return (
      <div id={this.state.dreamData[0]?.key}>
        <Drawer title="View Dream" placement="right" onClose={this.props.onHidePreview} visible={this.props.isShowPreview} width={450}>
          <div className="detail-row">
            <div className="detail-row-title">Dream </div>
            <Tooltip title={this.state.dreamData[0].DreamTopic}>
              <div className="detail-row-value overflow-ellipis">{this.state.dreamData[0].DreamTopic}</div>
            </Tooltip>
          </div>
          {this.state.dreamData[0].DreamItem && (
            <div className="detail-row">
              <div className="detail-row-title">Dream details</div>
              <Tooltip title={this.state.dreamData[0].DreamItem}>
                <div className="detail-row-value overflow-ellipis">{this.state.dreamData[0].DreamItem}</div>
              </Tooltip>
            </div>
          )}
          {this.state.dreamData[0].SkillNames?.length > 0 && (
            <div className="detail-row">
              <div className="detail-row-title">Required skills</div>
              <div className="detail-row-value">
                {this.state.dreamData[0].SkillNames.map(a => (
                  <Tag key={a}>{a}</Tag>
                ))}
              </div>
            </div>
          )}
          <div className="detail-row">
            <div className="detail-row-title">dream type</div>
            <div className="detail-row-value">{this.state.dreamData[0].DreamType === Dream.Career ? 'Career' : this.state.dreamData[0].DreamType === Dream.Life ? 'Life' : 'Dream'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-row-title">Date created</div>
            <div className="detail-row-value">{new Date(this.state.dreamData[0].CreateDate).toLocaleDateString()}</div>
          </div>
          <div className="detail-row">
            <div className="detail-row-title">Influence</div>
            <div className="detail-row-value">{this.state.dreamData[0].InfluenceLevel}</div>
          </div>
          <div className="detail-row">
            <div className="detail-row-title">Difficulty</div>
            <div className="detail-row-value">{this.state.dreamData[0].DifficultyLevel}</div>
          </div>
        </Drawer>
      </div>
    );
  }
}

//Dream-linked plans
