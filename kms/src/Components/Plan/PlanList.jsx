/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import CustomBreadcrumb from '../../CommonComponents/CustomBreadcrumb';
import { Table, Tag, Tooltip, Button, notification, Popconfirm, message, Popover } from 'antd';
import * as PlanServices from '../../Services/PackageServices/PlanServices';
import '../../CommonComponents/commonCss.css';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { DialogType } from '../../Services/EnumValue';
import PreviewPlan from './PreviewPlan';
import DialogPlan from './DialogPlan';

export default class PlanList extends Component {
  constructor() {
    super();
    this.state = {
      planList: [],
      tableLoading: true,
      pagination: {
        current: 1,
        pageSize: 5,
      },
      selectedRowKeys: [],
      selectedRows: [],
      tempDreamName: '',
      isShowPreview: false,
      isShowDialog: false,
      dialogType: DialogType.Create,
    };
    this.columns = this.initColumns();
  }
  initColumns = () => {
    return [
      {
        title: 'Plan',
        dataIndex: 'PlanTopic',
        render: text => <a>{text}</a>,
        width: 200,
        ellipsis: { showTitle: false },
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            <a>{text}</a>
          </Tooltip>
        ),
      },
      {
        title: 'start Date',
        dataIndex: 'DateFrom',
        align: 'center',
        ellipsis: true,
        width: 112,
        sorter: (a, b) => Date.parse(a.DateFrom) - Date.parse(b.DateFrom),
        render: date => <>{new Date(date).toLocaleDateString()}</>,
      },
      {
        title: 'End Date',
        dataIndex: 'DateTo',
        align: 'center',
        ellipsis: true,
        width: 112,
        sorter: (a, b) => Date.parse(a.DateTo) - Date.parse(b.DateTo),
        render: date => <>{new Date(date).toLocaleDateString()}</>,
      },
      {
        title: 'Related People',
        dataIndex: 'CharacterNames',
        width: 180,
        render: tags => (
          <>
            {tags?.map(tag => {
              return (
                <Tag color="green" key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ),
      },
      // {
      //   title: 'Related Dreams',
      //   dataIndex: 'DreamId',
      //   width: 100,
      //   render: text => <>{text ? this.displayDreamName(text) : 'No related'}</>,
      //   ellipsis: { showTitle: false },
      //   // render: text =><>{text ? this.getDreamName(text) : null}</>,
      // },
      {
        title: 'Align with personal values',
        dataIndex: 'ImageAssociateds',
        render: tags => (
          <>
            {tags?.map(tag => {
              //  console.log(tag);
              return (
                <Tag color={'gold'} key={tag.ImageName || 0}>
                  {`${tag.ImageName?.toUpperCase()}:${tag?.Conformity}/10`}
                </Tag>
              );
            })}
          </>
        ),
        sorter: (a, b) => this.Sum(b.ImageAssociateds) - this.Sum(a.ImageAssociateds),
      },
    ];
  };
  Sum = array => {
    var sum = 0;
    array?.forEach(x => (sum += x.Conformity));
    return sum;
  };

  componentDidMount = () => {
    this.getPlanList();
  };

  getPlanList = () => {
    PlanServices.listPlan()
      .then(res => {
        // console.log('PlanRES:', res);
        let temp = [];
        res.map(item => {
          // item.DreamId ? temp.push(Object.assign(item, { key: item.Id, DreamName:this.getDreamName(item.DreamId) })) : temp.push(Object.assign(item, { key: item.Id }));
          temp.push(Object.assign(item, { key: item.Id }));
        });
        // console.log('temp:', temp);
        this.setState({
          planList: temp,
          tableLoading: false,
          selectedRows: [],
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
      tableLoading: false,
    });
  };

  displayDreamName = id => {
    const content = <div>{this.state.tempDreamName}</div>;
    return (
      <Popover content={content} title="Dream">
        <a>check</a>
      </Popover>
    );
  };

  async getDreamName(id) {
    if (id != null) {
      let name = '';
      await PlanServices.getDreamName(id).then(res => {
        name = res;
        this.setState({ tempDreamName: res });
      });
      return name;
    }
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  onChangePage = page => {
    // console.log('page:', page);
    this.setState({ pagination: page });
  };

  onClickShowPreview = () => {
    this.setState({ isShowPreview: true });
  };
  onHidePreview = () => {
    this.setState({ isShowPreview: false });
  };

  onClickShowDialog = type => {
    this.setState({ isShowDialog: true, dialogType: type });
  };

  onHideDialog = () => {
    this.setState({ isShowDialog: false });
  };

  onConfirm = () => {
    this.setState({ tableloading: true });
    PlanServices.deletePlan(this.state.selectedRowKeys[0])
      .then(res => {
        // console.log('DETELEres:', res);
        switch (res) {
          case 0:
            message.success('Plan deleted successfully.');
            this.getPlanList();
            break;
          case 108:
            message.error('There was a problem updating the link selection, please try again later.');
            break;
          case 3:
            message.error('There was an error updating user, please refresh or try again later.');
            break;
          case 2:
            message.error('Failed to delete Plan.');
            break;
          default:
            message.error('An unknown error occurred, please refresh or try again later.');
            break;
        }
      })
      .catch(err => {
        console.log('Fetch error:%S', err);
        this.setState({ tableLoading: false });
        message.error('There is an exception in the interface connection, please refresh or try again later.');
      });
    this.setState({ tableLoading: false });
  };
  render() {
    const rowSelection = { selectedRowKeys: this.state.selectedRowKeys, onChange: this.onSelectChange };

    return (
      <div id="plan-list">
        <CustomBreadcrumb primaryHeading="plan" secondaryHeading="planList" />
        <div className="flex-row margin-bottom-l">
          <Button type="primary" icon={<PlusSquareOutlined />} onClick={this.onClickShowDialog.bind(this, DialogType.Create)}>
            Create New Dream
          </Button>
          <span className="margin-left-m" />
          <Button icon={<EyeOutlined />} disabled={this.state.selectedRowKeys?.length != 1} onClick={this.onClickShowPreview}>
            Preview
          </Button>
          <span className="margin-left-m" />
          <Button icon={<EditOutlined />} disabled={this.state.selectedRowKeys?.length != 1} onClick={this.onClickShowDialog.bind(this, DialogType.Edit)}>
            Edit
          </Button>
          <span className="margin-left-m" />
          <Popconfirm title="Are you sure to delete this Dream?" onConfirm={this.onConfirm} okText="Yes" cancelText="No">
            <Button icon={<DeleteOutlined />} disabled={this.state.selectedRowKeys?.length != 1}>
              Delete
            </Button>
          </Popconfirm>
        </div>
        <Table columns={this.columns} dataSource={this.state.planList} loading={this.state.tableLoading} rowSelection={rowSelection} pagination={this.state.pagination} onChange={this.onChangePage} />
        {this.state.isShowPreview && <PreviewPlan planData={this.state.selectedRows} onHidePreview={this.onHidePreview} isShowPreview={this.state.isShowPreview} />}
        {this.state.isShowDialog && <DialogPlan planData={this.state.selectedRows[0]} dialogType={this.state.dialogType} isShowDialog={this.state.isShowDialog} onHideDialog={this.onHideDialog} getPlanList={this.getPlanList} />}
      </div>
    );
  }
}
