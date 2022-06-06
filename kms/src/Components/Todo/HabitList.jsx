/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import CustomBreadcrumb from '../../CommonComponents/CustomBreadcrumb';
import { Table, Tag, Tooltip, Button, notification, Popconfirm, message } from 'antd';
import { DialogType } from '../../Services/EnumValue';
import '../../CommonComponents/commonCss.css';
import { EditOutlined, DeleteOutlined, PlusSquareOutlined, CheckCircleFilled, CloseCircleFilled, SyncOutlined, CheckOutlined } from '@ant-design/icons';
import * as TodoServices from '../../Services/PackageServices/TodoServices';
import DialogHabit from './DialogHabit';

export default class HabitList extends Component {
  constructor() {
    super();
    this.state = {
      habitList: [],
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
        title: 'Habit',
        dataIndex: 'HabitName',
        render: text => <a>{text}</a>,
        ellipsis: { showTitle: false },
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            <a>{text}</a>
          </Tooltip>
        ),
      },
      {
        title: 'Execution Days',
        dataIndex: 'Days',
        render: day => <>{day}</>,
        align: 'center',

        sorter: (a, b) => b.Days - a.Days,
      },
      {
        title: 'Status',
        dataIndex: 'isOpen',
        render: date => (
          <>
            {date ? (
              <>
                <CheckCircleFilled style={{ color: 'green' }} />
                &nbsp;&nbsp;In execution
              </>
            ) : (
              <>
                <CloseCircleFilled style={{ color: 'red' }} />
                &nbsp;&nbsp;Not executed
              </>
            )}
          </>
        ),
        align: 'center',
        filters: [
          {
            text: 'Open',
            value: true,
          },
          {
            text: 'Close',
            value: false,
          },
        ],
        onFilter: (value, record) => record.isOpen === value,
      },
      {
        title: 'Detials',
        dataIndex: 'HabitItem',
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
    this.getHabitList();
  };
  getHabitList = () => {
    TodoServices.listHabit()
      .then(res => {
        let temp = [];
        // console.log('HabitList:', res);
        res.map(item => {
          let day = 0;
          item.KeepDates?.map(d => {
            day = day + this.getDaysBetween(d.StartDate, d.EndDate);
          });
          temp.push(Object.assign(item, { key: item.HabitName, Days: day }));
        });
        // console.log('tempList:', temp);
        this.setState({
          habitList: temp,
          tableLoading: false,
          selectedRowKeys: [],
        });
      })
      .catch(function (e) {
        notification.open({
          message: 'Data Loading Error',
          description: 'Data loading error, please quit and try again or try again later.',
        });
        this.setState({
          tableLoading: false,
        });
      });

    TodoServices.listOpenHabit()
      .then(res => {
        this.setState({ openCount: res?.length });
      })
      .catch(function (e) {
        this.setState({
          tableLoading: false,
        });
        notification.open({
          message: 'Data Loading Error',
          description: 'Data loading error, please quit and try again or try again later.',
        });
      });
  };

  getDaysBetween = (date1, date2) => {
    var startDate = new Date(date1).getTime();
    var endDate = new Date(date2).getTime();
    if (startDate > endDate) {
      return 0;
    }
    if (startDate == endDate) {
      return 1;
    }
    var days = Math.abs(endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
    return Math.ceil(days);
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    // console.log(selectedRows);
    this.setState({ selectedRowKeys, selectedRows });
  };

  onChangePage = page => {
    //console.log('page:', page);
    this.setState({ pagination: page });
  };

  onComplete = () => {
    this.setState({ tableloading: true });
    TodoServices.completeHabit(this.state.selectedRows[0].HabitName)
      .then(res => {
        // console.log('Complete:', res);
        switch (res) {
          case 0:
            message.success(`You have completed today's ${this.state.selectedRows[0].HabitName} habit!  You have completed ${this.state.selectedRows[0].Days + 1} days!!!`);
            this.getHabitList();
            break;
          case 604:
            message.error(`You don't have a habit development plan yet, please create one.`);
            break;
          case 605:
            message.error('This habit is not in execution.');
            break;
          case 606:
            message.error('The Habit was initially created incorrectly, please create it again.');
            break;
          case 607:
            message.error('The Habit is completed today and cannot be repeated.');
            break;
          case 2:
            message.error('Failed, please refresh or try again later.');
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
  confirmChange = () => {
    this.setState({ tableloading: true });
    if (!this.state.selectedRows[0].isOpen && this.state.openCount >= 3) {
      message.warning(`You already have 3 habit development plans, you can't add more! If you want to change, please close the executing Habit.`);
      return false;
    }
    TodoServices.changeStatus(this.state.selectedRows[0].HabitName)
      .then(res => {
        // console.log('Complete:', res);
        switch (res) {
          case 0:
            message.success(`Change Habit Success!`);
            this.getHabitList();
            break;
          case 604:
            message.error(`You don't have a habit development plan yet, please create one.`);
            break;
          case 2:
            message.error('Failed, please refresh or try again later.');
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

  onClickShowDialog = type => {
    this.setState({ isShowDialog: true, dialogType: type });
  };

  onHideDialog = () => {
    this.setState({ isShowDialog: false });
  };

  confirmDelete = () => {
    this.setState({ tableloading: true });
    TodoServices.deleteHabit(this.state.selectedRowKeys[0])
      .then(res => {
        // console.log('DETELEres:', res);
        switch (res) {
          case 0:
            message.success('Deleted successfully.');
            this.getHabitList();
            break;
          case 604:
            message.error(`You don't have a habit development plan yet, please create one.`);
            break;
          case 603:
            message.error('Failed to delete habit.');
            break;
          case 2:
            message.error('Failed, please refresh or try again later.');
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
      <div>
        <CustomBreadcrumb primaryHeading="todo" secondaryHeading="todohabit" />

        <div className="flex-row margin-bottom-l">
          <Button type="primary" icon={<PlusSquareOutlined />} onClick={this.onClickShowDialog.bind(this, DialogType.Create)}>
            Create New Habit
          </Button>
          <span className="margin-left-m" />
          <Button icon={<EditOutlined />} disabled={this.state.selectedRowKeys?.length != 1} onClick={this.onClickShowDialog.bind(this, DialogType.Edit)}>
            Edit
          </Button>
          <span className="margin-left-m" />
          <Popconfirm title="Are you sure to change the status of this habit?" onConfirm={this.confirmChange} okText="Yes" cancelText="No">
            <Button icon={<SyncOutlined />} disabled={this.state.selectedRowKeys?.length != 1}>
              {' '}
              Execute/Abort execute this state
            </Button>
          </Popconfirm>
          <span className="margin-left-m" />
          <Popconfirm title="Are you sure to delete this Dream?" onConfirm={this.confirmDelete} okText="Yes" cancelText="No">
            <Button icon={<DeleteOutlined />} disabled={this.state.selectedRowKeys?.length != 1}>
              Delete
            </Button>
          </Popconfirm>{' '}
          <span className="margin-left-m" />
          <Button type="primary" icon={<CheckOutlined />} disabled={this.state.selectedRowKeys?.length != 1 || !this.state.selectedRows[0]?.isOpen} onClick={this.onComplete}>
            Complete today's habit
          </Button>
        </div>

        <Table columns={this.columns} dataSource={this.state.habitList} loading={this.state.tableLoading} rowSelection={rowSelection} pagination={this.state.pagination} onChange={this.onChangePage} />
        {this.state.isShowDialog && <DialogHabit habitData={this.state.selectedRows[0]} dialogType={this.state.dialogType} isShowDialog={this.state.isShowDialog} onHideDialog={this.onHideDialog} getHabitList={this.getHabitList} openCount={this.state.openCount} />}
      </div>
    );
  }
}
