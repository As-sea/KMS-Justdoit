/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import { Button, notification, Drawer, Tag, Tooltip, Popover, Rate } from 'antd';
import '../../CommonComponents/commonCss.css';
import * as PlanServices from '../../Services/PackageServices/PlanServices';

export default class PreviewPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      planData: this.props.planData || [],
      tempDreamName: '',
    };
  }

  componentDidMount = () => {
    if (this.state.planData?.lenght == 0) {
      notification.open({
        message: 'Data Loading Error',
        description: 'Data loading error, please quit and try again or try again later.',
      });
    }
    if (this.state.planData[0].DreamId) this.getDreamName(this.state.planData[0].DreamId);
    // console.log('planDetials:', this.state.planData);
  };

  getDreamName = id => {
    if (id != null) {
      let name = '';
      PlanServices.getDreamName(id).then(res => {
        name = res;
        this.setState({ tempDreamName: res });
      });
    }
  };
  render() {
    return (
      <div id={this.state.planData[0]?.key}>
        <Drawer title="View Plan" placement="right" onClose={this.props.onHidePreview} visible={this.props.isShowPreview} width={450}>
          <div className="detail-row">
            <div className="detail-row-title">Plan </div>
            <Tooltip title={this.state.planData[0].PlanTopic}>
              <div className="detail-row-value overflow-ellipis">{this.state.planData[0].PlanTopic}</div>
            </Tooltip>
          </div>
          {this.state.planData[0].PlanItem && (
            <div className="detail-row">
              <div className="detail-row-title">Plan details</div>
              <Tooltip title={this.state.planData[0].PlanItem}>
                <div className="detail-row-value overflow-ellipis">{this.state.planData[0].PlanItem}</div>
              </Tooltip>
            </div>
          )}
          {this.state.planData[0].CharacterNames?.length > 0 && (
            <div className="detail-row">
              <div className="detail-row-title">People involved</div>
              <div className="detail-row-value">
                {this.state.planData[0].CharacterNames.map(a => (
                  <Tag key={a}>{a}</Tag>
                ))}
              </div>
            </div>
          )}
          <div className="detail-row margin-buttom-l">
            <div className="detail-row-title">Date range</div>
            <div className="detail-row-value">{new Date(this.state.planData[0].DateFrom).toLocaleDateString() + ' - ' + new Date(this.state.planData[0].DateTo).toLocaleDateString()}</div>
          </div>
          <div className=" margin-top-l">
            <h3>Align with personal values:</h3>
            {this.state.planData[0].ImageAssociateds?.map(x => {
              return (
                <div className="flex-row detail-row">
                  <div className="padding-s" style={{ float: 'left', width: '70px', height: '34px', background: '#f7f7f7' }}>
                    {x.ImageName + ':'}
                  </div>
                  <div style={{ paddingLeft: '8px' }}>
                    <Rate disabled count={10} defaultValue={x.Conformity} />
                    <span style={{ paddingLeft: '4px' }}>{x.Conformity}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="detail-row margin-top-l">
            {this.state.planData[0].DreamId && (
              <Popover content={this.state.tempDreamName} title="Dream">
                <a>Check the general direction (related to Dream)</a>
              </Popover>
            )}
          </div>
        </Drawer>
      </div>
    );
  }
}
