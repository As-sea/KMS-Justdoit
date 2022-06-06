/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import CustomBreadcrumb from '../../CommonComponents/CustomBreadcrumb';
import { Table, Tooltip, Button, notification, Popconfirm, message } from 'antd';
import { DialogType } from '../../Services/EnumValue';
import '../../CommonComponents/commonCss.css';
import { EditOutlined, DeleteOutlined, PlusSquareOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import * as MineServices from '../../Services/PackageServices/MineServices';
import DialogSkill from './DialogSkill';

export default class SkillList extends Component {
  constructor() {
    super();
    this.state = {
      skillList: [],
      tableLoading: true,
      selectedRowKeys: [],
      selectedRows: [],
      isShowDialog: false,
      dialogType: DialogType.Create,
      pagination: {
        current: 1,
        pageSize: 7,
      },
      openCount: 0,
    };
    this.columns = this.initColumns();
  }

  initColumns = () => {
    return [
      {
        title: 'Skills Required',
        dataIndex: 'SkillName',
        render: text => <a>{text}</a>,
        ellipsis: { showTitle: false },
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            <a>{text}</a>
          </Tooltip>
        ),
      },
      {
        title: 'Number of mentions',
        dataIndex: 'OccurrenceFrequency',
        render: a => <>{a}</>,
        align: 'center',
        sorter: (a, b) => b.OccurrenceFrequency - a.OccurrenceFrequency,
      },
    ];
  };
  componentDidMount = () => {
    this.getSkillList();
  };
  getSkillList = () => {
    MineServices.listSkill()
      .then(res => {
        let temp = [];
        // console.log('HabitList:', res);
        res.map(item => {
          temp.push(Object.assign(item, { key: item.SkillName }));
        });
        this.setState({
          skillList: temp,
          tableLoading: false,
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

  onChangePage = page => {
    //console.log('page:', page);
    this.setState({ pagination: page });
  };
  onSelectChange = (selectedRowKeys, selectedRows) => {
    // console.log('ids:', selectedRowKeys);
    this.setState({ selectedRowKeys, selectedRows });
  };
  onClickShowDialog = type => {
    this.setState({ isShowDialog: true, dialogType: type });
  };

  onHideDialog = () => {
    this.setState({ isShowDialog: false });
  };

  confirm = () => {
    this.setState({ tableLoading: true });
    MineServices.deleteSkill(this.state.selectedRowKeys[0])
      .then(res => {
        switch (res) {
          case 0:
            message.success('Deleted successfully.');
            this.getSkillList();
            break;
          case 2:
            message.error('Failed, please refresh or try again later.');
            break;
          default:
            message.error('An unknown error occurred, please refresh or try again later.');
            break;
        }
        this.setState({ tableLoading: false });
      })
      .catch(err => {
        //console.log('Fetch error:%S', err);
        this.setState({ tableLoading: false });
        message.error('There is an exception in the interface connection, please refresh or try again later.');
      });
  };
  render() {
    const rowSelection = { selectedRowKeys: this.state.selectedRowKeys, onChange: this.onSelectChange };

    return (
      <div>
        <CustomBreadcrumb primaryHeading="personal" secondaryHeading="skill" />
        <div className="flex-row margin-bottom-l">
          <Button type="primary" icon={<PlusSquareOutlined />} onClick={this.onClickShowDialog.bind(this, DialogType.Create)}>
            Create a new related person
          </Button>{' '}
          <span className="margin-left-m padding-top-m magin-top-m">
            <Tooltip arrowPointAtCenter title={<span>The name of the skill required does not support repetition. If there is the same name, please add a unique mark after the name.</span>}>
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
          <span className="margin-left-m" />
          <Button icon={<EditOutlined />} disabled={this.state.selectedRowKeys?.length != 1} onClick={this.onClickShowDialog.bind(this, DialogType.Edit)}>
            Edit
          </Button>
          <span className="margin-left-m" />
          <Popconfirm title="Are you sure to delete this person?" onConfirm={this.confirm} okText="Yes" cancelText="No">
            <Button icon={<DeleteOutlined />} disabled={this.state.selectedRowKeys?.length != 1}>
              Delete
            </Button>
          </Popconfirm>
        </div>

        <Table columns={this.columns} dataSource={this.state.skillList} loading={this.state.tableLoading} rowSelection={rowSelection} pagination={this.state.pagination} onChange={this.onChangePage} />
        {this.state.isShowDialog && <DialogSkill skillData={this.state.selectedRows[0]} dialogType={this.state.dialogType} isShowDialog={this.state.isShowDialog} onHideDialog={this.onHideDialog} getSkillList={this.getSkillList} />}
      </div>
    );
  }
}
