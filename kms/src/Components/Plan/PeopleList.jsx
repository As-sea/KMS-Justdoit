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
import { EditOutlined, DeleteOutlined, PlusSquareOutlined } from '@ant-design/icons';
import * as PlanServices from '../../Services/PackageServices/PlanServices';
import DialogPeople from './DialogPeople';

export default class PeopleList extends Component {
  constructor() {
    super();
    this.state = {
      peopleList: [],
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
        title: 'Related people',
        dataIndex: 'CharecterName',
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

      {
        title: 'Biography',
        dataIndex: 'PeopleDetails',
        ellipsis: { showTitle: false },
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
    ];
  };
  componentDidMount = () => {
    this.getPeopleList();
  };
  getPeopleList = () => {
    PlanServices.listPeople()
      .then(res => {
        let temp = [];
        // console.log('HabitList:', res);
        res.map(item => {
          temp.push(Object.assign(item, { key: item.CharecterName }));
        });
        this.setState({
          peopleList: temp,
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
    this.setState({ tableloading: true });
    PlanServices.deletePeople(this.state.selectedRowKeys[0])
      .then(res => {
        // console.log('DETELEres:', res);
        switch (res) {
          case 0:
            message.success('Deleted successfully.');
            this.getPeopleList();
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
        console.log('Fetch error:%S', err);
        this.setState({ tableLoading: false });
        message.error('There is an exception in the interface connection, please refresh or try again later.');
      });
  };

  render() {
    const rowSelection = { selectedRowKeys: this.state.selectedRowKeys, onChange: this.onSelectChange };

    return (
      <div>
        <CustomBreadcrumb primaryHeading="plan" secondaryHeading="planPerson" />
        <div className="flex-row margin-bottom-l">
          <Button type="primary" icon={<PlusSquareOutlined />} onClick={this.onClickShowDialog.bind(this, DialogType.Create)}>
            Create a new related person
          </Button>
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
        <Table columns={this.columns} dataSource={this.state.peopleList} loading={this.state.tableLoading} rowSelection={rowSelection} pagination={this.state.pagination} onChange={this.onChangePage} />
        {this.state.isShowDialog && <DialogPeople peopleData={this.state.selectedRows[0]} dialogType={this.state.dialogType} isShowDialog={this.state.isShowDialog} onHideDialog={this.onHideDialog} getPeopleList={this.getPeopleList} />}
      </div>
    );
  }
}
